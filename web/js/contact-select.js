        (function() {
            const wrap = document.getElementById('serviceSelectCustom');
            if (!wrap) return;
            const trigger = document.getElementById('serviceSelectTrigger');
            const valueEl = trigger.querySelector('.custom-select-value');
            const list = wrap.querySelector('.custom-select-list');
            const items = Array.from(list.querySelectorAll('li'));
            const hiddenInput = document.getElementById('serviceSelect');
            const placeholderText = valueEl.textContent;

            function close() {
                wrap.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
            }
            function open() {
                wrap.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');
            }

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                wrap.classList.contains('is-open') ? close() : open();
            });

            items.forEach(item => {
                item.addEventListener('click', () => {
                    items.forEach(i => i.classList.remove('is-active'));
                    item.classList.add('is-active');
                    hiddenInput.value = item.getAttribute('data-value');
                    valueEl.textContent = item.textContent;
                    valueEl.classList.remove('is-placeholder');
                    close();
                });
            });

            document.addEventListener('click', (e) => {
                if (!wrap.contains(e.target)) close();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') close();
            });

            // 表單重置時，把自訂下拉的顯示狀態也還原成預設提示文字
            const form = document.getElementById('blanzContactForm');
            if (form) {
                form.addEventListener('reset', () => {
                    items.forEach(i => i.classList.remove('is-active'));
                    valueEl.textContent = placeholderText;
                    valueEl.classList.add('is-placeholder');
                    close();
                });
            }
        })();
    
