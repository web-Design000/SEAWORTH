        (function() {
            const header = document.querySelector('.blanz-header');
            if (!header) return;
            function setHeaderHeight() {
                document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
            }
            setHeaderHeight();
            window.addEventListener('resize', setHeaderHeight);
        })();
    
