    (function() {
        const row = document.querySelector('.sp-stat-row');
        if (!row) return;
        const items = Array.from(row.querySelectorAll('.sp-stat-num')).map(el => {
            const suffixEl = el.querySelector('.num-sym');
            const suffixHTML = suffixEl ? suffixEl.outerHTML : '';
            const target = parseInt(el.textContent, 10) || 0;
            // 立即設定為 0
            el.innerHTML = '0' + suffixHTML;
            return { el, target, suffixHTML };
        });

        function animate(duration) {
            duration = duration || 1500; // 時間調整到最剛好的 1.5 秒
            const start = performance.now();
            let lastUpdate = 0;
            
            function tick(now) {
                const t = Math.min(1, (now - start) / duration);
                
                // 限制約 50ms 更新一次 (約 20fps)，避免跳太快變成糊的
                if (now - lastUpdate > 50 || t === 1) {
                    items.forEach(item => {
                        if (t < 1) {
                            // 動畫期間：產生亂碼，依據目標數字位數產生對應的隨機數
                            const maxVal = Math.pow(10, item.target.toString().length);
                            const randomNum = Math.floor(Math.random() * maxVal);
                            item.el.innerHTML = randomNum + item.suffixHTML;
                        } else {
                            // 動畫結束：鎖定正確目標數字
                            item.el.innerHTML = item.target + item.suffixHTML;
                        }
                    });
                    lastUpdate = now;
                }
                
                if (t < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        }

        // 等待全站載入（含圖片）與 Loading 動畫結束後，再開始監聽
        window.addEventListener('load', () => {
            // 可以額外加一個小延遲，確保 loading 畫面完全消失
            setTimeout(() => {
                const observer = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => animate(), 300);
                            obs.disconnect();
                        }
                    });
                }, { threshold: 0.1 });
                observer.observe(row);
            }, 500);
        });
    })();
