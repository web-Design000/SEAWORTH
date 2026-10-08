        (function() {
            const aboutTitle = document.querySelector('.about-hero-title');
            if (!aboutTitle) return;

            const START_OFFSET = -90; // px，初始往上偏移的距離

            function updateAboutTitle() {
                if (window.innerWidth <= 1024) {
                    aboutTitle.style.transform = '';
                    return;
                }
                const rect = aboutTitle.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    // 進度：從標題進入視窗底部（0）到完全離開視窗頂部（1），拉長距離讓位移更明顯
                    const progress = Math.min(1, Math.max(0,
                        (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
                    ));
                    aboutTitle.style.transform = `translateY(${START_OFFSET * (1 - progress)}px)`;
                }
            }

            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateAboutTitle();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
            updateAboutTitle();
        })();
    
