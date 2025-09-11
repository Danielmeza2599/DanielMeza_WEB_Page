// script.js
// Funciones para navegar entre secciones de la página web y mostrar en el contenido principal
// Funciones para manejar el carrusel de fotos en la página web
// Autor: Daniel Meza
// Fecha: 30/08/2025

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const mainContent = document.getElementById('main-content');
    // Guardar el contenido inicial para restaurarlo después
    const initialContentHTML = mainContent.innerHTML;

    // Función para cargar secciones internas
    window.loadSection = function(section) {
        let file = '';
        switch(section) {
            case 'work_experience':
                file = './static/pages/work_experience.html';
                break;
            case 'academic_information':
                file = './static/pages/academic_information.html';
                break;
            case 'skills':
                file = './static/pages/skills.html';
                break;
            case 'home':
            default:
                // Restaurar el contenido inicial sin recargar la página
                mainContent.innerHTML = initialContentHTML;
                // Reiniciar el carrusel si es necesario
                initializeCarousel();
                return;
        }
        fetch(file)
            .then(response => response.text())
            .then(html => {
                mainContent.innerHTML = html;
            })
            .catch(err => {
                mainContent.innerHTML = '<p>Error al cargar la sección.</p>';
            });
    }

    // Encapsular la lógica del carrusel en una función para poder llamarlo nuevamente
function initializeCarousel() {
     const carruselContainer = document.querySelector('.carrusel-container');
        if (!carruselContainer) return; // Salir si el carrusel no está en el DOM

        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const indicadores = document.querySelectorAll('.indicador');
        
        let currentSlide = 0;
        let autoPlayInterval;

        // -- Inicio de la lógica felxible del carrusel --
        const numSlides = slides.length;

        // 1. Hacer el contenedor lo suficientemente ancho para todos los slides
        carruselContainer.style.width = `${numSlides * 100}%`;

        // 2. Asignar el ancho correcto a cada slide individual
        slides.forEach(slide => {
            slide.style.width = `${100 / numSlides}%`;
        });

        // -- Fin de la lógica flexible del carrusel --
        
        function goToSlide(index) {
            if (index < 0) {
                index = numSlides - 1;
            } else if (index >= numSlides) {
                index = 0;
            }
            
            currentSlide = index;

            // Cálculo dinámico del desplazamiento
            carruselContainer.style.transform = `translateX(-${currentSlide * (100 / numSlides)}%)`;
            
            indicadores.forEach((ind, i) => {
                ind.classList.toggle('activo', i === currentSlide);
            });
    }

    function startAutoPlay() {
        clearInterval(autoPlayInterval); // Limpiar cualquier intervalo existente
        autoPlayInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
        }, 6000);
    }

    // Eventos de botones y navegación
    prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            startAutoPlay();
        });
        
    nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            startAutoPlay();
        });
        
        indicadores.forEach(ind => {
            ind.addEventListener('click', () => {
                goToSlide(parseInt(ind.getAttribute('data-index')));
                startAutoPlay();
            });
        });

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                goToSlide(currentSlide - 1);
                startAutoPlay();
            } else if (e.key === 'ArrowRight') {
                goToSlide(currentSlide + 1);
                startAutoPlay();
            }
        });
        
        startAutoPlay();
    }

    // Iniciar el carrusel la primera vez que carga la página
    initializeCarousel();
});               