import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  const email = 'demo@demo.com';
  const password = await bcrypt.hash('password', 10);

  await prisma.user.delete({ where: { email } }).catch(() => {
    return console.log('User not found');
  });

  const demoUser = await prisma.user.create({
    data: {
      email,
      username: 'demo',
      profilePicture: '/discordia.svg',
      password: {
        create: {
          password,
        },
      },
    },
  });

  const server1 = await prisma.server.create({
    data: {
      name: 'Test Server',
      icon: '/discordia.svg',
      owner: {
        connect: {
          id: demoUser.id,
        },
      },
    },
  });

  const text = await prisma.category.create({
    data: {
      name: 'Text Channels',
      server: {
        connect: {
          id: server1.id,
        },
      },
    },
  });

  const voice = await prisma.category.create({
    data: {
      name: 'Voice Channels',
      server: {
        connect: {
          id: server1.id,
        },
      },
    },
  });

  await prisma.server.create({
    data: {
      name: 'Demo Server',
      icon: '/discordia.svg',
      owner: {
        connect: {
          id: demoUser.id,
        },
      },
      channels: {
        create: [
          {
            name: 'text',
            category: {
              connect: {
                id: text.id,
              },
            },
          },
          {
            name: 'voice',
            category: {
              connect: {
                id: voice.id,
              },
            },
          },
        ],
      },
    },
  });

  console.log('User, Server, Channels created');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
