# 私享论坛 - 极致纯净的文字信源

这是一个基于 Cloudflare Workers 和 KV 存储构建的轻量级、设计感信息沟通平台。它旨在通过极简的视觉表达和“意会”式的准入机制，构建一个杜绝 AI 噪音、杜绝广告噪音的纯净文字分享空间。

## ✨ 核心特性

- **极致纯净 UI**：采用 Optima 字体与极简留白设计，营造沉静、雅致的阅读与写作氛围。
- **维度化评估**：每一条内容均包含“治愈度”、“美感”、“准确度”等主观/客观指标，将视觉化信息与结构化数据结合。
- **意会准入机制**：通过“关键词/相同经验”准入层过滤背景不一致的内容，确保社区共鸣度。
- **数据自主权**：内置 `/export` 接口，支持一键将所有内容备份为 JSON 文件，无惧平台迁移。
- **边缘架构**：单文件部署在 Cloudflare 全球边缘节点，响应极速，架构精简。

## 🛠️ 技术实现

- **Runtime**: Cloudflare Workers (Service Worker / ES Modules)
- **Storage**: Cloudflare KV (Key-Value Storage)
- **Frontend**: 响应式 HTML5/CSS3/JS 原生实现，无外部框架依赖。

## 🚀 快速开始

### 环境准备
1. 安装 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/).
2. 登录 Cloudflare 账号: `npx wrangler login`.

### 部署步骤
1. **创建 KV 命名空间**:
   ```bash
   npx wrangler kv:namespace create "KV"
   ```
2. **配置 `wrangler.toml`**:
   将上一步生成的 `id` 填入配置文件中。
3. **发布项目**:
   ```bash
   npx wrangler publish
   ```

## 📅 未来愿景

- **自改进智能逻辑**：结合“认知神经科学”流程图，探索自动化的内容质量评估算法。
- **题目准入升级**：将前端准入校验升级为后端加密逻辑或特定领域的认知挑战。
- **知识库联动**：与个人强大知识库进行内容对接，实现知识指向“幸福”的目标。

---

*“那些真正宝贵的东西，往往宁静致远。”*
