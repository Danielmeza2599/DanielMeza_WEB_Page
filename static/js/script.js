// script.js
// Funciones para manejar el carrusel de fotos en la página web
// Autor: Daniel Meza
// Fecha: 30/08/2025

document.addEventListener('DOMContentLoaded', function() {
            // Elementos del DOM
            const carruselContainer = document.querySelector('.carrusel-container');
            const slides = document.querySelectorAll('.slide');
            const prevBtn = document.querySelector('.prev-btn');
            const nextBtn = document.querySelector('.next-btn');
            const indicadores = document.querySelectorAll('.indicador');
            const toggleAutoPlay = document.querySelector('.auto-play-toggle input');
            
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
                    resetAutoPlay();
                });
            });
            
            // Función para reproducción automática
            function startAutoPlay() {
                if (isAutoPlay) {
                    autoPlayInterval = setInterval(() => {
                        goToSlide(currentSlide + 1);
                    }, 3000);
                }
            }
            
            function stopAutoPlay() {
                clearInterval(autoPlayInterval);
            }
            
            function resetAutoPlay() {
                stopAutoPlay();
                if (isAutoPlay) {
                    startAutoPlay();
                }
                else {startAutoPlay();}
            }
            
            // Control de reproducción automática
            toggleAutoPlay.addEventListener('change', function() {
                isAutoPlay = this.checked;
                if (isAutoPlay) {
                    startAutoPlay();
                } else {
                    //stopAutoPlay();
                    startAutoPlay();
                }
            });
            
            // Iniciar reproducción automática al cargar la página
            startAutoPlay();
            
            // Navegación con teclado
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    goToSlide(currentSlide - 1);
                    resetAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    goToSlide(currentSlide + 1);
                    resetAutoPlay();
                }
            });
        });