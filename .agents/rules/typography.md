---
description: 海沃控股 (SEAWORTH) 全站字體與字級設計系統規範 (Typography Design System)
trigger: always_on
---

# SEAWORTH Typography Design System
這份文件定義了海沃控股 (SEAWORTH) 專案的全站字體與字級規範。當 AI 代理人（Assistant/Agent）在進行任何前端切版、樣式新增或全站調整時，**必須**優先使用以下變數與規範；只有在變數系統無法滿足的真正一次性微調時，才允許有條件地使用絕對數值，細節見 §3.1。

## 1. 全站字體 (Font Families)
請一律使用宣告在 `:root` 中的變數來設定字體，禁止直接寫死字體名稱。
- `var(--font-display)` (Cormorant Garamond)：用於英文專屬的古典詩意字體（大寫英文標題、裝飾字母）。
- `var(--font-serif)` (Noto Serif TC)：用於中文主標題、副標題與引言（帶有優雅、沉穩氣質）。
- `var(--font-sans)` (Montserrat & Noto Sans TC)：用於大量閱讀的內文、選單、按鈕、小標籤（全站預設字體）。

## 2. 標準字級變數 (Typography Scale)
切版時，文字大小 `font-size` 預設只能使用以下 12 個定義好的 CSS 變數，不要使用 `px` 或不規則的 `rem`；真正需要例外時的條件與作法見 §3.1。

### 巨型裝飾與大標題
- `var(--text-giga)` (14rem / 約 168pt)：極大裝飾字（例如背景浮水印數字）。
- `var(--text-mega)` (10rem / 約 120pt)：背景裝飾字。
- `var(--text-hero)` (6rem / 約 72pt)：網站第一屏 (Hero Section) 超大主標題。

### 區塊標題 (Headings)
- `var(--text-4xl)` (3.8rem / 約 46pt)：各區塊的特大標題。
- `var(--text-3xl)` (3.2rem / 約 38pt)：最常見的區塊 H2 主標題（例如 NEWS & INSIGHTS）。
- `var(--text-2xl)` (2.2rem / 約 26pt)：H3 副標題。
- `var(--text-xl)` (1.8rem / 約 22pt)：H4 小標題。

### 內文與輔助說明 (Body & Utility)
- `var(--text-lg)` (1.35rem / 約 16pt)：偏大的內文、卡片主標題、引言文字。
- `var(--text-base)` (1rem / 約 12pt)：**全站預設標準內文**（適合一般段落閱讀）。
- `var(--text-sm)` (0.9rem / 約 11pt)：稍小的內文（適合按鈕、表單輸入框、選單）。
- `var(--text-xs)` (0.8rem / 約 10pt)：卡片的描述文字、輔助說明。
- `var(--text-tiny)` (0.72rem / 約 9pt)：極小標籤（如日期標籤、裝飾性英文副標題）。

## 3. 實作指示 (AI 執行守則)
1. **優先使用變數，有條件開放硬編碼微調**：當要求「字體放大一點」或「字體縮小一點」時，第一步永遠是沿著這份 Scale 往上或往下尋找最適合的變數（例如將 `var(--text-base)` 改為 `var(--text-lg)`）。只有當 12 階變數都不合適、且確定是單一元件的一次性微調時，才允許：
   - 用 `calc()` 以現有變數為基準微調，例如 `calc(var(--text-lg) * 1.05)`，保留跟 Scale 的關聯性；或
   - 直接寫死一個數值（如 `font-size: 1.15rem;`），但**必須加註解說明原因**（例如「// 這裡的 icon 對齊需要比 --text-lg 略大，設計稿量測結果」）。
   
   **例外不代表可以無限複製**：同一個硬編碼數值如果在第 2 個地方也想用，就代表這其實是全站共用的需求，這時候要停下來把它加成新的 `--text-*` 變數（或調整最接近的既有變數），而不是繼續貼著硬編碼的做法擴散出去。之前 `.flagship-num` 的 `font-size: 4rem;` 就是反例：沒有註解說明原因，也沒有跟任何變數關聯，導致手機版縮放時被漏掉，已經清除。
2. **顏色搭配**：文字顏色也必須使用 CSS 變數（如 `var(--c-ink)`、`var(--c-muted)`、`var(--c-charcoal)`、`var(--c-copper)`），禁止使用 `#000000` 或 `#333333`。
3. **維護 `:root`**：如果未來設計變更需要微調大小，請統一至 `:root` 中修改對應的 `--text-*` 變數數值，不要在個別 class 中覆寫 `font-size`。

## 4. RWD 響應式縮放 (Responsive Scale)
`--text-*` 變數本身會依斷點在 `:root` 內整批重新賦值（見 `index.html` 開頭 `<style>` 區塊、`:root` 宣告之後的兩個 `@media` 區塊），任何地方只要是用 `var(--text-*)` 設定字級，**會自動跟著縮小，不需要額外寫 media query**。斷點與縮放比例如下：

| 變數 | 桌機 (預設) | ≤1024px | ≤640px |
|---|---|---|---|
| `--text-giga` | 14rem | 9rem | 5.5rem |
| `--text-mega` | 10rem | 6.5rem | 4.2rem |
| `--text-hero` | 6rem | 4.4rem | 3rem |
| `--text-4xl` | 3.8rem | 3rem | 2.4rem |
| `--text-3xl` | 3.2rem | 2.6rem | 2rem |
| `--text-2xl` | 2.2rem | 1.9rem | 1.6rem |
| `--text-xl` | 1.8rem | 1.6rem | 1.4rem |
| `--text-lg` | 1.35rem | 1.2rem | 1.1rem |
| `--text-base` | 1rem | 不變 | 0.95rem |
| `--text-sm` | 0.9rem | 不變 | 0.86rem |
| `--text-xs` | 0.8rem | 不變 | 0.78rem |
| `--text-tiny` | 0.72rem | 不變 | 0.7rem |

**執行守則**：
1. **優先換用 Scale 中「上一階/下一階」的變數**。如果某個元件在手機版看起來還是太大/太小，第一步是換一個現有變數（例如某標題桌機用 `--text-hero`，手機想再小一點就改引用 `--text-3xl`），而不是直接加 `@media { .xxx { font-size: 2rem; } }`。只有這個元件的縮放需求真的跟其他所有用同一個變數的地方都不一樣時，才允許針對該元件寫局部 `@media` 覆寫，並加註解說明為什麼它需要跟 Scale 不同步。
2. 若要微調的是「全站統一的縮放力道」，就直接調整這兩個 `@media` 區塊裡 `:root` 的數值，全站會統一跟著變動——不要為了調整整體感覺去逐一覆寫個別元件。
