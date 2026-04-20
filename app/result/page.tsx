'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { AnalysisResult } from '@/types';
import SummaryCard from '@/components/result/SummaryCard';
import MatchAnalysis from '@/components/result/MatchAnalysis';
import RiskPanel from '@/components/result/RiskPanel';
import StrategyPanel from '@/components/result/StrategyPanel';
import EmailDraftPanel from '@/components/result/EmailDraftPanel';
import DetailsCollapse from '@/components/result/DetailsCollapse';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('analysisResult');
    if (!stored) {
      router.push('/');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setResult(parsed);
    } catch {
      setError('加载分析结果失败');
    }
  }, [router]);

  const handleNewAnalysis = () => {
    sessionStorage.removeItem('analysisResult');
    router.push('/');
  };

  const handleRegenerateEmail = async () => {
    if (!result) return;

    setIsRegenerating(true);
    try {
      const mentorText = sessionStorage.getItem('mentorText') || '';
      const resumeText = sessionStorage.getItem('resumeText') || '';

      const response = await fetch('/api/analyze-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentorText, resumeText }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setResult(data.data);
        sessionStorage.setItem('analysisResult', JSON.stringify(data.data));
      }
    } catch (err) {
      console.error('Regenerate failed:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✕</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">出错了</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载分析结果...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🎯</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PingYourMentor</h1>
              <p className="text-xs text-gray-500">套磁决策助手</p>
            </div>
          </Link>
          <button
            onClick={handleNewAnalysis}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            新分析
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* 1. SummaryCard - 决策优先 */}
        <SummaryCard result={result} />

        {/* 2. MatchAnalysis - 为什么匹配 */}
        <MatchAnalysis match={result.match} />

        {/* 3. RiskPanel - 可能的风险 */}
        <RiskPanel risks={result.risks} />

        {/* 4. StrategyPanel - 怎么写更容易回复 */}
        <StrategyPanel strategy={result.strategy} />

        {/* 5. EmailDraft - 邮件草稿 */}
        <EmailDraftPanel
          email={result.email}
          onRegenerate={handleRegenerateEmail}
          isRegenerating={isRegenerating}
        />

        {/* 6. DetailsCollapse - 详细数据 */}
        <DetailsCollapse profiles={{}} />

        {/* 免责声明 */}
        <div className="p-4 bg-gray-100 rounded-xl mt-6">
          <p className="text-xs text-gray-500 text-center">
            本分析结果由 AI 自动生成，仅供参考。实际套磁结果会受到多种因素影响，
            请结合实际情况和个人判断做出最终决策。
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6">
        <div className="max-w-3xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>PingYourMentor v1.5 · 套磁决策助手</p>
        </div>
      </footer>
    </div>
  );
}
