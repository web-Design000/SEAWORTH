        (function() {
            const loader = document.getElementById('siteLoader');
            if (!loader) return;
            const MIN_DISPLAY = 1500; // 最短顯示時間，避免快取時一閃而過，看不清楚內容
            const shownAt = performance.now();

            function hide() {
                const wait = Math.max(0, MIN_DISPLAY - (performance.now() - shownAt));
                setTimeout(() => {
                    loader.classList.add('is-hidden');
                    setTimeout(() => loader.remove(), 900);
                }, wait);
            }

            if (document.readyState === 'complete') {
                hide();
            } else {
                window.addEventListener('load', hide);
            }
        })();
    
