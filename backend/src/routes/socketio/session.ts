import { getUserByIdForWebsocket, updateUser } from '../services/user.service';

export const handleLogin = async (data: any, cache: any, socket: any) => {
  const userId = data;
  const user: any = await getUserByIdForWebsocket(+userId);

  const online: { email: string; socketId: string }[] = cache.get('online');
  if (online) {
    // to remove duplicates on refresh
    const exists = online.find((onlineUser) => onlineUser.email === user.email);
    if (exists) {
      online.splice(online.indexOf(exists), 1, {
        email: user.email,
        socketId: socket.id,
      });
    } else {
      online.push({
        email: user.email,
        socketId: socket.id,
      });
    }

    cache.set('online', online);
  } else {
    cache.set('online', [{ email: user.email, socketId: socket.id }]);
  }
  console.log(online);

  if (user) {
    const flatServers = user.servers
      .concat(user.myServers)
      .map((server: any) => {
        // join server rooms by id
        socket.join(`server-${server.id}`);
        return server.id;
      });
    const flatFriends = user.friends.map((friend: any) => {
      if (online) {
        const friendSocket: any = online.find(
          (f: any) => f.email === friend.email,
        );
        if (friendSocket) {
          // only publish to friends
          socket.to(friendSocket.socketId).emit('message', {
            type: 'friend-online',
            data: user,
          });
        }
      }
      return friend.email;
    });

    // friends only need flattened objects
    delete user.friends;
    delete user.servers;
    delete user.myServers;
    user.servers = flatServers;
    user.friends = flatFriends;
  }
};

export const handleLogout = async (data: any, cache: any, socket: any) => {
  const user: any = await getUserByIdForWebsocket(+data.id);
  await updateUser({
    ...user,
    online: false,
  });

  const online: string[] = cache.get('online');

  if (user) {
    user.friends.map((friend: any) => {
      if (online) {
        const friendSocket: any = online.find(
          (f: any) => f.email === friend.email,
        );
        if (friendSocket) {
          socket.to(friendSocket.socketId).emit('message', {
            type: 'friend-offline',
            data: user,
          });
        }
      }
      return friend.email;
    });

    if (online) {
      cache.set(
        'online',
        online.filter((onlineUser: any) => onlineUser.email !== user.email),
      );
    }
  }
};
