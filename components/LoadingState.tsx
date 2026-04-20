'use client';

import { FiLoader } from 'react-icons/fi';

interface LoadingStateProps {
  currentStep: number;
  stepNames: string[];
}

const steps = [
  { icon: '👤', label: '分析导师' },
  { icon: '🎓', label: '分析学生' },
  { icon: '🔗', label: '评估匹配' },
  { icon: '⚠️', label: '识别风险' },
  { icon: '📋', label: '制定策略' },
  { icon: '✉️', label: '生成邮件' },
];

export default function LoadingState({ currentStep = 0 }: LoadingStateProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div
            className="absolute inset-0 border-4 border-primary-600 rounded-full"
            style={{
              animation: 'spin 1.5s linear infinite',
              borderTopColor: 'transparent',
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiLoader className="w-10 h-10 text-primary-600 animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">正在分析中...</h2>
        <p className="text-gray-500">AI 正在深入分析，请稍候</p>
      </div>

      <div className="w-full max-w-md space-y-3">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                isCompleted
                  ? 'bg-green-50'
                  : isCurrent
                  ? 'bg-primary-50 border border-primary-200'
                  : 'bg-gray-50'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                  isCompleted
                    ? 'bg-green-100'
                    : isCurrent
                    ? 'bg-primary-100'
                    : 'bg-gray-200'
                }`}
              >
                {isCompleted ? (
                  <span className="text-green-600">✓</span>
                ) : isCurrent ? (
                  <span className="animate-pulse">{step.icon}</span>
                ) : (
                  <span className="text-gray-400">{step.icon}</span>
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  isCompleted
                    ? 'text-green-700'
                    : isCurrent
                    ? 'text-primary-700'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
              {isCurrent && (
                <div className="ml-auto">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-sm text-gray-400">
        通常需要 30-60 秒，请不要关闭页面
      </p>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
