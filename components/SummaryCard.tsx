'use client';

import { useState } from 'react';
import { FiTrendingUp, FiAlertTriangle, FiXCircle, FiCheckCircle, FiTarget, FiAward } from 'react-icons/fi';
import type { AnalysisResult, Recommendation, MatchLevel } from '@/types';

interface SummaryCardProps {
  match: AnalysisResult['match'];
  recommendation: Recommendation;
  overallSummary: string;
  mentorName?: string;
  studentName?: string;
}

const recommendationConfig = {
  highly_recommended: {
    label: '强烈推荐',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    icon: FiCheckCircle,
    description: '该导师与您的背景高度匹配，建议立即联系',
  },
  caution: {
    label: '谨慎联系',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200',
    icon: FiAlertTriangle,
    description: '存在一定匹配度，但需注意潜在风险',
  },
  not_recommended: {
    label: '不建议',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    icon: FiXCircle,
    description: '匹配度较低或存在较大风险，建议寻找其他导师',
  },
};

const matchLevelConfig = {
  high: { label: '高匹配', color: 'text-green-600', bgColor: 'bg-green-500' },
  medium: { label: '中匹配', color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
  low: { label: '低匹配', color: 'text-red-600', bgColor: 'bg-red-500' },
};

export default function SummaryCard({
  match,
  recommendation,
  overallSummary,
  mentorName,
  studentName,
}: SummaryCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const config = recommendationConfig[recommendation];
  const matchConfig = matchLevelConfig[match.matchLevel];
  const Icon = config.icon;

  const handleAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div
      className={`rounded-2xl border-2 ${config.bgColor} p-6 transition-all duration-500 ${
        isAnimating ? 'scale-105' : 'scale-100'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full bg-white shadow-sm ${config.color}`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{config.label}</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${matchConfig.color} ${matchConfig.bgColor} bg-opacity-10`}
              >
                {matchConfig.label}
              </span>
            </div>
            <p className="text-gray-600 max-w-xl">{config.description}</p>
            <p className="mt-2 text-sm text-gray-500">{overallSummary}</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(match.overallScore / 100) * 351.86} 351.86`}
                className={matchConfig.color}
                onAnimationEnd={handleAnimation}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${matchConfig.color}`}>
                {match.overallScore}
              </span>
              <span className="text-sm text-gray-500">匹配度</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FiTarget className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">匹配点</p>
              <p className="font-semibold text-gray-900">{match.matchPoints.length} 项</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FiTrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">差距点</p>
              <p className="font-semibold text-gray-900">{match.gapPoints.length} 项</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiAward className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">导师</p>
              <p className="font-semibold text-gray-900 truncate">{mentorName || '未知名'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
