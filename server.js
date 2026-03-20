// ================================
// SERVIDOR — Expert Loggers
// ================================

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PUERTO = 3000;
const CARPETA_IMAGENES = path.join(__dirname, 'images');

// ================================
// Tipos de archivo que el servidor
// sabe responder
// ================================
const tiposArchivo = {
    '.html' : 'text/html',
    '.css'  : 'text/css',
    '.js'   : 'text/javascript',
    '.jpg'  : 'image/jpeg',
    '.jpeg' : 'image/jpeg',
    '.png'  : 'image/png',
    '.webp' : 'image/webp',
    '.json' : 'application/json',
};

// ================================
// Función que lee una carpeta
// y devuelve solo archivos de imagen
// ================================
function leerImagenes(carpeta) {
    const extensionesValidas = ['.jpg', '.jpeg', '.png', '.webp'];

    try {
        return fs.readdirSync(carpeta)
            .filter(archivo => {
                const ext = path.extname(archivo).toLowerCase();
                return extensionesValidas.includes(ext);
            });
    } catch (error) {
        return [];  // Si la carpeta no existe devuelve array vacío
    }
}

// ================================
// El servidor escucha cada petición
// ================================
const servidor = http.createServer((peticion, respuesta) => {

    // Habilita CORS para que el navegador acepte las respuestas
    respuesta.setHeader('Access-Control-Allow-Origin', '*');

    // ================================
    // RUTA ESPECIAL: /api/imagenes
    // Devuelve todas las imágenes
    // organizadas por categoría
    // ================================
    if (peticion.url === '/api/imagenes') {

        const categorias = fs.readdirSync(CARPETA_IMAGENES)
            .filter(item => {
                const ruta = path.join(CARPETA_IMAGENES, item);
                return fs.statSync(ruta).isDirectory(); // Solo carpetas
            });

        // Construye el objeto de datos
        const resultado = {};
        categorias.forEach(categoria => {
            const rutaCategoria = path.join(CARPETA_IMAGENES, categoria);
            resultado[categoria] = leerImagenes(rutaCategoria);
        });

        // Responde con JSON
        respuesta.writeHead(200, { 'Content-Type': 'application/json' });
        respuesta.end(JSON.stringify(resultado));
        return;
    }

    // ================================
    // RUTA NORMAL: sirve los archivos
    // del proyecto (html, css, js, img)
    // ================================
    let rutaArchivo = peticion.url === '/'
        ? '/index.html'
        : peticion.url;

    const rutaCompleta = path.join(__dirname, rutaArchivo);
    const extension    = path.extname(rutaCompleta);
    const tipoContenido = tiposArchivo[extension] || 'text/plain';

    fs.readFile(rutaCompleta, (error, contenido) => {
        if (error) {
            respuesta.writeHead(404);
            respuesta.end('Archivo no encontrado');
            return;
        }
        respuesta.writeHead(200, { 'Content-Type': tipoContenido });
        respuesta.end(contenido);
    });

});

servidor.listen(PUERTO, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PUERTO}`);
});