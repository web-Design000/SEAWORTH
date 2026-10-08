        // 圖片視差滾動效果 (Parallax Scrolling)
        (function() {
            const parallaxImages = document.querySelectorAll('.card-img-wrapper img, .about-hero-banner img');
            
            function animateParallax() {
                parallaxImages.forEach(img => {
                    const wrapper = img.parentElement;
                    const rect = wrapper.getBoundingClientRect();
                    // 確保元素在畫面內才進行運算
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        // 計算滾動進度：0代表剛進入畫面底部，1代表即將離開畫面頂部
                        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                        
                        // 擴大位移範圍，從 -30% 到 0%，讓滾動效果非常明顯
                        const translateY = -30 + (progress * 30); 
                        img.style.transform = `translateY(${translateY}%)`;
                    }
                });
            }
            
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        animateParallax();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
            // 初始化呼叫一次，確保初始位置正確
            animateParallax();
        })();

        // Hero 幻燈片 Morph 轉場（WebGL 位移融化效果，仿 reactbits MorphSlider intensity=0.3）
        (function() {
            const wrapper = document.querySelector('.hero-bg-wrapper');
            const canvas = document.getElementById('heroMorphCanvas');
            if (!wrapper || !canvas) return;

            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return; // 不支援 WebGL 時，交回原本的 CSS 淡入淡出效果

            const VERT_SRC = `
                attribute vec2 aPos;
                varying vec2 vUv;
                void main() {
                    vUv = aPos * 0.5 + 0.5;
                    gl_Position = vec4(aPos, 0.0, 1.0);
                }
            `;
            const FRAG_SRC = `
                precision highp float;
                uniform sampler2D uTexA;
                uniform sampler2D uTexB;
                uniform float uProgress;
                uniform float uIntensity;
                uniform float uScale;
                uniform float uTime;
                uniform vec2 uResolution;
                uniform vec2 uTexASize;
                uniform vec2 uTexBSize;
                varying vec2 vUv;

                float hash21(vec2 p) {
                    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
                    p3 += dot(p3, p3.yzx + 33.33);
                    return fract((p3.x + p3.y) * p3.z);
                }
                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    vec2 u = f * f * (3.0 - 2.0 * f);
                    float a = hash21(i);
                    float b = hash21(i + vec2(1.0, 0.0));
                    float c = hash21(i + vec2(0.0, 1.0));
                    float d = hash21(i + vec2(1.0, 1.0));
                    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
                }
                float fbm(vec2 p) {
                    float v = 0.0;
                    float a = 0.5;
                    for (int i = 0; i < 5; i++) {
                        v += a * noise(p);
                        p *= 2.0;
                        a *= 0.5;
                    }
                    return v;
                }
                vec2 coverUv(vec2 uv, vec2 res, vec2 texSize) {
                    float rA = res.x / max(res.y, 1.0);
                    float iA = texSize.x / max(texSize.y, 1.0);
                    vec2 s = vec2(1.0);
                    float ratio = rA / max(iA, 0.0001);
                    if (ratio > 1.0) { s.y = 1.0 / ratio; } else { s.x = ratio; }
                    return (uv - 0.5) * s + 0.5;
                }

                void main() {
                    float p = clamp(uProgress, 0.0, 1.0);
                    // 對應 .hero-bg-img 的 CSS transform: scale(1.02) 基準縮放，
                    // 否則轉場結束、畫面交還給真正的 <img> 時會突然放大 2% 產生一下顫動
                    vec2 uv = (vUv - 0.5) / 1.02 + 0.5;

                    // 仿 reactbits MorphSlider 的 melt 轉場：以 fbm 噪聲做局部位移融化，
                    // 邊界由噪聲值與進度共同決定，而非單純直線擦除
                    float nn = fbm(uv * uScale + uTime * 0.03);
                    float warp = fbm(uv * uScale * 1.7 - uTime * 0.02);
                    vec2 g = vec2(nn, warp) - 0.5;
                    vec2 uvA = uv + g * uIntensity * 0.5 * p;
                    vec2 uvB = uv - g * uIntensity * 0.5 * (1.0 - p);
                    float m = smoothstep(nn - 0.15, nn + 0.15, p);

                    vec2 sA = coverUv(uvA, uResolution, uTexASize);
                    vec2 sB = coverUv(uvB, uResolution, uTexBSize);

                    vec4 colA = texture2D(uTexA, clamp(sA, 0.001, 0.999));
                    vec4 colB = texture2D(uTexB, clamp(sB, 0.001, 0.999));
                    vec3 outColor = mix(colA.rgb, colB.rgb, m);
                    gl_FragColor = vec4(outColor, 1.0);
                }
            `;

            function compileShader(type, src) {
                const s = gl.createShader(type);
                gl.shaderSource(s, src);
                gl.compileShader(s);
                if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                    console.warn('Hero morph shader error:', gl.getShaderInfoLog(s));
                }
                return s;
            }

            const program = gl.createProgram();
            gl.attachShader(program, compileShader(gl.VERTEX_SHADER, VERT_SRC));
            gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, FRAG_SRC));
            gl.linkProgram(program);
            gl.useProgram(program);

            const quadBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
            const aPos = gl.getAttribLocation(program, 'aPos');
            gl.enableVertexAttribArray(aPos);
            gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

            const uTexA = gl.getUniformLocation(program, 'uTexA');
            const uTexB = gl.getUniformLocation(program, 'uTexB');
            const uProgress = gl.getUniformLocation(program, 'uProgress');
            const uIntensity = gl.getUniformLocation(program, 'uIntensity');
            const uScale = gl.getUniformLocation(program, 'uScale');
            const uTime = gl.getUniformLocation(program, 'uTime');
            const uResolution = gl.getUniformLocation(program, 'uResolution');
            const uTexASize = gl.getUniformLocation(program, 'uTexASize');
            const uTexBSize = gl.getUniformLocation(program, 'uTexBSize');

            function createTexture() {
                const tex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                return tex;
            }

            // 把來源圖片先縮小畫到離屏 canvas 上限制最長邊，避免把動輒 5000px+ 的原圖整張上傳給顯卡
            const MAX_TEX_DIM = 1920;
            const scratchCanvas = document.createElement('canvas');
            const scratchCtx = scratchCanvas.getContext('2d');
            function downscaleForTexture(img) {
                const w = img.naturalWidth || img.width;
                const h = img.naturalHeight || img.height;
                const scale = Math.min(1, MAX_TEX_DIM / Math.max(w, h));
                const tw = Math.max(1, Math.round(w * scale));
                const th = Math.max(1, Math.round(h * scale));
                scratchCanvas.width = tw;
                scratchCanvas.height = th;
                scratchCtx.drawImage(img, 0, 0, tw, th);
                return { source: scratchCanvas, width: tw, height: th };
            }

            // 貼圖快取：同一張圖只上傳一次 GPU，換頁時直接重複使用，避免每次轉場都重新上傳造成卡頓
            const textureCache = new Map();
            function getTexture(img) {
                const cached = textureCache.get(img.currentSrc || img.src);
                if (cached) return cached;
                const { source, width, height } = downscaleForTexture(img);
                const tex = createTexture();
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
                const entry = { tex, width, height };
                textureCache.set(img.currentSrc || img.src, entry);
                return entry;
            }

            function resize() {
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = Math.round(wrapper.clientWidth * dpr);
                canvas.height = Math.round(wrapper.clientHeight * dpr);
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
            window.addEventListener('resize', resize);
            resize();

            // 預先把所有幻燈片圖片上傳成貼圖（分散到閒置時間執行），第一次真正切換時就不用再等上傳
            const allSlideImgs = document.querySelectorAll('.hero-bg-img');
            function prewarm(i) {
                if (i >= allSlideImgs.length) return;
                const img = allSlideImgs[i];
                const go = () => {
                    if (img.complete) { try { getTexture(img); } catch (e) {} }
                    prewarm(i + 1);
                };
                if (img.complete) go();
                else img.addEventListener('load', go, { once: true });
            }
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => prewarm(0));
            } else {
                setTimeout(() => prewarm(0), 300);
            }

            const INTENSITY = 0.3;
            const SCALE = 2.4;
            let animating = false;
            let rafId = null;

            function easeInOutQuad(t) {
                // 對應 gsap 的 power2.inOut
                return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            }

            function runMorph(fromImg, toImg, duration, onDone) {
                if (animating) return;
                if (!fromImg.complete || !toImg.complete) { onDone(); return; }
                animating = true;
                canvas.classList.add('active');

                let a, b;
                try {
                    a = getTexture(fromImg);
                    b = getTexture(toImg);

                    gl.useProgram(program);
                    gl.uniform1i(uTexA, 0);
                    gl.uniform1i(uTexB, 1);
                    gl.uniform1f(uIntensity, INTENSITY);
                    gl.uniform1f(uScale, SCALE);
                    gl.uniform2f(uResolution, canvas.width, canvas.height);
                    gl.uniform2f(uTexASize, a.width, a.height);
                    gl.uniform2f(uTexBSize, b.width, b.height);
                } catch (err) {
                    // 本機以 file:// 開啟時，部分瀏覽器會擋跨源畫布讀取（tainted canvas）
                    console.warn('Hero morph disabled (WebGL texture upload failed):', err);
                    animating = false;
                    canvas.classList.remove('active');
                    delete window.heroMorphTransition;
                    onDone();
                    return;
                }

                const start = performance.now();
                function frame(now) {
                    const elapsed = now - start;
                    const t = Math.min(1, elapsed / duration);
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, a.tex);
                    gl.activeTexture(gl.TEXTURE1);
                    gl.bindTexture(gl.TEXTURE_2D, b.tex);
                    gl.uniform1f(uProgress, easeInOutQuad(t));
                    gl.uniform1f(uTime, elapsed * 0.001);
                    gl.drawArrays(gl.TRIANGLES, 0, 3);

                    if (t < 1) {
                        rafId = requestAnimationFrame(frame);
                    } else {
                        canvas.classList.remove('active');
                        animating = false;
                        rafId = null;
                        onDone();
                    }
                }
                rafId = requestAnimationFrame(frame);
            }

            window.heroMorphTransition = runMorph;
        })();

        // 主視覺 Hero 幻燈片切換腳本
        (function() {
            const bgs = document.querySelectorAll('.hero-bg-img');
            const dots = document.querySelectorAll('.hero-slide-dots .dot');
            const navItems = document.querySelectorAll('.slide-nav-item');
            
            if (bgs.length === 0) return;

            let currentIndex = 0;
            let timer = null;

            // 自動切換間隔（含轉場時間）與轉場動畫本身的時長。
            // 放大動畫要在「間隔 - 轉場時間」內跑完，收回原尺寸的時機才會剛好對齊下一次轉場開始的瞬間
            const AUTO_INTERVAL = 5500;
            const TRANSITION_DURATION = 1100;
            const ZOOM_DURATION = AUTO_INTERVAL - TRANSITION_DURATION;

            // 轉場完成後，讓真正的 <img> 狀態瞬間同步（不觸發原本的 CSS 淡入淡出，避免與 WebGL 畫面打架）
            function setActiveImmediate(index) {
                // 只讓 opacity 瞬間切換（避免跟 canvas 交接時重複淡入淡出）；
                // 放大動畫改用 animation（hero-zoom-cycle）驅動，強制 reflow 讓它在新的 active 圖片上重新從頭播放
                bgs.forEach((bg, i) => {
                    bg.style.transition = 'opacity 0s';
                    bg.style.animationDuration = ZOOM_DURATION + 'ms';
                    bg.classList.toggle('active', i === index);
                });
                void bgs[0].offsetWidth; // 強制 reflow，讓 animation 重新觸發
                requestAnimationFrame(() => {
                    bgs.forEach(bg => { bg.style.transition = ''; });
                });
            }

            function goToSlide(index) {
                if (index === currentIndex) { resetTimer(); return; }

                dots.forEach(dot => dot.classList.remove('active'));
                if (dots[index]) dots[index].classList.add('active');

                const fromImg = bgs[currentIndex];
                const toImg = bgs[index];
                currentIndex = index;
                resetTimer();

                if (window.heroMorphTransition) {
                    window.heroMorphTransition(fromImg, toImg, TRANSITION_DURATION, () => setActiveImmediate(index));
                } else {
                    setActiveImmediate(index);
                }
            }

            function nextSlide() {
                let next = (currentIndex + 1) % bgs.length;
                goToSlide(next);
            }

            function resetTimer() {
                clearInterval(timer);
                timer = setInterval(nextSlide, AUTO_INTERVAL);
            }

            // 綁定點擊事件
            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    e.preventDefault();
                    let targetIndex = parseInt(dot.getAttribute('data-index'));
                    if(!isNaN(targetIndex)) goToSlide(targetIndex);
                });
            });
            
            navItems.forEach(nav => {
                nav.addEventListener('click', (e) => {
                    // 只攔截帶有 data-index 的導覽點擊，作為幻燈片切換
                    if (nav.hasAttribute('data-index')) {
                        e.preventDefault();
                        let targetIndex = parseInt(nav.getAttribute('data-index'));
                        if(!isNaN(targetIndex)) goToSlide(targetIndex);
                    }
                });
            });

            // 初始化
            resetTimer();
        })();

        // 右側導覽選單醒目狀態獨立輪播（跟封面背景圖切換速度脫鉤，各自獨立計時）
        (function() {
            const navItems = document.querySelectorAll('.hero-slide-nav .slide-nav-item');
            if (navItems.length === 0) return;

            let navIndex = Array.from(navItems).findIndex(el => el.classList.contains('active-nav'));
            if (navIndex < 0) navIndex = 0;

            setInterval(() => {
                navItems[navIndex].classList.remove('active-nav');
                navIndex = (navIndex + 1) % navItems.length;
                navItems[navIndex].classList.add('active-nav');
            }, 2500);
        })();

        // ===== 全站流暢滾動入場效果 (Scroll Reveal Observer) =====
        (function() {
            // 針對網格/卡片容器自動為子項目加上錯落延遲
            const staggerGrids = document.querySelectorAll('.projects-4-grid, .dark-sectors-row, .staggered-layout, .contact-channels-list');
            staggerGrids.forEach(grid => {
                const items = grid.children;
                for (let i = 0; i < items.length; i++) {
                    if (!items[i].classList.contains('reveal')) {
                        items[i].classList.add('reveal', `delay-${(i % 4) + 1}`);
                    }
                }
            });

            // 選取全站重點大標題、文字與圖表區塊
            const revealSelectors = [
                '.contact-poetic-header',
                '.about-hero-title',
                '.about-hero-desc',
                '.about-hero-banner',
                '.header-block',
                '.ship-img',
                '.overlay-panel',
                '.sector-group',
                '.dark-sectors-intro',
                '.dark-sectors-row .dark-card',
                '.poetic-quote-wrap',
                '.certs-header',
                '.medallion-row',
                '.network-row',
                '.cta-container',
                '.projects-header-top',
                '.project-card-item',
                '.contact-poetic-info',
                '.form-poetic-box',
                '.footer-logo-center',
                '.footer-poetic-statement',
                '.footer-bottom-info'
            ];

            revealSelectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    if (!el.classList.contains('reveal')) {
                        el.classList.add('reveal');
                    }
                });
            });

            // 建立 IntersectionObserver 進行平滑入場監控
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        obs.unobserve(entry.target); // 動畫觸發一次即解綁，節省效能
                    }
                });
            }, {
                threshold: 0.05,
                rootMargin: '0px 0px 0px 0px'
            });

            document.querySelectorAll('.reveal, .reveal-trigger').forEach(el => observer.observe(el));
        })();

    
