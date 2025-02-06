
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  // Conexión de Socket.IO
  io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado');
    });

    // Emisión de notificación de orden
    const notifyOrderChange = (orderData) => {
      socket.emit('ORDER_NOTIFICATION', {
        type: 'ORDER_NOTIFICATION',
        data: orderData,
      });
    };

    // Aquí puedes emitir eventos de prueba (simulando un cambio en la orden)
    setInterval(() => {
      notifyOrderChange({
        id: 'order-123',
        status: 'PENDING', // Este valor cambiaría dinámicamente
      });
    }, 10000); // Notificación cada 10 segundos (solo para pruebas)
  });

  // Ruta para manejar las solicitudes de Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Servidor listo en http://localhost:3000');
  });
});
