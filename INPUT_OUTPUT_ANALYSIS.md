# PingYourMentor 系统输入输出分析文档

## 1. 系统概述

PingYourMentor 是一个 AI 驱动的留学套磁决策助手，通过分析导师信息和学生简历，提供多维度的匹配分析、风险评估和策略建议。

---

## 2. 输入分析

### 2.1 API 请求格式

**端点**: `POST /api/analyze`

**请求头**:
```json
{
  "Content-Type": "application/json"
}
```

**请求体 (AnalyzeRequest)**:
```typescript
interface AnalyzeRequest {
  mentorText: string;  // 导师信息文本
  resumeText: string;  // 学生简历文本
}
```

### 2.2 输入验证规则

| 字段 | 最小长度 | 说明 |
|------|---------|------|
| mentorText | 50 字符 | 导师信息必须足够详细 |
| resumeText | 50 字符 | 简历信息必须足够详细 |

### 2.3 输入示例

**导师信息示例** (SAMPLE_MENTOR):
```
Professor Chen Wei
Department of Computer Science
Stanford University

Research Interests:
- Machine Learning and Deep Learning
- Natural Language Processing
- Computer Vision
- AI for Healthcare

Recent Publications:
- "Attention-based Neural Networks for Medical Image Analysis" (Nature Medicine, 2024)
- "Transformer Models for Clinical Text Understanding" (NeurIPS, 2023)

Lab Information:
- Size: 15-20 students
- Focus: Applied AI in healthcare
- Collaboration: Strong international collaboration with European universities
- Funding: Well-funded through NIH grants

Expectations for Students:
- Strong programming skills (Python, PyTorch/TensorFlow)
- Background in statistics and mathematics
- Previous research experience preferred
- Publications is a plus but not required

Mentoring Style:
- Weekly one-on-one meetings
- Collaborative research environment
- Emphasis on both theoretical foundations and practical applications
- Support for conference attendance and career development
```

**学生简历示例** (SAMPLE_RESUME):
```
Name: Zhang Wei
Education:
- B.S. in Computer Science, Tsinghua University (2020-2024), GPA: 3.8/4.0
- Expected M.S. in Computer Science, Tsinghua University (2024-2026)

Relevant Coursework:
- Machine Learning
- Deep Learning
- Natural Language Processing
- Computer Vision
- Data Structures and Algorithms

Research Experience:
- Research Assistant, NLP Lab, Tsinghua University (2022-Present)
  - Worked on text classification using BERT
  - Co-authored a paper submitted to ACL 2024
  - Skills: Python, PyTorch, transformers library

- Summer Intern, Tech Company AI Lab (2023 Summer)
  - Developed chatbots using GPT models
  - Skills: GPT APIs, LangChain, prompt engineering

Technical Skills:
- Programming: Python, C++, Java
- ML/DL: PyTorch, TensorFlow, scikit-learn
- NLP: BERT, GPT, transformers, NLTK
- Tools: Git, Docker, Linux

Publications:
- "Enhanced BERT for Chinese Text Classification" (Submitted to ACL 2024)

Career Goals:
Pursue a Ph.D. in Machine Learning and contribute to AI research, particularly in NLP and its applications in healthcare.
```

---

## 3. 输出分析

### 3.1 API 响应格式

**成功响应 (200)**:
```typescript
interface AnalyzeResponse {
  success: true;
  data: AnalysisResult;
}
```

**错误响应 (400/500)**:
```typescript
interface AnalyzeResponse {
  success: false;
  error: string;  // 错误信息
}
```

### 3.2 完整输出结构 (AnalysisResult)

```typescript
interface AnalysisResult {
  mentor: MentorAnalysis;           // 导师分析
  student: StudentAnalysis;        // 学生分析
  match: MatchAnalysis;            // 匹配度分析
  risk: RiskAnalysis;              // 风险分析
  strategy: Strategy;              // 策略建议
  email: EmailDraft;               // 邮件草稿
  recommendation: Recommendation;  // 最终建议
  overallSummary: string;          // 总体摘要
  generatedAt: string;             // 生成时间
}
```

### 3.3 详细输出字段说明

#### 3.3.1 导师分析 (MentorAnalysis)

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string? | 导师姓名 |
| institution | string | 机构名称 |
| department | string | 系所名称 |
| title | string | 职称 |
| researchFocus | ResearchFocus[] | 研究方向 |
| mentorStyle | MentorStyle | 指导风格 |
| expectations | MentorExpectation | 期望要求 |
| funding | FundingInfo | 经费信息 |
| labInfo | LabInfo | 实验室信息 |
| redFlags | string[] | 红旗警示 |
| greenFlags | string[] | 绿灯信号 |
| summary | string | 分析摘要 |

#### 3.3.2 学生分析 (StudentAnalysis)

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string? | 学生姓名 |
| academicBackground | AcademicBackground | 学术背景 |
| researchExperience | ResearchExperience[] | 研究经历 |
| skillSet | SkillSet | 技能集合 |
| careerGoals | string | 职业目标 |
| motivation | string | 申请动机 |
| uniqueStrengths | string[] | 独特优势 |
| summary | string | 分析摘要 |

#### 3.3.3 匹配度分析 (MatchAnalysis)

| 字段 | 类型 | 说明 |
|------|------|------|
| overallScore | number (0-100) | 综合匹配分数 |
| matchLevel | 'high' \| 'medium' \| 'low' | 匹配等级 |
| matchPoints | MatchPoint[] | 匹配点 |
| gapPoints | GapPoint[] | 差距点 |
| alignmentSummary | string | 对齐摘要 |

#### 3.3.4 风险分析 (RiskAnalysis)

| 字段 | 类型 | 说明 |
|------|------|------|
| risks | Risk[] | 风险列表 |
| overallRiskLevel | 'high' \| 'medium' \| 'low' | 综合风险等级 |
| riskSummary | string | 风险摘要 |
| dealBreakers | string[] | 致命问题 |

#### 3.3.5 策略建议 (Strategy)

| 字段 | 类型 | 说明 |
|------|------|------|
| recommendedStyle | 'formal' \| 'semi-formal' \| 'casual' | 推荐邮件风格 |
| tone | 'enthusiastic' \| 'professional' \| 'curious' \| 'confident' | 语气 |
| mustInclude | string[] | 必须包含的内容 |
| shouldInclude | string[] | 建议包含的内容 |
| avoid | string[] | 应避免的内容 |
| openingStrategy | OpeningStrategy | 开篇策略 |
| followUpStrategy | FollowUpStrategy | 跟进策略 |
| strategySummary | string | 策略摘要 |

#### 3.3.6 邮件草稿 (EmailDraft)

| 字段 | 类型 | 说明 |
|------|------|------|
| subject | string | 邮件主题 |
| greeting | string | 称呼 |
| introduction | string | 自我介绍 |
| body | string | 正文 |
| closing | string | 结尾 |
| fullEmail | string | 完整邮件 |
| estimatedLength | string | 预估长度 |
| keyPoints | string[] | 关键要点 |

#### 3.3.7 最终建议 (Recommendation)

| 值 | 说明 |
|----|------|
| highly_recommended | 强烈推荐联系 |
| caution | 建议谨慎联系 |
| not_recommended | 不建议联系 |

---

## 4. 数据流图

```
┌─────────────────┐
│   前端页面输入    │
│  (导师信息+简历)  │
└────────┬────────┘
         │ POST /api/analyze
         ▼
┌─────────────────┐
│   API Route     │
│  (输入验证)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  1. mentorAnalysis()     │──▶ 导师分析
│  2. studentAnalysis()    │──▶ 学生分析
│  3. matchAnalysis()      │──▶ 匹配分析
│  4. riskAnalysis()      │──▶ 风险分析
│  5. strategyGeneration() │──▶ 策略生成
│  6. emailGeneration()   │──▶ 邮件生成
└────────┬─────────────────┘
         │ OpenAI API
         ▼
┌─────────────────┐
│  汇总 & 推荐     │
│ determineRecommendation()
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   保存数据库     │
│  (可选 Supabase) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   返回结果      │
│  (AnalysisResult)│
└─────────────────┘
```

---

## 5. AI Agent 调用链路

| 步骤 | Agent | 输入 | 输出 |
|------|-------|------|------|
| 1 | mentorAnalysis | mentorText | MentorAnalysis |
| 2 | studentAnalysis | resumeText | StudentAnalysis |
| 3 | matchAnalysis | mentor + student | MatchAnalysis |
| 4 | riskAnalysis | mentor + student + match | RiskAnalysis |
| 5 | strategyGeneration | mentor + student + match + risk | Strategy |
| 6 | emailGeneration | mentor + student + strategy | EmailDraft |

---

## 6. 配置信息

### 6.1 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| OPENAI_API_KEY | OpenAI API 密钥 | (必需) |
| OPENAI_BASE_URL | API 代理地址 | https://api.openai-proxy.org/v1 |
| OPENAI_MODEL | 模型名称 | gpt-4.1-mini |

### 6.2 API 配置

| 参数 | 值 |
|------|-----|
| 模型 | gpt-4.1-mini |
| 最大 Token | 4000 |
| Temperature | 0.7 |

---

## 7. 性能指标

从日志分析:
- 分析完成时间: ~47秒 (47138ms)
- API 调用次数: 6 次 (6 个 Agent)
- 单次 API 响应: 成功

---

## 8. 错误处理

| 错误类型 | HTTP 状态码 | 处理方式 |
|----------|-------------|----------|
| 缺少必填字段 | 400 | 返回错误信息 |
| 输入过短 | 400 | 提示增加内容 |
| OpenAI API 错误 | 500 | 返回错误详情 |
| 网络错误 | 500 | 重试机制 |

---

## 9. 更新日志

| 日期 | 版本 | 描述 |
|------|------|------|
| 2026-04-19 | v1.0 | 初始版本，支持完整的导师-学生匹配分析流程 |

