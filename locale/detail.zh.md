# LeapAvid 设计风格库（DSH-Design-LeapAvid）

84 套品牌设计语言，取自开源语料库 awesome-design-md（MIT）。每套风格都直接读取该品牌 `DESIGN.md` 里的颜色、字体、圆角、间距，在面板里现场渲染，不是截图，也不加载任何外部资源。

## 能做什么

- **浏览**：84 张风格卡片，三种载体——网页（16:9）、幻灯片（16:9，一套 5 页）、信息图（4:3 封面）。缩略图进入视口才渲染，滚动不卡。搜索支持品牌名 / 中文名 / slug / 关键词 / 适用场景；分类 chips 带数量（全部 84、品牌官网 21、AI 产品 16…）；「★ 收藏」「最近使用」两个视图。
- **详情**：右栏「规范明细」分 5 个切换——配色（点色块复制 hex）、排版要求（字体层级与字号/字重/行高）、形状与间距（圆角、间距基数、组件圆角示意）、组件样例、导出 token（复制 CSS 变量 / 下载 `tokens.json` / 复制 Tailwind 配置）。底部是「相近的风格」横向条，点一张即换风格；标题旁可收藏，并显示「上次生成过 · N 分钟前 · 字数」。
- **生成**：选产出形态，写需求，一键把「风格 token + 风格要点 + 交付要求」组装成提示词发进当前会话，由 DSH 产出单文件 `index.html`（网页）、`deck.html`（幻灯片）或信息图 HTML。幻灯片可选用途（标准 / 提案 / 汇报 / 产品 / 融资 / 培训 deck）与三档密度；信息图可选图表类型（自动 / 柱状 / 折线 / 环形 / 面积 / 漏斗）、版式（一栏 / 两栏 / 三栏 / 四栏模板）、画布比例（1:1 / 4:3 / 3:4 / 16:9 / 9:16）与信息块密度。可勾「连同完整 DESIGN.md 一起发送」获得更高还原度；发送成功后表单提供「再改一版 / 换风格重做」。
- **Agent 工具**：`design_md`（`action: list / get`）让模型自己检索这套库，用户说「用 Stripe 的风格做」「有哪些适合金融的风格」时无需打开面板。

## 收藏、最近与上次生成

三份状态都存在**宿主侧**：`$DSH_HOME/dsh-design-leapavid/store.json`，由 `GET|POST /api/design-md/store` 读写。桌面版每次启动会换端口、换 origin，这个设计保证收藏与「最近使用」重启不丢。浏览器里的 `localStorage` 只当缓存和首次迁移的种子（旧键 `dsh-design-md:v1` 会自动兼容读取）。

## 技术结构

- `index.js`（Host）：注册 `/api/design-md/{catalog,style/<slug>,brief/<slug>,design/<slug>,prompt,store}` 与 `design_md` 工具；除 store 外只读，不写工作区。
- `client.js`（Client）：注册 `sidebar.panellist` 图标与 `main` 面板；React 渲染，样式走 `--dsw-alias-*` 主题 token；发送通过 `sessions.binding(id).session.prompt()` 进入当前会话。
- 预览用 CSS 容器查询（`cqw`）缩放，同一个组件在 250px 卡片与全宽详情里都保持比例。

## 数据来源

- 主库：`awesome-design-md-main/design-md/<slug>/DESIGN.md`（84 个，MIT）
- 中文文案由本项目生成：`build/zh-lexicon.json`（品牌中文名与分类标签）+ `build/copy-overrides.json`（84 条人工撰写的摘要与定位语），不复制第三方中文文本
- 构建产物在 `data/`：`catalog.json`、`design/<slug>.md`、`brief/<slug>.md`；重新生成用 `node build/build-data.mjs`

## 已知边界

- 品牌字体（Sohne、Copernicus、SF Pro 等）不随插件分发，预览按 sans / serif / mono 回退到系统字体；风格差异靠字号、字重、字距、层级与密度体现。
- 预览里的文案是示意内容，不代替真实项目文案。
- 海报（竖版 4:5）的渲染与提示词链路已实现，但入口暂未开放，等版式定型后再上线。
