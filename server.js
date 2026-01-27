// Servidor HTTP simple para servir archivos estáticos
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Limpiar la URL - remover query strings y fragmentos
    let urlPath = req.url.split('?')[0].split('#')[0];
    let filePath = path.join(__dirname, urlPath);
    
    // Si es la raíz, servir index.html
    if (urlPath === '/' || urlPath === '') {
        filePath = path.join(__dirname, 'index.html');
    }
    
    // Normalizar la ruta
    filePath = path.normalize(filePath);
    
    // Seguridad: asegurar que el archivo esté dentro del directorio del proyecto
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end('<h1>403 - Acceso denegado</h1>', 'utf-8');
        return;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Error del servidor: ${error.code}`, 'utf-8');
            }
        } else {
            // Agregar headers CORS y cache para desarrollo
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('');
    console.log('========================================');
    console.log(`🚀 Servidor HTTP iniciado!`);
    console.log(`📂 Sirviendo archivos desde: ${__dirname}`);
    console.log(`🌐 Abre tu navegador en: http://localhost:${PORT}`);
    console.log(`🌐 O también: http://127.0.0.1:${PORT}`);
    console.log('');
    console.log('Presiona Ctrl+C para detener el servidor');
    console.log('========================================');
    console.log('');
});
