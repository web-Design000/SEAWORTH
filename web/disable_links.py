import os
import re
import glob

# The HTML pages that belong to "集團總覽" and "聯繫海沃"
targets = [
    'about.html',
    'business-map.html',
    'tech-integration.html',
    'locations.html',
    'contact-us.html',
    'careers.html'
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    for target in targets:
        # We look for <a ... href="target" ... >
        # We need to handle cases where there is already a class or not.
        # But a simple approach is to use regex.
        
        # Regex to find <a ... href="about.html" ... >
        # and insert class="disabled-link" and change href="#"
        
        # First, find all <a> tags that point to the target
        pattern = r'<a([^>]*)href="' + re.escape(target) + r'"([^>]*)>'
        
        def replacer(match):
            before_href = match.group(1)
            after_href = match.group(2)
            
            # If it already has disabled-link, do nothing to avoid duplicates
            if 'disabled-link' in before_href or 'disabled-link' in after_href:
                return f'<a{before_href}href="#" class="disabled-link"{after_href}>'
                
            # If it already has a class attribute, we should append to it.
            # But regex replacing inside HTML can be tricky.
            # Let's just append class="disabled-link" if it doesn't have it.
            # A simpler way is to just inject class="disabled-link" and let CSS handle it.
            # If there's an existing class="something", having class="something" class="disabled-link" is invalid HTML.
            # Let's check for existing class.
            
            # Find class="..."
            class_match = re.search(r'class="([^"]+)"', before_href + after_href)
            if class_match:
                # Add disabled-link to existing class
                old_class = class_match.group(1)
                new_class = f'{old_class} disabled-link'
                # Replace in the whole string
                new_attrs = (before_href + after_href).replace(f'class="{old_class}"', f'class="{new_class}"')
                return f'<a{new_attrs} href="#">'
            else:
                # No existing class
                return f'<a{before_href}href="#" class="disabled-link"{after_href}>'
        
        content = re.sub(pattern, replacer, content)

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

