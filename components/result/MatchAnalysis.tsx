'use client';

import type { Match } from '@/types';

interface MatchAnalysisProps {
  match: Match;
}

export default function MatchAnalysis({ match }: MatchAnalysisProps) {
  const pros = match.pros || [];
  const cons = match.cons || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">为什么匹配</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 匹配点 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-600 text-lg">✔</span>
            <span className="font-medium text-gray-900">匹配点</span>
            <span className="text-xs text-gray-400">({pros.length})</span>
          </div>
          {pros.length > 0 ? (
            <ul className="space-y-2">
              {pros.map((pro, i) => (
                <li key={i} className="text-sm text-gray-700 pl-6 relative before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-green-500 before:rounded-full">
                  {pro}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">暂无匹配点</p>
          )}
        </div>

        {/* 差距 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-yellow-600 text-lg">⚠</span>
            <span className="font-medium text-gray-900">需要注意</span>
            <span className="text-xs text-gray-400">({cons.length})</span>
          </div>
          {cons.length > 0 ? (
            <ul className="space-y-2">
              {cons.map((con, i) => (
                <li key={i} className="text-sm text-gray-700 pl-6 relative before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-yellow-500 before:rounded-full">
                  {con}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">暂无不匹配点</p>
          )}
        </div>
      </div>
    </div>
  );
}
