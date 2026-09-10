import glob

# The CSS to inject
css_payload = """
        /* 手機版漢堡按鈕與全螢幕選單 */
        .nav-hamburger {
            display: none;
            flex-direction: column;
            justify-content: space-between;
            width: 24px;
            height: 16px;
            background: transparent;
            border: none;
            cursor: pointer;
            z-index: 1002;
            padding: 0;
            margin-left: 16px;
        }
        .nav-hamburger span {
            display: block;
            width: 100%;
            height: 2px;
            background-color: var(--c-charcoal);
            transition: all 0.4s var(--ease-poetic);
            transform-origin: center;
        }
        body.nav-open .nav-hamburger span:nth-child(1) { transform: translateY(7px) rotate(45deg); width: 24px; }
        body.nav-open .nav-hamburger span:nth-child(2) { opacity: 0; }
        body.nav-open .nav-hamburger span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); width: 24px; }

        .nav-mobile-panel {
            position: fixed;
            inset: 0;
            background-color: var(--c-white);
            z-index: 1000;
            padding: 100px 32px 40px;
            overflow-y: auto;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-20px);
            transition: all 0.5s var(--ease-poetic);
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        body.nav-open .nav-mobile-panel {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .nav-mobile-group {
            border-bottom: 1px solid var(--c-line);
        }
        .nav-mobile-group:last-of-type { border-bottom: none; }
        
        .nav-mobile-group-head {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px 0;
            background: transparent;
            border: none;
            font-family: var(--font-sans);
            font-size: 1.15rem;
            color: var(--c-charcoal);
            text-align: left;
            cursor: pointer;
            letter-spacing: 0.1em;
        }
        .nav-mobile-group-head i {
            width: 20px;
            height: 20px;
            color: var(--c-muted);
            transition: transform 0.4s ease;
        }
        .nav-mobile-group.is-open .nav-mobile-group-head i {
            transform: rotate(180deg);
        }
        
        .nav-mobile-sub {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.4s var(--ease-poetic);
        }
        .nav-mobile-group.is-open .nav-mobile-sub {
            grid-template-rows: 1fr;
        }
        .nav-mobile-sub-inner {
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding-bottom: 0;
        }
        .nav-mobile-group.is-open .nav-mobile-sub-inner {
            padding-bottom: 24px;
        }
        .nav-mobile-sub-inner a {
            font-size: 1rem;
            color: var(--c-muted);
            text-decoration: none;
            padding-left: 8px;
            letter-spacing: 0.08em;
        }
        
        .nav-mobile-lang {
            margin-top: 40px;
            display: flex;
            gap: 24px;
            padding: 0 8px;
        }
        .nav-mobile-lang a {
            font-size: 0.95rem;
            color: var(--c-charcoal);
            text-decoration: none;
            letter-spacing: 0.1em;
        }

        @media (max-width: 960px) {
            .nav-left-area, .nav-split-menu { display: none; }
            .nav-hamburger { display: flex; }
            .blanz-header .nav-right-area { gap: 16px; }
            /* 取消原本會讓字疊在一起的絕對定位寫法 */
            .blanz-header { padding: 12px 24px; }
            .blanz-header .blanz-container { grid-template-columns: 1fr auto; padding: 0; }
        }
"""

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if '.nav-hamburger {' in content:
        return # already updated

    # Insert CSS before the closing </style>
    # Note: there might be multiple <style> tags, we should probably just append it to the main one.
    # We can just inject it right before `</style>`
    parts = content.rsplit('</style>', 1)
    if len(parts) == 2:
        new_content = parts[0] + css_payload + '</style>' + parts[1]
        with open(filepath, 'w') as f:
            f.write(new_content)

for f in glob.glob("*.html"):
    if f not in ["index.html"]:
        update_file(f)
print("CSS updated")
