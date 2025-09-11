// script.js
// Funciones para navegar entre secciones de la página web y mostrar en el contenido principal
// Funciones para manejar el carrusel de fotos en la página web
// Autor: Daniel Meza
// Fecha: 30/08/2025

document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar secciones internas
    window.loadSection = function(section) {
        const mainContent = document.getElementById('main-content');
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
                // Recarga el contenido inicial (se puede guardar el HTML inicial en una variable , tarea de mejora) )
                location.reload();
                startAutoPlay();
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
            // Elementos del DOM
            const carruselContainer = document.querySelector('.carrusel-container');
            const slides = document.querySelectorAll('.slide');
            const prevBtn = document.querySelector('.prev-btn');
            const nextBtn = document.querySelector('.next-btn');
            const indicadores = document.querySelectorAll('.indicador');
            /*const toggleAutoPlay = document.querySelector('.auto-play-toggle input');*/
            
            // Variables de estado
            let currentSlide = 0;
            let isAutoPlay = true; // Cambiado a true para iniciar con autoplay activado
            let autoPlayInterval;
            
            // Función para cambiar de slide
            function goToSlide(index) {
                if (index < 0) {
                    index = slides.length - 1;
                } else if (index >= slides.length) {
                    index = 0;
                }
                
                currentSlide = index;
                carruselContainer.style.transform = `translateX(-${currentSlide * 25}%)`;
                
                // Actualizar indicadores
                indicadores.forEach((ind, i) => {
                    ind.classList.toggle('activo', i === currentSlide);
                });
            }
            
            // Navegación con botones
            prevBtn.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
                resetAutoPlay();
            });
            
            nextBtn.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
                resetAutoPlay();
            });
            
            // Navegación con indicadores
            indicadores.forEach(ind => {
                ind.addEventListener('click', () => {
                    goToSlide(parseInt(ind.getAttribute('data-index')));
                    startAutoPlay();
                });
            });
            
            // Función para reproducción automática
            function startAutoPlay() {
                if (isAutoPlay) {
                    autoPlayInterval = setInterval(() => {
                        goToSlide(currentSlide + 1);
                    }, 6000);
                }
            }
            
            // Iniciar reproducción automática al cargar la página
            startAutoPlay();
            
            // Navegación con teclado
            /* Funcionando */
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    goToSlide(currentSlide - 1);
                    startAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    goToSlide(currentSlide + 1);
                    startAutoPlay();
                }
            });
        });