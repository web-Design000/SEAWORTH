import glob

bad_css = """        @media (max-width: 960px) {
            .nav-left-area, .nav-split-menu { display: none; }
            .nav-hamburger { display: flex; }
            .blanz-header .nav-right-area { gap: 16px; }
            /* 取消原本會讓字疊在一起的絕對定位寫法 */
            .blanz-header { padding: 12px 24px; }
            .blanz-header .blanz-container { grid-template-columns: 1fr auto; padding: 0; }
        }"""

good_css = """        @media (max-width: 1024px) {
            .nav-left-area .nav-split-menu,
            .nav-right-area .nav-split-menu,
            .nav-center-icon {
                display: none;
            }
            .nav-hamburger { display: flex; }
            .nav-left-area { padding-right: 0; }
            .nav-right-area { padding-left: 0; justify-content: flex-end; flex: 0 0 auto; }
            .blanz-nav-inner {
                display: flex;
                grid-template-columns: none;
                justify-content: space-between;
                align-items: center;
                padding: 14px 24px;
            }
        }"""

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if bad_css in content:
        content = content.replace(bad_css, good_css)
        with open(filepath, 'w') as f:
            f.write(content)
            print(f"Fixed {filepath}")
    else:
        # Check if the bad CSS was modified slightly, if not found, we can try to inject it manually
        pass

for f in glob.glob("*.html"):
    if f not in ["index.html"]:
        update_file(f)
