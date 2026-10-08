        (function() {
            const certsSection = document.querySelector('.certs-section');
            if (!certsSection) return;

            const bgObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        certsSection.classList.add('bg-shift');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            bgObserver.observe(certsSection);
        })();
    

        document.addEventListener("DOMContentLoaded", () => {
            // 觸控裝置沒有滑鼠，不需要（也不會觸發 mousemove）自訂游標，
            // 建立了反而會停在畫面左上角不動，變成一個卡住的小色塊。
            if (!window.matchMedia('(pointer: fine)').matches) return;

            const root = document.querySelector('body');

            // Real cursor element
            const cursor = document.createElement('div');
            cursor.classList.add('custom-cursor');
            root.appendChild(cursor);

            // Following extra cursor element
            const follower = document.createElement('div');
            follower.classList.add('custom-cursor', 'custom-cursor__follower');
            root.appendChild(follower);

            window.addEventListener('mousemove', (e) => {
                setPosition(follower, e);
                setPosition(cursor, e);
            });

            function setPosition(element, e) {
                element.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
        });
    
