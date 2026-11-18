# LeapAvid 设计风格库（DSH-Design-LeapAvid）

84 套品牌设计语言，取自开源语料库 awesome-design-md（MIT），在 DSH 左侧栏以「设计风格库」面板呈现；每个风格的中文文案由本项目依据其 token 撰写。

## 能做什么

- **浏览**：84 个风格卡片，可切换两种载体——网页、幻灯片（16:9，一套 5 页）；两种载体都可切换浅色 / 深色（本身是深色底色的品牌不提供浅色版）；网页预览顶部的 8 个区块锚点可以直接点击跳转；页面底部还有「相近的风格」和「导出 token」。每个预览都用该风格自己 `DESIGN.md` 里的颜色、字体、圆角、间距实时渲染，不是截图，也不加载任何外部资源。
- **详情**：设计要点、完整配色板（点色块复制 hex）、字体层级、圆角/间距、关键词、适合/避免、AI 检查项、推荐提示词；底部是「相近的风格」横向条，点一张即可换到那个风格。右栏还提供「导出 token」：复制 CSS 变量、下载 tokens.json、复制 Tailwind 配置。
- **生成**：选产出形态、写需求，一键把「风格 token + 风格要点 + 交付要求」组装成提示词发送到当前会话，由 DSH 直接产出单文件 `index.html` 或 `deck.html`。可勾选「连同完整 DESIGN.md 一起发送」以获得更高还原度。
- **Agent 工具**：`design_md`（action: `list` / `get`）让模型自己检索这套库，用户说「用 Stripe 的风格做」「有哪些适合金融的风格」时无需打开面板。

## 页面结构与迭代

表单里的「页面结构」可选 不限 / 落地页 / 定价页 / 控制台 / 博客，Host 会把对应的区块清单（例如定价页 = 首屏 + 三档价格卡 + 功能对比 + FAQ + 底部 CTA）以有序列表写进提示词。发送成功后表单会出现「再改一版 / 换风格重做」：前者把需求预填成「在上一版基础上调整…」，并把上次产物的路径一起传给 Host，让 DSH 就地修改而不是重写。

## 收藏与最近

卡片右上角与详情标题旁都能收藏（☆/★），收藏与最近使用存在浏览器本地（`localStorage`，键 `dsh-design-leapavid:v1`（旧键 `dsh-design-md:v1` 会自动兼容读取）），列表 chips 会多出「★ 收藏 N」「最近 N」两个视图。

## 数据来源

- 主库：`awesome-design-md-main/design-md/<slug>/DESIGN.md`（84 个，MIT）
- 中文文案：由本仓库生成 —— `build/zh-lexicon.json`（品牌中文名与分类标签）+ `build/copy-overrides.json`（84 条人工撰写的摘要与定位语），不复制任何第三方中文文本
- 构建产物在 `data/`：`catalog.json`（84 条，含 token 与视觉推导）、`design/<slug>.md`、`brief/<slug>.md`

重新构建：

```bash
node build/build-data.mjs
```

## 技术结构

- `index.js`（Host）：注册 `/api/design-md` 前缀路由（catalog / style / brief / design / prompt）与 `design_md` 工具。只读，不写工作区。
- `client.js`（Client）：注册 `sidebar.panellist` 图标与 `main` 面板；面板用 React 渲染，样式走 `--dsw-alias-*` 主题 token；发送通过 `sessions.binding(id).session.prompt()` 进入当前会话。
- 预览渲染使用 CSS 容器查询（`cqw`），同一个组件在 250px 卡片与 760px 详情图里都保持比例。

## 已知边界

- 品牌字体（Sohne、Copernicus、SF Pro 等）不随插件分发，预览按 sans/serif/mono 回退到系统字体；风格差异靠字号、字重、字距、层级与密度体现。
- 预览文案是示意内容（英文品牌名 + 中文说明），不代替真实项目文案。
