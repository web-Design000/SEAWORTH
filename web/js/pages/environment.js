    document.addEventListener("DOMContentLoaded", () => {
        const canvas = document.getElementById('envWaveCanvas');
        if (!canvas) return;
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
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        window.addEventListener('resize', resize);
        resize();

        function draw() {
            ctx.clearRect(0, 0, width, height);

            const linesConfig = [
                { type: 'wave', yRel: 0.09 },
                { type: 'echo', yRel: 0.12 },
                { type: 'wave', yRel: 0.91 },
                { type: 'echo', yRel: 0.88 }
            ];

            const stepX = 5;
            time += 0.0012;

            for (let i = 0; i < linesConfig.length; i++) {
                let config = linesConfig[i];
                ctx.beginPath();

                if (config.type === 'wave') {
                    ctx.strokeStyle = 'rgba(14, 18, 23, 0.42)';
                    ctx.lineWidth = 1.4;
                    ctx.setLineDash([]);
                } else {
                    ctx.strokeStyle = 'rgba(14, 18, 23, 0.32)';
                    ctx.lineWidth = 1.4;
                    ctx.setLineDash([2, 6]);
                }

                let baseY = height * config.yRel;

                for (let x = 0; x <= width; x += stepX) {
                    let noiseValue = simplex.noise3D(x * 0.002, i * 0.5, time);
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

            const dots = [
                { xRel: 0.58, yRel: 0.22, seed: 10 },
                { xRel: 0.76, yRel: 0.78, seed: 20 },
                { xRel: 0.15, yRel: 0.76, seed: 30 }
            ];
            ctx.fillStyle = 'rgba(0, 73, 91, 0.35)';
            for (let dot of dots) {
                let baseX = width * dot.xRel;
                let baseY = height * dot.yRel;

                let floatX = simplex.noise3D(dot.seed, 0, time * 0.8) * 35;
                let floatY = simplex.noise3D(0, dot.seed, time * 0.8) * 35;

                let dotX = baseX + floatX;
                let dotY = baseY + floatY;

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
