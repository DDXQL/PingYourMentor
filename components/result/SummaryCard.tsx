'use client';

import type { AnalysisResult } from '@/types';

interface SummaryCardProps {
  result: AnalysisResult;
}

export default function SummaryCard({ result }: SummaryCardProps) {
  const getDecisionConfig = (decision: string) => {
    switch (decision) {
      case '推荐':
        return { color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', label: '可以联系' };
      case '谨慎':
        return { color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', label: '谨慎联系' };
      case '不推荐':
        return { color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', label: '不建议联系' };
      default:
        return { color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', label: '待评估' };
    }
  };

  const config = getDecisionConfig(result.decision);
  const scoreColor = result.score >= 70 ? 'text-green-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className={`rounded-2xl border ${config.border} ${config.bg} p-6 mb-6`}>
      <div className="flex items-start justify-between gap-6">
        {/* 匹配度 */}
        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-2">匹配度</div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className={`text-5xl font-bold ${scoreColor}`}>{result.score}</span>
            <span className="text-xl text-gray-400">/100</span>
          </div>
          {/* 进度条 */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${config.color}`}
              style={{ width: `${result.score}%` }}
            />
          </div>
        </div>

        {/* 分隔线 */}
        <div className="w-px bg-gray-200 self-stretch" />

        {/* 建议 */}
        <div className="flex-1 text-center">
          <div className="text-sm text-gray-500 mb-2">建议</div>
          <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${config.text} ${config.bg} border ${config.border}`}>
            {config.label}
          </div>
          <p className="text-sm text-gray-600 mt-3 max-w-xs mx-auto">
            {result.summary || '暂无详细结论'}
          </p>
        </div>
      </div>
    </div>
  );
}
