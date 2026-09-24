import os
import glob
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Restore specific text links
    links_map = {
        '關於海沃': 'about.html',
        '事業版圖': 'business-map.html',
        '技術整合能力': 'tech-integration.html',
        '營運據點': 'locations.html',
        '聯絡我們': 'contact-us.html',
        '人才招募': 'careers.html'
    }

    # 1. First, restore hrefs for the disabled links based on the text inside the <a> tag
    for text, href in links_map.items():
        # Look for <a href="#" class="disabled-link">TEXT</a> and variants
        # The regex looks for <a ... href="#" ...>TEXT</a> where it has class="disabled-link"
        pattern = r'<a([^>]*)href="#"([^>]*)class="disabled-link"([^>]*)>' + re.escape(text) + r'</a>'
        # Also need to handle cases where class="disabled-link" might be before href="#"
        # A simpler way is to match <a ...>TEXT</a> and then replace inside it
        
        def a_replacer(match):
            a_tag_content = match.group(0)
            if 'disabled-link' in a_tag_content:
                new_a_tag = a_tag_content.replace('href="#"', f'href="{href}"').replace('class="disabled-link"', '').replace(' class=""', '')
                # Clean up if just class="disabled-link" was removed
                new_a_tag = re.sub(r'\s+class=""', '', new_a_tag)
                new_a_tag = re.sub(r'class="disabled-link\s*', 'class="', new_a_tag)
                new_a_tag = re.sub(r'\s*disabled-link', '', new_a_tag)
                return new_a_tag
            return a_tag_content

        content = re.sub(r'<a[^>]+>' + re.escape(text) + r'</a>', a_replacer, content)

    # 2. For 集團總覽 and 聯繫海沃, they might just be <a href="#" class="disabled-link">集團總覽</a>
    for text in ['集團總覽', '聯繫海沃']:
        def a_replacer2(match):
            a_tag_content = match.group(0)
            if 'disabled-link' in a_tag_content:
                new_a_tag = a_tag_content.replace('class="disabled-link"', '').replace(' class=""', '')
                new_a_tag = re.sub(r'\s+class=""', '', new_a_tag)
                new_a_tag = re.sub(r'\s*disabled-link', '', new_a_tag)
                return new_a_tag
            return a_tag_content
        content = re.sub(r'<a[^>]+>' + re.escape(text) + r'</a>', a_replacer2, content)
        
    # 3. Clean up other occurrences of disabled-link (like in <li> and <button>)
    # For <li class="has-dropdown disabled-link">
    content = content.replace('has-dropdown disabled-link', 'has-dropdown')
    content = content.replace('nav-mobile-group-head disabled-link', 'nav-mobile-group-head')
    
    # Finally, just completely wipe out any remaining 'disabled-link' 
    content = re.sub(r'\bdisabled-link\b', '', content)
    # Cleanup empty class=" " 
    content = content.replace('class=" "', '')
    content = content.replace('class="  "', '')

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

if __name__ == '__main__':
    modified = 0
    # Process only .html files in the current directory (web/ first layer)
    for file in glob.glob('*.html'):
        if process_file(file):
            modified += 1
            print(f"Modified {file}")
    print(f"Total modified: {modified}")
