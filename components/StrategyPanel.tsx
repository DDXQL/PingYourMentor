'use client';

import { useState } from 'react';
import { FiSend, FiChevronDown, FiChevronUp, FiCheck, FiX, FiClock } from 'react-icons/fi';
import type { Strategy } from '@/types';

interface StrategyPanelProps {
  strategy: Strategy;
}

const styleConfig = {
  formal: { label: '正式', color: 'bg-blue-100 text-blue-700' },
  'semi-formal': { label: '半正式', color: 'bg-purple-100 text-purple-700' },
  casual: { label: '轻松', color: 'bg-green-100 text-green-700' },
};

const toneConfig = {
  enthusiastic: { label: '热情', color: 'text-orange-600' },
  professional: { label: '专业', color: 'text-blue-600' },
  curious: { label: '好奇', color: 'text-purple-600' },
  confident: { label: '自信', color: 'text-green-600' },
};

function PointList({ title, points, type }: { title: string; points: string[]; type: 'must' | 'should' | 'avoid' }) {
  const config = {
    must: { icon: FiCheck, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    should: { icon: FiCheck, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    avoid: { icon: FiX, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
  }[type];

  const Icon = config.icon;

  if (points.length === 0) return null;

  return (
    <div className={`p-4 rounded-xl border ${config.borderColor} ${config.bgColor}`}>
      <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
        <Icon className={`w-4 h-4 ${config.color}`} />
        {title} ({points.length})
      </h4>
      <ul className="space-y-2">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-1 text-gray-400">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function StrategyPanel({ strategy }: StrategyPanelProps) {
  const [expanded, setExpanded] = useState(true);

  const style = styleConfig[strategy.recommendedStyle];
  const tone = toneConfig[strategy.tone];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiSend className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">联系策略</h3>
        </div>
        {expanded ? (
          <FiChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">推荐风格</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${style.color}`}>
                {style.label}
              </span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">邮件语气</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${tone.color}`}>
                {tone.label}
              </span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <h4 className="font-medium text-blue-900">开场策略</h4>
            </div>
            <p className="text-sm text-blue-800 mb-2">
              <span className="font-medium">类型: </span>{strategy.openingStrategy.hookType}
            </p>
            <div className="p-3 bg-white/50 rounded-lg">
              <p className="text-sm text-blue-700 italic">"{strategy.openingStrategy.example}"</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <FiClock className="w-4 h-4 text-gray-600" />
              <h4 className="font-medium text-gray-900">跟进策略</h4>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">时机: </span>
                {strategy.followUpStrategy.timing}
              </p>
              <p>
                <span className="font-medium">方式: </span>
                {strategy.followUpStrategy.approach}
              </p>
              <p>
                <span className="font-medium">最大跟进次数: </span>
                {strategy.followUpStrategy.maxFollowUps} 次
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <PointList title="必须包含" points={strategy.mustInclude} type="must" />
            <PointList title="建议包含" points={strategy.shouldInclude} type="should" />
            <PointList title="避免提及" points={strategy.avoid} type="avoid" />
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <h4 className="font-medium text-purple-900 mb-2">策略总结</h4>
            <p className="text-sm text-purple-800">{strategy.strategySummary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
