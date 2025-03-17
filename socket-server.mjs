import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

const httpServer = createServer();

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log(`Admin conectado por WebSocket: ${socket.id}`);

  socket.on('nuevaOrden', (data) => {
    console.log('Nueva orden recibida en el servidor WebSocket:', data);
    io.emit('nuevaOrden', data);
  });

  socket.on('disconnect', () => {
    console.log(`Admin desconectado por WebSocket: ${socket.id}`);
  });
});

const PORT_SOCKET = 3001;
httpServer.listen(PORT_SOCKET, () => {
  console.log(`Servidor WebSocket escuchando en el puerto ${PORT_SOCKET}`);
});

export default io;