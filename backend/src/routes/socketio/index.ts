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
      socket.to(`server-${data.server.id}`).emit('message', {
        type: 'replace-server',
        data: data.server,
      });
      break;
    case 'delete-server':
      socket.broadcast.emit('message', {
        type: 'delete-server',
        data: data.serverId,
      });
      break;
    case 'channel-message':
      const serverId = data.message.channel.serverId;
      socket.to(`server-${serverId}`).emit('message', message);
      break;
    case 'replace-message':
      // socket
      //   .to(`server-${data.serverId}`)
      //   .emit('message', { type: 'replace-message', data: data.message });
      socket.broadcast.emit('message', {
        type: 'replace-message',
        data: data.message,
      });
    default:
      break;
  }
};
