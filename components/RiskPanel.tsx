'use client';

import { useState } from 'react';
import { FiAlertTriangle, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import type { RiskAnalysis as RiskAnalysisType, Risk } from '@/types';

interface RiskPanelProps {
  risk: RiskAnalysisType;
}

function RiskCard({ risk }: { risk: Risk }) {
  const severityConfig = {
    high: {
      color: 'text-red-600 bg-red-50 border-red-200',
      bgColor: 'bg-red-100',
      label: '高风险',
    },
    medium: {
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      bgColor: 'bg-yellow-100',
      label: '中风险',
    },
    low: {
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      bgColor: 'bg-blue-100',
      label: '低风险',
    },
  };
  const config = severityConfig[risk.level];

  return (
    <div className={`p-4 rounded-xl border ${config.color} bg-opacity-30`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bgColor}`}>
          <FiAlertTriangle className={`w-5 h-5 ${config.color.split(' ')[0]}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-medium text-gray-900">{risk.category}</h4>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
          <div className="p-2 bg-white/50 rounded-lg">
            <p className="text-xs font-medium text-gray-500">
              <span className="text-green-600">应对建议: </span>
              {risk.mitigation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RiskPanel({ risk }: RiskPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [showDealBreakers, setShowDealBreakers] = useState(false);

  const hasDealBreakers = risk.dealBreakers.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <FiAlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">风险评估</h3>
            <p className="text-sm text-gray-500">
              共 {risk.risks.length} 项风险 · 整体风险{' '}
              <span
                className={
                  risk.overallRiskLevel === 'low'
                    ? 'text-green-600'
                    : risk.overallRiskLevel === 'medium'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }
              >
                {risk.overallRiskLevel === 'low' ? '低' : risk.overallRiskLevel === 'medium' ? '中' : '高'}
              </span>
            </p>
          </div>
        </div>
        {expanded ? (
          <FiChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-4">
          {hasDealBreakers && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FiX className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-800">⚠️ 致命风险</h4>
              </div>
              <ul className="space-y-1">
                {risk.dealBreakers.map((breaker, index) => (
                  <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{breaker}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-gray-600 text-sm leading-relaxed">{risk.riskSummary}</p>

          <div className="space-y-3">
            {risk.risks.map((r, index) => (
              <RiskCard key={`risk-${index}`} risk={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
