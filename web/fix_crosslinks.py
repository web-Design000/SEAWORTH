import os
import glob
import re

html_files = glob.glob('/Users/mia/Desktop/SEAWORTH/web/*.html')

replacements = {
    '← 技術整合能力': 'tech-integration.html',
    '聯絡我們 →': 'contact-us.html',
    '營運據點 →': 'locations.html',
    '← 營運據點': 'locations.html',
    '人才招募 →': 'careers.html',
    '← 聯絡我們': 'contact-us.html',
    '← 關於海沃': 'about.html',
    '技術整合能力 →': 'tech-integration.html',
    '← 事業版圖': 'business-map.html',
    '事業版圖 →': 'business-map.html'
}

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    for text, link in replacements.items():
        pattern = re.compile(rf'<a href="#" class="">({re.escape(text)})</a>')
        content = pattern.sub(rf'<a href="{link}" class="">\1</a>', content)

    if original != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")

