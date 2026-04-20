'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSend, FiInfo, FiLoader, FiArrowRight } from 'react-icons/fi';

const SAMPLE_MENTOR = `Professor Chen Wei
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
- Support for conference attendance and career development`;

const SAMPLE_RESUME = `Name: Zhang Wei
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
Pursue a Ph.D. in Machine Learning and contribute to AI research, particularly in NLP and its applications in healthcare.`;

export default function HomePage() {
  const router = useRouter();
  const [mentorText, setMentorText] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mentorText.trim() || !resumeText.trim()) {
      setError('请填写导师信息和简历信息');
      return;
    }

    if (mentorText.length < 50 || resumeText.length < 50) {
      setError('输入内容过短，请提供更详细的信息');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorText,
          resumeText,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '分析失败');
      }

      sessionStorage.setItem('analysisResult', JSON.stringify(data.data));
      router.push('/result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = () => {
    setMentorText(SAMPLE_MENTOR);
    setResumeText(SAMPLE_RESUME);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🎯</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PingYourMentor</h1>
              <p className="text-xs text-gray-500">套磁决策助手</p>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
              />
            </svg>
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            智能分析，精准套磁
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            告别盲目套磁。AI 驱动的多维度分析，帮您了解导师、评估匹配度、识别风险、制定策略
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">👁️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">看透导师</h3>
            <p className="text-gray-600 text-sm">
              深入分析导师的研究方向、指导风格、经费情况和实验室文化
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">精准匹配</h3>
            <p className="text-gray-600 text-sm">
              多维度评估您与导师的匹配度，找出优势和差距
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">规避风险</h3>
            <p className="text-gray-600 text-sm">
              识别潜在风险和"雷区"，让您做出明智的决策
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">输入信息</h3>
              <button
                type="button"
                onClick={loadSample}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <FiInfo className="w-4 h-4" />
                加载示例
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                导师信息
                <span className="text-gray-400 font-normal ml-1">(网页、简历、简介等)</span>
              </label>
              <textarea
                value={mentorText}
                onChange={(e) => setMentorText(e.target.value)}
                placeholder="粘贴导师的研究方向、个人主页、招生信息等..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-gray-900 placeholder-gray-400"
              />
              <p className="mt-2 text-xs text-gray-500">
                建议包含：研究方向、招生要求、指导风格、经费情况等
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                您的简历
                <span className="text-gray-400 font-normal ml-1">(或自我介绍)</span>
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="粘贴您的简历、教育背景、研究经历、技能等..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-gray-900 placeholder-gray-400"
              />
              <p className="mt-2 text-xs text-gray-500">
                建议包含：学历背景、研究经历、技术技能、发表论文等
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiInfo className="w-4 h-4" />
              <span>预计分析时间：30-60 秒</span>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-medium hover:from-primary-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
            >
              {isLoading ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  开始分析
                  <FiArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span> 使用提示
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 输入信息越详细，分析结果越准确</li>
            <li>• 可以直接复制导师的主页内容或招生帖</li>
            <li>• 建议使用英文信息以获得更好的分析效果</li>
            <li>• 分析结果仅作为参考，最终决策请结合实际情况</li>
          </ul>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>PingYourMentor · 套磁决策助手 · Powered by AI</p>
        </div>
      </footer>
    </div>
  );
}
