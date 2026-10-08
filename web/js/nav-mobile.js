        (function() {
            const hamburger = document.getElementById('navHamburger');
            const panel = document.getElementById('navMobilePanel');
            if (!hamburger || !panel) return;

            function closeMenu() {
                document.body.classList.remove('nav-open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            function toggleMenu() {
                const isOpen = document.body.classList.toggle('nav-open');
                hamburger.setAttribute('aria-expanded', String(isOpen));
            }

            hamburger.addEventListener('click', toggleMenu);

            panel.querySelectorAll('.nav-mobile-group-head').forEach(head => {
                head.addEventListener('click', () => {
                    head.closest('.nav-mobile-group').classList.toggle('is-open');
                });
            });

            panel.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', closeMenu);
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeMenu();
            });

            // 螢幕放大回桌機版時，確保選單面板與漢堡狀態重置乾淨
            window.addEventListener('resize', () => {
                if (window.innerWidth > 1024) closeMenu();
            });
        })();
    
