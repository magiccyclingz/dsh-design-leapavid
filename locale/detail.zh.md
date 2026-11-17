# 设计风格库（dsh-design-md）

84 套品牌设计语言，取自 [getdesign.md](https://getdesign.md/) 的开源语料（awesome-design-md / awesome-design-md-cn），在 DSH 左侧栏以「设计风格库」面板呈现。

## 能做什么

- **浏览**：84 个风格卡片，可切换两种载体——网页、幻灯片（16:9，一套 5 页）；三种载体都可切换浅色 / 深色（本身是深色底色的品牌不提供浅色版）；网页预览顶部的 8 个区块锚点可以直接点击跳转；页面底部还有「相近的风格」和「导出 token」。每个预览都用该风格自己 `DESIGN.md` 里的颜色、字体、圆角、间距实时渲染，不是截图，也不加载任何外部资源。
- **详情**：设计要点、完整配色板（点色块复制 hex）、字体层级、圆角/间距、关键词、适合/避免、AI 检查项、推荐提示词，以及指向 getdesign.md 原页面的链接。
- **生成**：选产出形态、写需求，一键把「风格 token + 风格要点 + 交付要求」组装成提示词发送到当前会话，由 DSH 直接产出 `index.html` / `deck.html` / `poster.html`。可勾选「连同完整 DESIGN.md 一起发送」以获得更高还原度。
- **Agent 工具**：`design_md`（action: `list` / `get`）让模型自己检索这套库，用户说「用 Stripe 的风格做」「有哪些适合金融的风格」时无需打开面板。

## 数据来源

- 主库：`awesome-design-md-main/design-md/<slug>/DESIGN.md`（84 个）
- 中文元数据：`awesome-design-md-cn/data/designs.json`（74 个共有的 + 10 个主库独有 slug 的元数据为手工撰写）
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
