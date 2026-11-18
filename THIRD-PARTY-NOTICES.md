# 第三方声明与许可

本仓库（`dsh-design-leapavid`）自身以 MIT 许可发布，见 [LICENSE](./LICENSE)。

## 1. VoltAgent/awesome-design-md（MIT）

`data/design/<slug>.md` 的 84 份 `DESIGN.md` 原文复制自
[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)（默认分支 `main`，检索日期 2026-11-17）。
该仓库以 MIT 许可发布，版权声明如下：

```text
MIT License

Copyright (c) 2026 VoltAgent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

按 MIT 要求，上述版权声明与许可全文随 `data/design/` 一并分发。

## 2. 由本项目原创的部分

以下内容由本项目撰写，同为 MIT：

- `data/brief/<slug>.md`：由 DESIGN.md 的 token 与正文提炼的风格要点；
- `data/catalog.json` 中的中文文案（`summaryZh`、`positioningZh`、`styleKeywords`、`tagsZh`、`useCases`、`bestFor`、`avoidFor`、`aiChecklist`、`recommendedPromptZh`）以及 `build/zh-lexicon.json` 中的名称与分类标签；
- `client.js` 的三个预览渲染器（`webHtml` / `slidesHtml` / `posterHtml`）、面板 UI 与全部样式；
- 图标 `icon.svg`、locale 文案、README、CHANGELOG。

中文文案依据每个风格自身的 token（底色、强调色、字体类别、字重、圆角、密度、对比）程序化生成，
不复制任何第三方仓库的中文描述文本。

## 3. 不包含的内容

- 不含任何品牌字体文件（Sohne、Copernicus、SF Pro、Universal Sans 等），预览统一回退到系统 sans / serif / mono。
- 不含品牌 logo、商标图形或官网截图；预览全部由 token 现场渲染。
- 不含 getdesign.md 站点的页面代码。

## 4. 商标与关联性

仓库中出现的 Apple、Stripe、Airbnb、BMW、Figma 等名称，仅为**指代其公开设计语言**的分析对象，
不表示本项目与这些公司存在任何关联、合作或授权，也不构成对其商标的使用许可。
若某个品牌方认为相关表述不妥，可来 issue 要求下架对应条目。
