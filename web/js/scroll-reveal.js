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
            // 等待全站 Loading 畫面淡出後才開始觀察，避免入場動畫在 Loading 遮罩後面就播完，使用者完全看不到
            let revealStarted = false;
            function startRevealObserver() {
                if (revealStarted) return;
                revealStarted = true;
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
            }
            // 封面圖入場：Loading 畫面淡出後才觸發，避免跟上面同一個問題一樣被遮住
            let heroRevealed = false;
            function revealHero() {
                if (heroRevealed) return;
                heroRevealed = true;
                document.querySelectorAll('.sp-hero').forEach(el => el.classList.add('is-revealed'));
            }
            if (document.getElementById('siteLoader')) {
                window.addEventListener('siteLoaderHidden', () => { startRevealObserver(); revealHero(); }, { once: true });
                setTimeout(() => { startRevealObserver(); revealHero(); }, 3000); // 保險：避免事件漏接導致內容永遠不顯示
            } else {
                startRevealObserver();
                revealHero();
            }
        })();
