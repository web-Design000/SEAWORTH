    (function() {
        document.querySelectorAll('.sp-accordion-item').forEach(item => {
            const head = item.querySelector('.sp-accordion-head');
            if (!head) return;
            head.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open');
                if (isOpen) {
                    item.classList.remove('is-open');
                    head.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('is-open');
                    head.setAttribute('aria-expanded', 'true');
                }
            });
        });
    })();
