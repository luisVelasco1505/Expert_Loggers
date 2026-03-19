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