'use client';

import { useState } from 'react';
import { FiCheck, FiAlertTriangle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import type { MatchAnalysis as MatchAnalysisType, MatchPoint, GapPoint } from '@/types';

interface MatchAnalysisProps {
  match: MatchAnalysisType;
}

function MatchPointCard({ point }: { point: MatchPoint }) {
  const scoreColor =
    point.score >= 80 ? 'text-green-600 bg-green-50' :
    point.score >= 60 ? 'text-yellow-600 bg-yellow-50' :
    'text-red-600 bg-red-50';

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-green-100 rounded-lg mt-0.5">
            <FiCheck className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{point.category}</h4>
            <p className="mt-1 text-sm text-gray-600">{point.description}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${scoreColor}`}>
          {point.score}%
        </span>
      </div>
    </div>
  );
}

function GapPointCard({ point }: { point: GapPoint }) {
  const severityConfig = {
    critical: { color: 'text-red-600 bg-red-50 border-red-200', icon: '!!' },
    moderate: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: '!' },
    minor: { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: '~' },
  };
  const config = severityConfig[point.severity];

  return (
    <div className={`p-4 rounded-xl border ${config.color} bg-opacity-30`}>
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-lg bg-white/50`}>
          <FiAlertTriangle className={`w-4 h-4 ${config.color.split(' ')[0]}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">{point.category}</h4>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
              {point.severity === 'critical' ? '关键' : point.severity === 'moderate' ? '中等' : '轻微'}
            </span>
          </div>
          <p className="text-sm text-gray-600">{point.description}</p>
          <div className="mt-2 p-2 bg-white/50 rounded-lg">
            <p className="text-xs font-medium text-gray-500">建议: {point.suggestion}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MatchAnalysis({ match }: MatchAnalysisProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FiCheck className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">匹配分析</h3>
        </div>
        {expanded ? (
          <FiChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-6">
          <p className="text-gray-600 text-sm leading-relaxed">{match.alignmentSummary}</p>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <FiCheck className="w-4 h-4 text-green-600" />
              匹配点 ({match.matchPoints.length})
            </h4>
            {match.matchPoints.length > 0 ? (
              <div className="space-y-3">
                {match.matchPoints.map((point, index) => (
                  <MatchPointCard key={`match-${index}`} point={point} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">暂无明显匹配点</p>
            )}
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <FiAlertTriangle className="w-4 h-4 text-orange-500" />
              差距点 ({match.gapPoints.length})
            </h4>
            {match.gapPoints.length > 0 ? (
              <div className="space-y-3">
                {match.gapPoints.map((point, index) => (
                  <GapPointCard key={`gap-${index}`} point={point} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">暂无明显差距</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
