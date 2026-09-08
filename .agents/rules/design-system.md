# SEAWORTH Design System
這份文件定義了海沃控股 (SEAWORTH) 專案的全站字體、字級與區塊間距規範。當 AI 代理人（Assistant/Agent）在進行任何前端切版、樣式新增或全站調整時，**必須**優先使用以下變數與規範。

## 1. 統一管理與響應式精神 (Core Principles)
本規範中的字體大小與區塊留白均遵循相同的治理精神：
- **統一維護**：所有相關變數皆定義在 `index.html` 開頭 `<style>` 區塊的 `:root` 中。
- **RWD 自動縮放**：變數會在斷點（1024px / 640px）整批重新賦值。任何地方只要引用變數，會自動跟著縮小，不需要額外寫 media query。
- **避免硬編碼 (Hardcode)**：禁止為單一元素或區塊寫死絕對數值（如 `font-size: 24px` 或 `padding-top: 100px`），必須統一使用變數。

## 2. 字體與字級規範 (Typography)
### 2.1 全站字體 (Font Families)
請一律使用宣告在 `:root` 中的變數來設定字體，禁止直接寫死字體名稱。
- `var(--font-display)` (Cormorant Garamond)：用於英文專屬的古典詩意字體（大寫英文標題、裝飾字母）。
- `var(--font-serif)` (Noto Serif TC)：用於中文主標題、副標題與引言（帶有優雅、沉穩氣質）。
- `var(--font-sans)` (Montserrat & Noto Sans TC)：用於大量閱讀的內文、選單、按鈕、小標籤（全站預設字體）。

### 2.2 標準字級變數 (Typography Scale)
切版時，文字大小 `font-size` 預設只能使用以下 12 個定義好的 CSS 變數：

*(巨型裝飾與大標題)*
- `var(--text-giga)` (14rem / 約 168pt)：極大裝飾字。
- `var(--text-mega)` (10rem / 約 120pt)：背景裝飾字。
- `var(--text-hero)` (6rem / 約 72pt)：網站第一屏 (Hero Section) 超大主標題。

*(區塊標題 Headings)*
- `var(--text-4xl)` (3.8rem / 約 46pt)：各區塊的特大標題。
- `var(--text-3xl)` (3.2rem / 約 38pt)：最常見的區塊 H2 主標題。
- `var(--text-2xl)` (2.2rem / 約 26pt)：H3 副標題。
- `var(--text-xl)` (1.8rem / 約 22pt)：H4 小標題。

*(內文與輔助說明 Body & Utility)*
- `var(--text-lg)` (1.35rem / 約 16pt)：偏大的內文、卡片主標題、引言文字。
- `var(--text-base)` (1rem / 約 12pt)：**全站預設標準內文**。
- `var(--text-sm)` (0.9rem / 約 11pt)：稍小的內文（適合按鈕、表單輸入框、選單）。
- `var(--text-xs)` (0.8rem / 約 10pt)：卡片的描述文字、輔助說明。
- `var(--text-tiny)` (0.72rem / 約 9pt)：極小標籤。

### 2.3 字級實作守則
1. **優先換用 Scale 中的變數**：當要求「字體放大一點」或「字體縮小一點」時，請先沿著這份 Scale 往上或往下尋找最適合的變數（如將 `--text-base` 改為 `--text-lg`）。
2. **有條件的微調**：只有當 12 階變數皆不合適且為單次微調時，允許用 `calc()` 以現有變數為基準（如 `calc(var(--text-lg) * 1.05)`），或寫死數值並**加註解說明原因**。若多處需要同樣微調，應改為在 `:root` 新增變數。
3. **顏色搭配**：文字顏色必須使用 CSS 變數（如 `var(--c-ink)`, `var(--c-muted)`, `var(--c-charcoal)`, `var(--c-copper)`），禁止使用 `#000000` 或 `#333333`。

## 3. 區塊間距規範 (Section Spacing)
此部分只涵蓋區塊層級的間距（不含元件內部的小間距，如卡片內 gap 等，這些維持逐一調整）。

### 3.1 三階間距變數 (Section Spacing Scale)
| 變數 | 桌機 (預設) | ≤1024px | ≤640px | 用在哪些區塊 |
|---|---|---|---|---|
| `--space-section-md` | 100px | 70px | 56px | 三大事業群、國際合規認證 |
| `--space-section-lg` | 140px | 90px | 70px | ESG 共善經營、聯絡我們 |
| `--space-section-xl` | 160px | 100px | 80px | 關於海沃 (About)、最新消息 |

### 3.2 區塊間距實作守則
1. **選擇合適變數**：新增大區塊（`<section>`）時，判斷其份量套用對應的 `--space-section-md/lg/xl`。
2. **不對稱留白**：若區塊上下留白刻意不對稱，請用 `calc()` 以同一個變數為基準扣減。
   ```css
   .section-projects {
       padding: var(--space-section-xl) 0 calc(var(--space-section-xl) - 20px) 0;
   }
   ```
3. **禁止固定 px**：禁止對區塊層級的 `padding-top`/`padding-bottom` 用固定 px 寫死，亦不要為單一區塊寫 `@media` 覆蓋。
