import os
import glob

files = glob.glob("*.html")
excluded = ["index.html", "announcements.html", "corporate-news.html", "sustainability-practice.html", "environment.html"]

for f in files:
    if f in excluded:
        continue
    
    with open(f, "r") as file:
        content = file.read()
        
    if "@media (max-width: 640px) {" in content and ".blanz-section.sp-section { padding: 40px 0; }" not in content:
        # We find the specific block where sp-hero is defined to be safe, or just insert it after the media query
        content = content.replace(
            "@media (max-width: 640px) {",
            "@media (max-width: 640px) {\n        .blanz-section.sp-section { padding: 40px 0; }"
        )
        with open(f, "w") as file:
            file.write(content)
        print(f"Fixed {f}")
