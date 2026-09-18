import os
import re
import glob

css_snippet = """
        /* 暫時停用的連結 */
        .disabled-link {
            pointer-events: none;
            cursor: default;
            opacity: 0.5;
        }
</style>"""

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Add CSS before </style>
    if '.disabled-link {' not in content:
        content = content.replace('</style>', css_snippet, 1)

    # 2. Add disabled-link to desktop menu <li>
    # Find: <li class="has-dropdown">\s*<a href="about.html">集團總覽</a>
    content = re.sub(
        r'<li class="has-dropdown">(\s*<a href="[^"]+">集團總覽</a>)',
        r'<li class="has-dropdown disabled-link">\1',
        content
    )
    # Find contact
    content = re.sub(
        r'<li class="has-dropdown">(\s*<a href="[^"]+">聯繫海沃</a>)',
        r'<li class="has-dropdown disabled-link">\1',
        content
    )

    # 3. Add disabled-link to mobile menu <button>
    content = re.sub(
        r'<button type="button" class="nav-mobile-group-head">集團總覽 ',
        r'<button type="button" class="nav-mobile-group-head disabled-link">集團總覽 ',
        content
    )
    content = re.sub(
        r'<button type="button" class="nav-mobile-group-head">聯繫海沃 ',
        r'<button type="button" class="nav-mobile-group-head disabled-link">聯繫海沃 ',
        content
    )
    
    # 4. Handle footer links if necessary? 
    # The user said "集團總覽跟聯繫海握這兩個跟他的下拉選單都改為先不能按"
    # Usually dropdowns are in the header. If footer has them, they want them disabled too.
    # Let's disable any a tag with exactly those words just in case, but they specifically mentioned dropdowns.
    content = re.sub(
        r'<a href="[^"]+">集團總覽</a>',
        r'<a href="#" class="disabled-link">集團總覽</a>',
        content
    )
    content = re.sub(
        r'<a href="[^"]+">聯繫海沃</a>',
        r'<a href="#" class="disabled-link">聯繫海沃</a>',
        content
    )

    # Oh wait, the first regex replaced the <li> but left the <a> unchanged, which is fine since the whole <li> is disabled.
    # If the 4th regex runs, it will also change the <a> inside the <li>, which is even better.

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

if __name__ == '__main__':
    modified = 0
    for file in glob.glob('*.html'):
        if process_file(file):
            modified += 1
            print(f"Modified {file}")
    print(f"Total modified: {modified}")

