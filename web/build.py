"""把 partials/ 裡的共用區塊（導覽列、頁尾）寫回每一頁。

用法：在 web/ 資料夾執行  python3 build.py
改導覽列或頁尾只要改 partials/header.html、partials/footer.html，再執行一次即可。
每頁中被 <!-- @include xxx --> 與 <!-- @end include xxx --> 包住的內容會被取代，請勿直接修改該區間。
"""
import glob
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
PARTIALS = {name: open(os.path.join(HERE, 'partials', name + '.html'), encoding='utf8').read().rstrip('\n')
            for name in ('header', 'footer')}

# 首頁的 Logo 與中間圖示連結是錨點回頁首，其他頁回首頁
PAGE_OVERRIDES = {
    'index.html': {'header': lambda t: t.replace('href="index.html"', 'href="#top"')},
}

PATTERN = re.compile(r'(<!-- @include (\w+) -->\n).*?(\n[ \t]*<!-- @end include \2 -->)', re.S)

for path in sorted(glob.glob(os.path.join(HERE, '*.html'))):
    name = os.path.basename(path)
    src = open(path, encoding='utf8').read()

    def fill(m):
        text = PARTIALS[m.group(2)]
        fn = PAGE_OVERRIDES.get(name, {}).get(m.group(2))
        if fn:
            text = fn(text)
        return m.group(1) + text + m.group(3)

    out = PATTERN.sub(fill, src)
    if out != src:
        open(path, 'w', encoding='utf8').write(out)
        print('updated', name)
