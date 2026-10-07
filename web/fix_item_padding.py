import os
import glob

files = glob.glob("*.html")

for f in files:
    with open(f, "r") as file:
        content = file.read()
        
    old_str = ".sp-numbered-item { grid-template-columns: 1fr; gap: 8px; }"
    new_str = ".sp-numbered-item { grid-template-columns: 1fr; gap: 8px; padding: 24px 0; }\n        .sp-section-head[style], .sp-numbered-list[style] { margin-bottom: 32px !important; }"
    
    if old_str in content:
        content = content.replace(old_str, new_str)
        with open(f, "w") as file:
            file.write(content)
        print(f"Fixed {f}")
