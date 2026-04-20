'use client';

import type { Risk } from '@/types';

interface RiskPanelProps {
  risks: Risk[];
}

export default function RiskPanel({ risks }: RiskPanelProps) {
  const getRiskStyle = (level: string) => {
    switch (level) {
      case '高':
        return { bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500', tag: 'bg-red-100 text-red-700' };
      case '中':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-500', tag: 'bg-yellow-100 text-yellow-700' };
      case '低':
        return { bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500', tag: 'bg-green-100 text-green-700' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', dot: 'bg-gray-500', tag: 'bg-gray-100 text-gray-700' };
    }
  };

  if (!risks || risks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">可能的风险</h2>
        <p className="text-sm text-gray-400">暂无风险提示</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">可能的风险</h2>

      <div className="space-y-3">
        {risks.map((risk, i) => {
          const style = getRiskStyle(risk.level);
          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-4 rounded-xl ${style.bg} border ${style.border}`}
            >
              <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
              <div className="flex-1">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${style.tag} mb-1`}>
                  {risk.level === '高' ? '高风险' : risk.level === '中' ? '中风险' : '低风险'}
                </span>
                <p className="text-sm text-gray-700">{risk.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
