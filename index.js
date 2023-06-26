const app = require('./app');
const http = require('http');
const path = require('path');
const fs = require('fs');
const mime = require('mime');

const server = http.createServer(app);

server.listen(3003, () => {
  console.log('Servidor: http://localhost:3003/');
  console.log('Puerto: 3003');
});

// Manejo de archivos estáticos con tipo MIME correcto
app.use((req, res, next) => {
  const filePath = path.join(__dirname, 'public', req.url);
  const contentType = mime.getType(filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Archivo no encontrado
        res.writeHead(404);
        res.end('Archivo no encontrado');
      } else {
        // Error de servidor
        res.writeHead(500);
        res.end('Error de servidor');
      }
    } else {
      // Configurar el tipo MIME correcto
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});
