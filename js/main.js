// ================================
// CARRUSEL — 3 vistas simultáneas
// izquierda | centro | derecha
// ================================

const slides     = document.querySelectorAll('.carrusel-slide');
const total      = slides.length;
let slideActual  = 0;
const intervalo  = 3500;

function irASlide(indice) {

    // Limpia todas las clases de posición
    slides.forEach(s => {
        s.classList.remove('activo', 'lateral-izq', 'lateral-der');
    });

    // Calcula los índices de izquierda y derecha
    // El % total hace que sea circular (después del último viene el primero)
    const izq = (indice - 1 + total) % total;
    const der = (indice + 1) % total;

    // Asigna la clase correspondiente a cada uno
    slides[izq].classList.add('lateral-izq');
    slides[indice].classList.add('activo');
    slides[der].classList.add('lateral-der');

    slideActual = indice;
}

// Avanza al siguiente
function siguiente() {
    irASlide((slideActual + 1) % total);
}

// Arranca
irASlide(0);
let timer = setInterval(siguiente, intervalo);

// Click en slide lateral lo convierte en activo
slides.forEach((slide, indice) => {
    slide.addEventListener('click', () => {
        clearInterval(timer);
        irASlide(indice);
        timer = setInterval(siguiente, intervalo);
    });
});


// ================================
// GALERÍA DINÁMICA — Lee carpetas
// automáticamente desde el servidor
// ================================

const galeriaGrid = document.getElementById('galeria-grid');
const filtros     = document.querySelectorAll('.filtro-btn');
let imagenesGaleria = {};  // Se llena automáticamente desde el servidor

// ================================
// 1. Pide al servidor la lista de
//    imágenes de todas las carpetas
// ================================
async function cargarImagenes() {
    try {
        const respuesta = await fetch('/api/imagenes');
        imagenesGaleria = await respuesta.json();

        // Una vez que tiene los datos construye la galería
        construirGaleria('todos');

    } catch (error) {
        console.error('Error cargando imágenes:', error);
    }
}

// ================================
// 2. Construye el HTML de la galería
// ================================
function construirGaleria(categoriaFiltro) {

    galeriaGrid.innerHTML = '';

    const categorias = categoriaFiltro === 'todos'
        ? Object.keys(imagenesGaleria)
        : [categoriaFiltro];

    let contador = 0;

    categorias.forEach(categoria => {
        imagenesGaleria[categoria].forEach(archivo => {

            const esGrande = contador % 3 === 0 ? 'grande' : '';
            contador++;

            const item = document.createElement('div');
            item.classList.add('galeria-item');
            if (esGrande) item.classList.add('grande');
            item.dataset.categoria = categoria;

            item.innerHTML = `
                <img 
                    src="images/${categoria}/${archivo}" 
                    alt="${categoria}"
                    loading="lazy"
                >
                <div class="galeria-overlay">
                    <p>${categoria.charAt(0).toUpperCase() + categoria.slice(1)}</p>
                </div>
            `;

            galeriaGrid.appendChild(item);
        });
    });
}

// ================================
// 3. Filtros
// ================================
filtros.forEach(boton => {
    boton.addEventListener('click', () => {
        filtros.forEach(b => b.classList.remove('activo'));
        boton.classList.add('activo');
        construirGaleria(boton.dataset.filtro);
    });
});

// 4. Arranca todo
cargarImagenes();