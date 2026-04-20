'use client';

import type { Strategy } from '@/types';

interface StrategyPanelProps {
  strategy: Strategy;
}

export default function StrategyPanel({ strategy }: StrategyPanelProps) {
  const toneLabels = {
    '学术': { bg: 'bg-purple-100', text: 'text-purple-700' },
    '工程': { bg: 'bg-blue-100', text: 'text-blue-700' },
    '简洁': { bg: 'bg-gray-100', text: 'text-gray-700' },
  };
  const toneStyle = toneLabels[strategy.tone] || toneLabels['简洁'];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">怎么写更容易回复</h2>

      {/* 推荐风格 */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2">推荐语气</div>
        <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-medium ${toneStyle.bg} ${toneStyle.text}`}>
          {strategy.tone || '简洁'}
        </span>
      </div>

      {/* 核心策略 */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="text-xs text-blue-600 mb-1">核心策略</div>
        <p className="text-sm text-gray-900 font-medium">{strategy.core || '突出匹配点'}</p>
      </div>

      {/* 必须写 / 避免写 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600">✔</span>
            <span className="text-sm font-medium text-green-800">应该写</span>
          </div>
          <ul className="space-y-1">
            {(strategy.must || []).slice(0, 3).map((item, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-600">✕</span>
            <span className="text-sm font-medium text-red-800">不要写</span>
          </div>
          <ul className="space-y-1">
            {(strategy.avoid || []).slice(0, 3).map((item, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
