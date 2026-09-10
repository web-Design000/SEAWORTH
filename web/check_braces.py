with open('/Users/mia/Desktop/SEAWORTH/web/announcements.html', 'r') as f:
    lines = f.readlines()

in_style = False
for i, line in enumerate(lines):
    if '<style' in line:
        in_style = True
        stack = []
        continue
    if '</style>' in line:
        if len(stack) != 0:
            print(f"Unmatched braces at end of style block! Stack size: {len(stack)}")
        in_style = False
        continue
    
    if in_style:
        for char in line:
            if char == '{':
                stack.append(i + 1)
            elif char == '}':
                if len(stack) > 0:
                    stack.pop()
                else:
                    print(f"Extra closing brace at line {i + 1}")
