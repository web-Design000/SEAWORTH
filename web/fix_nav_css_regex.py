import glob, re

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

pattern = re.compile(r"        @media \(max-width: 960px\) \{\s*\.nav-left-area, \.nav-split-menu \{ display: none; \}\s*\.nav-hamburger \{ display: flex; \}\s*\.blanz-header \.nav-right-area \{ gap: 16px; \}\s*/\* 取消原本會讓字疊在一起的絕對定位寫法 \*/\s*\.blanz-header \{ padding: 12px 24px; \}\s*\.blanz-header \.blanz-container \{ grid-template-columns: 1fr auto; padding: 0; \}\s*\}")

for filepath in glob.glob("*.html"):
    if filepath == "index.html":
        continue
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content, count = pattern.subn(good_css, content)
    if count > 0:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")
