---
description: 海沃控股 (SEAWORTH) 全站區塊間距規範 (Section Spacing System)
trigger: always_on
---

# SEAWORTH Section Spacing System
這份文件定義了海沃控股 (SEAWORTH) 專案「區塊層級」的垂直間距規範（每個 `<section>` 自己的上下留白），目的是讓全站（含手機版）的呼吸感一致，不要有的區塊很擠、有的區塊留一大片空白。**只涵蓋區塊層級的間距，不含元件內部的小間距**（icon 跟文字的間距、卡片內 gap 等——那些維持逐一調整，不在這套規範管轄範圍內）。

## 1. 三階間距變數 (Section Spacing Scale)
`:root` 中定義了 3 個區塊間距層級，對應設計上原本就存在的三種區塊份量：

| 變數 | 桌機 (預設) | ≤1024px | ≤640px | 用在哪些區塊 |
|---|---|---|---|---|
| `--space-section-md` | 100px | 70px | 56px | 三大事業群、國際合規認證 |
| `--space-section-lg` | 140px | 90px | 70px | ESG 共善經營、聯絡我們 |
| `--space-section-xl` | 160px | 100px | 80px | 關於海沃 (About)、最新消息 |

跟 `--text-*` 一樣，這 3 個變數本身會依斷點在 `:root` 內整批重新賦值（見 `index.html` 開頭 `<style>` 區塊，跟字級 RWD 用同一組 `@media` 區塊一起維護），任何區塊只要 `padding` 是用 `var(--space-section-*)`，**會自動跟著縮小，不需要另外寫 media query**。

## 2. 使用方式
1. 新增一個大區塊（`<section>`）時，先判斷它的份量比較接近「三大事業群/認證」這種中等區塊、還是「ESG/聯絡我們」這種標準區塊、還是「About/最新消息」這種最大區塊，套用對應的 `--space-section-md/lg/xl`。
2. 如果某區塊的 padding-top 跟 padding-bottom 本來就刻意不對稱（例如上方留白比下方多，讓它跟下一個區塊銜接更緊密），用 `calc()` 以同一個變數為基準扣減，保留跟 Scale 的關聯性：
   ```css
   .section-projects {
       padding: var(--space-section-xl) 0 calc(var(--space-section-xl) - 20px) 0;
   }
   ```
   不要各自寫死兩個不相關的數字（例如 `160px 0 140px 0`）——這樣手機版縮放時兩個數字要各自記得改，很容易漏掉其中一個（`#three-sectors { padding-top: 100px; }` 就曾經是這種遺留：一個 ID 選擇器蓋掉了 class 的響應式設定，手機版永遠是 100px，已經修正為引用變數）。
3. **禁止對區塊層級的 `padding-top`/`padding-bottom` 用固定 px 寫死**，也不要為單一區塊另外寫一條 `@media { #xxx { padding: ...px; } }`——三個變數已經涵蓋這個網站需要的份量差異，若真的三階都不夠用，才考慮新增第 4 階變數，而不是繞過變數系統。
4. 若要微調的是「全站區塊間距的整體縮放力道」，就直接調整 `:root` 這兩個 `@media` 區塊裡對應的數值，全站會統一跟著變動。

## 3. 與 typography.md 的關係
這份文件跟 `typography.md` 是同一套治理精神（統一在 `:root` 維護、RWD 自動隨斷點縮放、避免逐一覆寫個別元件），只是管轄的對象不同：`typography.md` 管文字大小，這份管區塊留白。兩者的 RWD 斷點（1024px / 640px）刻意保持一致，方便同時調整、同時檢查。
