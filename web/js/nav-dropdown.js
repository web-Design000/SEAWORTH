        // 導覽下拉選單：點擊觸發項只展開選單，不直接跳轉頁面；子選項維持正常導覽
        (function() {
            const dropdownItems = document.querySelectorAll('.nav-split-menu > li.has-dropdown');
            if (!dropdownItems.length) return;
            dropdownItems.forEach(function(li) {
                const trigger = li.querySelector(':scope > a');
                if (!trigger) return;
                trigger.addEventListener('click', function(e) {
                    e.preventDefault();
                    const isOpen = li.classList.contains('is-open');
                    dropdownItems.forEach(function(other) { other.classList.remove('is-open'); });
                    if (!isOpen) li.classList.add('is-open');
                });
            });
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.nav-split-menu > li.has-dropdown')) {
                    dropdownItems.forEach(function(li) { li.classList.remove('is-open'); });
                }
            });
        })();
    
