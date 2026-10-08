        (function() {
            const row = document.querySelector('.audit-stats-row');
            if (!row) return;
            const items = Array.from(row.querySelectorAll('.audit-stat-value')).map(el => {
                const suffixEl = el.querySelector('.num-sym');
                const suffixHTML = suffixEl ? suffixEl.outerHTML : '';
                const target = parseInt(el.textContent, 10) || 0;
                // 立即設定為 0
                el.innerHTML = '0' + suffixHTML;
                return { el, target, suffixHTML };
            });

            function animate(duration) {
                duration = duration || 800;
                const start = performance.now();
                let lastUpdate = 0;
                
                function tick(now) {
                    const t = Math.min(1, (now - start) / duration);
                    
                    if (now - lastUpdate > 50 || t === 1) {
                        items.forEach(item => {
                            if (t < 1) {
                                const maxVal = Math.pow(10, item.target.toString().length);
                                const randomNum = Math.floor(Math.random() * maxVal);
                                item.el.innerHTML = randomNum + item.suffixHTML;
                            } else {
                                item.el.innerHTML = item.target + item.suffixHTML;
                            }
                        });
                        lastUpdate = now;
                    }
                    
                    if (t < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            }

            window.addEventListener('load', () => {
                setTimeout(() => {
                    const observer = new IntersectionObserver((entries, obs) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                setTimeout(() => animate(), 300);
                                obs.disconnect();
                            }
                        });
                    }, { threshold: 0.1 });
                    observer.observe(row);
                }, 500);
            });
        })();
    
