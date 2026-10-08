document.addEventListener("DOMContentLoaded", () => {
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
    
