                    window.addEventListener('DOMContentLoaded', () => {
                        const wrap = document.querySelector('.parallax-wrap');
                        if (wrap) {
                            window.addEventListener('scroll', () => {
                                if (window.innerWidth <= 768) return;
                                const rect = wrap.parentElement.getBoundingClientRect();
                                const windowHeight = window.innerHeight;
                                if (rect.top <= windowHeight && rect.bottom >= 0) {
                                    // Move entire image wrapper opposite to scroll direction
                                    const offset = (rect.top + rect.height / 2) - (windowHeight / 2);
                                    wrap.style.transform = `translateY(${offset * -0.2}px)`;
                                }
                            });
                        }
                    });
                
