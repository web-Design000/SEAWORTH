import re

with open('strategy.html', 'r', encoding='utf-8') as f:
    content = f.read()

crosslink_match = re.search(r'(\s*<div class="sp-crosslink-row">.*?</div>\s*</div>\s*</section>\s*</main>)', content, re.DOTALL)
footer_match = re.search(r'(<footer class="blanz-footer">.*)', content, re.DOTALL)

# Split by the FIRST occurrence of <div class="nav-mobile-group"> that is inside the main block.
# Wait, the first one is at the top in the navMobilePanel.
# So we find the SECOND occurrence.
parts = content.split('<div class="nav-mobile-group">')

if len(parts) >= 3 and crosslink_match and footer_match:
    # parts[0] + parts[1] covers up to the first nav-mobile-group (in header)
    # The next one is the bad one at the bottom.
    # So we keep parts[0] + '<div class="nav-mobile-group">' + parts[1] (which ends exactly before the SECOND nav-mobile-group)
    clean_content = parts[0] + '<div class="nav-mobile-group">' + parts[1]
    
    clean_content += crosslink_match.group(1) + '\n\n' + footer_match.group(1)
    
    with open('strategy.html', 'w', encoding='utf-8') as f:
        f.write(clean_content)
    print("Fixed successfully!")
else:
    print(f"Parts: {len(parts)}, Crosslink: {bool(crosslink_match)}, Footer: {bool(footer_match)}")
