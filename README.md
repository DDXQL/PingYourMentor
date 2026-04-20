# PingYourMentor - 套磁决策助手

> AI驱动的套磁决策工具，10秒内帮你决定要不要联系导师

## 🎯 产品定位

这是一个**套磁决策工具**，帮助用户在联系导师前做出明智决策。

核心目标：快速判断导师是否值得联系

## ✨ 核心特性

- **决策优先** - 匹配度+建议，10秒内看懂结果
- **3 Agent Pipeline** - Profile → Decision → Email，简洁高效
- **智能邮件生成** - 基于策略的个性化邮件
- **响应式设计** - 移动端友好
- **现代UI** - 卡片式设计，信息分层清晰

## 🛠️ 技术栈

- **Frontend**: Next.js 14 (App Router) + React 18 + Tailwind CSS
- **Backend**: Next.js API Routes (Edge Runtime)
- **AI**: OpenAI GPT-4o
- **Deployment**: Vercel Ready

## 📁 项目结构

```
/app
├── page.tsx                    # 首页 - 输入页面
├── result/page.tsx             # 结果页 - 决策结果
├── layout.tsx                  # 布局
├── globals.css                 # 全局样式
└── api/
    └── analyze-v2/route.ts     # 主分析接口 (v1.5)

/components/result/
├── SummaryCard.tsx             # 总结卡片 - 匹配度+建议
├── MatchAnalysis.tsx           # 为什么匹配 - pros/cons
├── RiskPanel.tsx               # 可能的风险
├── StrategyPanel.tsx           # 怎么写更容易回复
├── EmailDraftPanel.tsx         # 邮件草稿
└── DetailsCollapse.tsx        # 详细信息折叠

/lib/agents/
├── openai.ts                   # OpenAI客户端
├── profile.ts                  # Agent 1: 画像分析
├── decision.ts                 # Agent 2: 决策分析
└── email-v2.ts                # Agent 3: 邮件生成

/types
└── index.ts                   # TypeScript类型定义
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone git@github.com:DDXQL/PingYourMentor.git
cd PingYourMentor
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`：

```env
# OpenAI Configuration (必需)
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o
```

### 4. 启动开发服务器

```bash
npm run dev
# 或双击 start.bat
```

访问 http://localhost:3000

## 📖 使用流程

1. **输入信息**
   - 粘贴导师信息（主页、招生帖等）
   - 粘贴您的简历

2. **等待分析** (~30秒)
   - Profile Agent: 分析画像
   - Decision Agent: 给出决策
   - Email Agent: 生成邮件

3. **查看结果** (决策优先)
   - 匹配度 + 建议（先看这个）
   - 为什么匹配
   - 可能的风险
   - 怎么写更容易回复
   - 邮件草稿

4. **做决策**
   - 复制邮件
   - 重新生成
   - 开始新分析

## 🔧 开发

### Agent 架构 (v1.5)

```
Input → Profile Agent → Decision Agent → Email Agent → Output
```

每个 Agent 的 Prompt 定义在对应的 `lib/agents/*.ts` 文件中。

### 添加新功能

1. 修改 `lib/agents/*.ts` 添加新逻辑
2. 更新 `types/index.ts` 添加类型
3. 更新 `app/api/analyze-v2/route.ts` 集成
4. 更新组件展示结果

## 🌿 分支管理

### 分支说明

| 分支 | 用途 | Vercel 环境 |
|------|------|-------------|
| `main` | 生产环境（稳定） | Production 线上 |
| `dev` | 开发测试 | Preview 预览 |

### 快速命令

```bash
# 切换到 dev 开始开发
git checkout dev

# 提交代码
git add .
git commit -m "feat: 你的修改"
git push

# 测试通过后合并到 main
git checkout main
git merge dev
git push origin main

# 切回 dev 继续
git checkout dev
```

### Vercel 自动行为

| 推送分支 | Vercel 结果 |
|----------|-------------|
| `dev` | 生成 Preview URL（供测试） |
| `main` | 更新 Production（线上用户可见） |

### ⚠️ 重要规则

- **不要直接在 main 开发** → 会影响线上用户
- **始终：dev 开发 → Preview 测试 → 合并 main**

## 🌐 部署

### Vercel (推荐)

1. Fork 本项目
2. 在 Vercel 中导入
3. 配置 `OPENAI_API_KEY`
4. Deploy

## 📝 API

### POST /api/analyze-v2

**请求：**
```json
{
  "mentorText": "导师信息...",
  "resumeText": "简历信息..."
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "score": 78,
    "decision": "推荐",
    "summary": "方向匹配，但需强调项目经验",
    "match": { "pros": [], "cons": [] },
    "risks": [{ "level": "中", "text": "..." }],
    "strategy": { "tone": "学术", "must": [], "avoid": [], "core": "..." },
    "email": { "subject": "...", "body": "..." },
    "generatedAt": "..."
  }
}
```



## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI](https://openai.com/)
