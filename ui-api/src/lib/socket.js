import { Server } from 'socket.io';

const globalForSocket = global;

const connectSocket = () => {
	const io = new Server({
		cors: {
			origin: '*',
		},
	});
	io.listen(process.env.NEXT_PUBLIC_WS_SERVER_PORT);

	return io;
};

export const socket = globalForSocket.socket || connectSocket();

if (process.env.NODE_ENV !== 'production') globalForSocket.socket = socket;

export default socket;
