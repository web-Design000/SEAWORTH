import glob, os

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'id="navHamburger"' in content:
        return # already updated

    # The HTML to insert before </nav>
    hamburger_html = """
                <button type="button" class="nav-hamburger" id="navHamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="navMobilePanel">
                    <span></span><span></span><span></span>
                </button>
"""
    # The HTML to insert after </header>
    mobile_panel_html = """
    <!-- 手機版全螢幕選單面板 -->
    <div class="nav-mobile-panel" id="navMobilePanel">
        <div class="nav-mobile-group">
            <button type="button" class="nav-mobile-group-head">集團總覽 <i data-lucide="chevron-down"></i></button>
            <div class="nav-mobile-sub"><div class="nav-mobile-sub-inner">
                <a href="about.html">關於海沃</a>
                <a href="business-map.html">事業版圖</a>
                <a href="tech-integration.html">技術整合能力</a>
            </div></div>
        </div>
        <div class="nav-mobile-group">
            <button type="button" class="nav-mobile-group-head">公司治理 <i data-lucide="chevron-down"></i></button>
            <div class="nav-mobile-sub"><div class="nav-mobile-sub-inner">
                <a href="governance-structure.html">公司治理架構</a>
                <a href="risk-management.html">風險管理政策</a>
                <a href="internal-audit.html">內部稽核與內控制度</a>
                <a href="integrity.html">誠信經營守則</a>
            </div></div>
        </div>
        <div class="nav-mobile-group">
            <button type="button" class="nav-mobile-group-head">共善經營 <i data-lucide="chevron-down"></i></button>
            <div class="nav-mobile-sub"><div class="nav-mobile-sub-inner">
                <a href="environment.html">環境保護</a>
                <a href="social-responsibility.html">社會責任</a>
            </div></div>
        </div>
        <div class="nav-mobile-group">
            <button type="button" class="nav-mobile-group-head">投資人專區 <i data-lucide="chevron-down"></i></button>
            <div class="nav-mobile-sub"><div class="nav-mobile-sub-inner">
                <a href="investment-highlights.html">投資亮點</a>
                <a href="strategy.html">策略布局</a>
                <a href="shareholder-info.html">股東訊息</a>
            </div></div>
        </div>
        <div class="nav-mobile-group">
            <button type="button" class="nav-mobile-group-head">最新消息 <i data-lucide="chevron-down"></i></button>
            <div class="nav-mobile-sub"><div class="nav-mobile-sub-inner">
                <a href="announcements.html">官方公告</a>
                <a href="corporate-news.html">企業動態</a>
                <a href="sustainability-practice.html">永續實踐</a>
            </div></div>
        </div>
        <div class="nav-mobile-group">
            <button type="button" class="nav-mobile-group-head">聯繫海沃 <i data-lucide="chevron-down"></i></button>
            <div class="nav-mobile-sub"><div class="nav-mobile-sub-inner">
                <a href="locations.html">營運據點</a>
                <a href="contact-us.html">聯絡我們</a>
                <a href="careers.html">人才招募</a>
            </div></div>
        </div>
        <div class="nav-mobile-lang">
            <a href="#">繁體中文</a>
            <a href="#">English</a>
        </div>
    </div>
    <script>
        (function() {
            const header = document.querySelector('.blanz-header');
            if (!header) return;
            function setHeaderHeight() {
                document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
            }
            setHeaderHeight();
            window.addEventListener('resize', setHeaderHeight);
        })();
    </script>
    <!-- 手機版漢堡選單邏輯 -->
    <script>
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
    </script>
"""

    # We need to insert hamburger_html before </div>\n        </nav>
    # Wait, the structure in announcements.html is:
    # </div>\n</nav> -> replace with hamburger_html + </div></nav>
    content = content.replace('            </div>\n        </nav>', hamburger_html + '            </div>\n        </nav>')
    
    # insert mobile_panel_html after </header>
    content = content.replace('    </header>', '    </header>\n' + mobile_panel_html)
    
    with open(filepath, 'w') as f:
        f.write(content)

for f in glob.glob("*.html"):
    if f not in ["index.html"]:
        update_file(f)
print("HTML updated")
