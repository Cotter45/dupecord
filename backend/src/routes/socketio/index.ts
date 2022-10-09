import { handleLogin, handleLogout } from './session';

export const handleMessages = async (
  socket: any,
  message: { type: string; data: any },
  cache: any,
) => {
  const { type, data } = message;
  console.log('MESSAGES', type, data);

  switch (type) {
    case 'login':
      await handleLogin(data, cache, socket);
      break;
    case 'logout':
      await handleLogout(data, cache, socket);
      break;
    case 'replace-server':
      console.log(data.server.id, 'CREATE CHANNEL');
      socket.to(`server-${data.server.id}`).emit('message', {
        type: 'replace-server',
        data: data.server,
      });
      break;
    case 'delete-server':
      console.log(data.serverId, 'DELETE SERVER');
      socket.broadcast.emit('message', {
        type: 'delete-server',
        data: data.serverId,
      });
      break;
    case 'channel-message':
      console.log('HITTING PLACE');
      const serverId = data.message.channel.serverId;
      socket.to(`server-${serverId}`).emit('message', message);
      break;
    case 'replace-message':
      console.log('like message');
      const serverId2 = +data.serverId;
      console.log(serverId2);
      socket.broadcast.emit('message', {
        type: 'replace-message',
        data: data.message,
      });
    default:
      break;
  }
};
