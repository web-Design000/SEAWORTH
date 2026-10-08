        document.addEventListener("DOMContentLoaded", () => {
            const canvas = document.getElementById('sectorWaveCanvas');
            if(!canvas) return;
            const ctx = canvas.getContext('2d');
            
            let width, height;
            let simplex = new SimplexNoise();
            let time = 0;

            function resize() {
                const rect = canvas.parentElement.getBoundingClientRect();
                width = rect.width;
                height = rect.height;
                canvas.width = width * window.devicePixelRatio;
                canvas.height = height * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
            
            window.addEventListener('resize', resize);
            resize();

            function draw() {
                ctx.clearRect(0, 0, width, height);
                
                const linesConfig = [
                    { type: 'wave', yRel: 0.032 },
                    { type: 'echo', yRel: 0.056 },
                    { type: 'wave', yRel: 0.968 },
                    { type: 'echo', yRel: 0.944 }
                ];

                const stepX = 5; 
                time += 0.0012; // 減緩波浪流動速度

                for (let i = 0; i < linesConfig.length; i++) {
                    let config = linesConfig[i];
                    ctx.beginPath();
                    
                    if (config.type === 'wave') {
                        ctx.strokeStyle = 'rgba(14, 18, 23, 0.28)'; // 稍微加深主線
                        ctx.lineWidth = 1.2;
                        ctx.setLineDash([]);
                    } else {
                        ctx.strokeStyle = 'rgba(14, 18, 23, 0.2)'; // 顯著加深虛線 (原本 0.1)
                        ctx.lineWidth = 1.2; // 稍微加粗虛線 (原本 1)
                        ctx.setLineDash([2, 6]); // 調整虛線比例，使其更明顯
                    }

                    let baseY = height * config.yRel;
                    
                    for (let x = 0; x <= width; x += stepX) {
                        // 增加頻率 (x * 0.002) 讓波浪起伏更密集
                        let noiseValue = simplex.noise3D(x * 0.002, i * 0.5, time);
                        // 增加振幅 (35) 讓起伏更大 (原本 15)
                        let offsetY = noiseValue * 35;
                        
                        let y = baseY + offsetY;
                        
                        if (x === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                    ctx.stroke();
                }
                
                // Draw independent floating dots
                const dots = [
                    { xRel: 0.58, yRel: 0.08, seed: 10 }, 
                    { xRel: 0.76, yRel: 0.985, seed: 20 }, // 右邊原點改回線條下方 (yRel 0.985)
                    { xRel: 0.15, yRel: 0.92, seed: 30 }  // 左邊原點往下移一點，但仍保持在線條上方 (yRel 0.92)
                ];
                ctx.fillStyle = 'rgba(0, 73, 91, 0.35)'; // 降低不透明度，讓原點呈現半透明質感
                for (let dot of dots) {
                    let baseX = width * dot.xRel;
                    let baseY = height * dot.yRel;
                    
                    let floatX = simplex.noise3D(dot.seed, 0, time * 0.8) * 35;
                    let floatY = simplex.noise3D(0, dot.seed, time * 0.8) * 35;
                    
                    let dotX = baseX + floatX;
                    let dotY = baseY + floatY;
                    
                    // 防止原點飄出畫布邊界被裁切
                    if (dotY > height - 5) dotY = height - 5;
                    if (dotY < 5) dotY = 5;
                    
                    ctx.beginPath();
                    ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
                    ctx.fill();
                }

                if (isAnimating) {
                    rafId = requestAnimationFrame(draw);
                }
            }

            // 只在這個裝飾區塊實際進入畫面時才跑動畫，滾走就暫停，
            // 避免 requestAnimationFrame 在背景無限空轉、白白耗電。
            // 手機版這個 canvas 本身是 display:none（見 CSS），沒有版面盒，
            // IntersectionObserver 永遠回報「不在畫面內」，動畫自然不會啟動。
            let isAnimating = false;
            let rafId = null;
            const lineartObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!isAnimating) {
                            isAnimating = true;
                            draw();
                        }
                    } else {
                        isAnimating = false;
                        if (rafId) cancelAnimationFrame(rafId);
                    }
                });
            }, { threshold: 0 });
            lineartObserver.observe(canvas);
        });
    
