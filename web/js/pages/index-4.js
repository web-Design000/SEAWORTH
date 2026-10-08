        (function() {
            const wrapper = document.getElementById('flagshipScrollWrapper');
            const section = wrapper ? wrapper.querySelector('.flagship-section') : null;
            if (!wrapper || !section) return;

            const states = [
                {
                    tag: 'Beyond Limits',
                    title: '遠洋核心戰略',
                    desc: '作業海域橫跨太平洋與大西洋，精準捕撈正鰹、黃鰭鮪、大目鮪、長鰭鮪、魷魚及秋刀魚等全球核心經濟魚種。',
                    photo: 'assets/photo/img-1.jpg',
                    numPrefix: '',
                    numTarget: 40,
                    numSuffix: '<span class="num-sym">+</span>',
                    label: '年產業深耕經驗<br>源自 1983 年'
                },
                {
                    tag: 'Modern Fleet',
                    title: '頂尖合規船隊',
                    desc: '圍網、延繩釣、魷釣秋刀魚與超低溫運搬船，近 40 艘現代化船隊全面符合國際合規標準。',
                    photo: 'assets/news/news-corporate.jpg',
                    numPrefix: '~',
                    numTarget: 40,
                    numSuffix: '',
                    label: '艘現代化<br>合規船隊'
                },
                {
                    tag: 'Ocean Reach',
                    title: '全球作業海域',
                    desc: '橫跨太平洋與大西洋戰略漁場，精準掌握全球核心經濟魚種漁汛與資源分布。',
                    photo: 'assets/photo/img-3.jpg',
                    numPrefix: '',
                    numTarget: 2,
                    numSuffix: '',
                    label: '大洋<br>戰略作業海域',
                    position: '70% center'
                },
                {
                    tag: 'Global Network',
                    title: '跨國營運樞紐',
                    desc: '台灣高雄、韓國釜山、中國舟山、泰國曼谷、巴紐，五大據點構建全球運籌網絡。',
                    photo: 'assets/photo/img-4.jpg',
                    numPrefix: '',
                    numTarget: 5,
                    numSuffix: '',
                    label: '大跨國<br>營運樞紐'
                }
            ];

            // 預先載入每一組狀態的圖片，避免滾動切換時卡在讀取空白畫面
            states.forEach(s => {
                const preloadImg = new Image();
                preloadImg.src = s.photo;
            });

            const tagEl = document.getElementById('flagshipTag');
            const titleEl = document.getElementById('flagshipTitle');
            const descEl = document.getElementById('flagshipDesc');
            const photoEl = document.getElementById('flagshipPhoto');
            const numEl = document.getElementById('flagshipNum');
            const labelEl = document.getElementById('flagshipLabel');
            const dots = document.querySelectorAll('.flagship-dot');
            const animTargets = [
                document.querySelector('.flagship-left'),
                document.querySelector('.flagship-photo'),
                document.querySelector('.flagship-right')
            ];

            // 對應 CSS 的 @media (max-width: 1024px)：只有超過這個寬度，
            // .flagship-section 才是 position: sticky（畫面真的會黏住），
            // 才需要跑捲動切換卡片的邏輯。
            const desktopStickyQuery = window.matchMedia('(min-width: 1025px)');
            function isDesktopStickyMode() {
                return desktopStickyQuery.matches;
            }

            let currentIndex = 0;
            let numRAF = null;

            function animateNum(state, duration) {
                duration = duration || 900;
                if (numRAF) cancelAnimationFrame(numRAF);
                const prefix = state.numPrefix || '';
                const suffix = state.numSuffix || '';
                const target = state.numTarget;
                const start = performance.now();

                function tick(now) {
                    const t = Math.min(1, (now - start) / duration);
                    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
                    const current = Math.round(target * eased);
                    numEl.innerHTML = prefix + current + suffix;
                    if (t < 1) {
                        numRAF = requestAnimationFrame(tick);
                    } else {
                        numRAF = null;
                    }
                }
                numRAF = requestAnimationFrame(tick);
            }

            function applyState(index) {
                if (index === currentIndex) return;
                currentIndex = index;
                const s = states[index];

                tagEl.textContent = s.tag;
                titleEl.textContent = s.title;
                descEl.textContent = s.desc;
                photoEl.src = s.photo;
                photoEl.alt = s.title;
                photoEl.style.objectFit = s.fit || 'cover';
                photoEl.style.objectPosition = s.position || '';
                animateNum(s);
                labelEl.innerHTML = s.label;

                dots.forEach((dot, i) => dot.classList.toggle('active', i === index));

                // 內容已即時更新，這裡只是疊加一個輕巧的進場動畫，不會卡住畫面
                animTargets.forEach(el => {
                    if (!el) return;
                    el.classList.remove('flagship-pop');
                    void el.offsetWidth; // 強制 reflow，讓動畫可以重新觸發
                    el.classList.add('flagship-pop');
                });
                updateArrowState(currentIndex);
            }

            function updateArrowState(idx) {
                const prevBtn = document.getElementById('flagshipArrowPrev');
                if (prevBtn) {
                    if (idx === 0) {
                        prevBtn.style.opacity = '0.3';
                        prevBtn.style.pointerEvents = 'none';
                        prevBtn.style.cursor = 'default';
                    } else {
                        prevBtn.style.opacity = '1';
                        prevBtn.style.pointerEvents = 'auto';
                        prevBtn.style.cursor = 'pointer';
                    }
                }
            }

            function onScroll() {
                // 手機/平板（≤1024px）CSS 已把區塊改回一般排版（不黏住），
                // 這裡也要跟著關閉「捲動切換」，改由 dot 點擊切換，避免畫面沒黏住
                // 卻在背景照樣切內容，造成捲動時內容忽然跳動的問題。
                if (!isDesktopStickyMode()) return;

                const rect = wrapper.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const scrollable = wrapper.offsetHeight - viewportHeight;
                if (scrollable <= 0) return;

                const scrolled = -rect.top;
                const progress = Math.min(1, Math.max(0, scrolled / scrollable));
                let index = Math.floor(progress * states.length);
                if (index >= states.length) index = states.length - 1;
                if (index < 0) index = 0;
                applyState(index);
            }

            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        onScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            });

            function goToIndex(i) {
                if (!isDesktopStickyMode()) {
                    // 手機/平板：畫面沒有黏住，直接原地切換卡片內容即可
                    applyState(i);
                    return;
                }
                const viewportHeight = window.innerHeight;
                const scrollable = wrapper.offsetHeight - viewportHeight;
                if (scrollable <= 0) return;
                const targetScroll = wrapper.offsetTop + (scrollable * (i / states.length)) + 10;
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            }

            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => goToIndex(i));
            });

            const prevBtn = document.getElementById('flagshipArrowPrev');
            const nextBtn = document.getElementById('flagshipArrowNext');
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (currentIndex > 0) goToIndex(currentIndex - 1);
                });
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    if (currentIndex === states.length - 1) {
                        const scrollY = window.scrollY || window.pageYOffset;
                        window.scrollTo({ top: scrollY + wrapper.getBoundingClientRect().bottom, behavior: 'smooth' });
                    } else {
                        goToIndex(currentIndex + 1);
                    }
                });
            }

            onScroll();
            updateArrowState(currentIndex);

            // 首次滾動進入畫面時，讓初始數字也跑一次入場動畫
            const numEntranceObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateNum(states[0], 1400);
                        obs.disconnect();
                    }
                });
            }, { threshold: 0.4 });
            numEntranceObserver.observe(section);
        })();
    
