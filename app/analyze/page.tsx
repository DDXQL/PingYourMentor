'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiTarget, FiMail, FiCheck, FiLoader } from 'react-icons/fi';

interface AnalyzePageProps {
  mentorText: string;
  resumeText: string;
}

type Step = 'idle' | 'profile' | 'decision' | 'email' | 'complete' | 'error';

interface StepInfo {
  key: Step;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const STEPS: StepInfo[] = [
  {
    key: 'profile',
    label: '解析导师信息',
    icon: <FiUser className="w-5 h-5" />,
    description: '正在分析导师的研究方向、要求和风格...',
  },
  {
    key: 'decision',
    label: '分析匹配度',
    icon: <FiTarget className="w-5 h-5" />,
    description: '正在评估您与导师的匹配程度...',
  },
  {
    key: 'email',
    label: '生成邮件',
    icon: <FiMail className="w-5 h-5" />,
    description: '正在为您量身定制套磁邮件...',
  },
];

export default function AnalyzePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    // 从 sessionStorage 获取数据
    const storedMentorText = sessionStorage.getItem('mentorText');
    const storedResumeText = sessionStorage.getItem('resumeText');
    const storedResult = sessionStorage.getItem('analysisResult');

    if (!storedMentorText || !storedResumeText) {
      router.push('/');
      return;
    }

    // 如果已有结果，直接跳转
    if (storedResult) {
      router.push('/result');
      return;
    }

    // 开始分析
    startAnalysis(storedMentorText, storedResumeText);
  }, [router]);

  const startAnalysis = async (mentorText: string, resumeText: string) => {
    setStep('profile');
    setProgress(10);

    try {
      // Step 1: 调用分析 API
      setProgress(20);
      setStep('profile');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentorText, resumeText }),
      });

      setProgress(70);
      setStep('decision');

      const data = await response.json();

      setProgress(85);
      setStep('email');

      if (!response.ok || !data.success) {
        throw new Error(data.error || '分析失败');
      }

      // 保存结果
      sessionStorage.setItem('analysisResult', JSON.stringify(data.data));
      sessionStorage.setItem('mentorText', mentorText);
      sessionStorage.setItem('resumeText', resumeText);

      setProgress(100);
      setStep('complete');

      // 短暂延迟显示完成状态
      await new Promise(resolve => setTimeout(resolve, 500));

      // 跳转到结果页
      if (data.resultId) {
        router.push(`/result?id=${data.resultId}`);
      } else {
        router.push('/result');
      }
    } catch (err) {
      console.error('[Analyze] Error:', err);
      setStep('error');
      setError(err instanceof Error ? err.message : '分析失败，请重试');
    }
  };

  const getCurrentStepIndex = () => {
    const stepOrder: Step[] = ['profile', 'decision', 'email', 'complete'];
    return stepOrder.indexOf(step);
  };

  const handleRetry = () => {
    const mentorText = sessionStorage.getItem('mentorText') || '';
    const resumeText = sessionStorage.getItem('resumeText') || '';
    setError('');
    setStep('idle');
    setProgress(0);
    startAnalysis(mentorText, resumeText);
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-3xl">🎯</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">正在分析中</h1>
          <p className="text-gray-500 mt-2">预计时间 15-30 秒</p>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>分析进度</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          {step !== 'error' && (
            <div className="space-y-4">
              {STEPS.map((stepInfo, index) => {
                const isComplete = index < getCurrentStepIndex();
                const isActive = stepInfo.key === step;
                const isPending = index > getCurrentStepIndex();

                return (
                  <div
                    key={stepInfo.key}
                    className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                      isActive ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isComplete
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isComplete ? (
                        <FiCheck className="w-5 h-5" />
                      ) : isActive ? (
                        <FiLoader className="w-5 h-5 animate-spin" />
                      ) : (
                        stepInfo.icon
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          isActive ? 'text-blue-900' : isComplete ? 'text-green-700' : 'text-gray-400'
                        }`}
                      >
                        {stepInfo.label}
                        {isActive && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        )}
                      </h3>
                      <p
                        className={`text-sm mt-1 ${
                          isActive ? 'text-blue-600' : isComplete ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {stepInfo.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Complete State */}
          {step === 'complete' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                  <FiCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">分析完成</h3>
                  <p className="text-sm text-green-600">正在跳转到结果页面...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {step === 'error' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <span className="text-lg">✕</span>
                </div>
                <div>
                  <h3 className="font-medium text-red-800">分析失败</h3>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRetry}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                >
                  重试
                </button>
                <button
                  onClick={handleBack}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  返回
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-sm text-blue-700 text-center">
            💡 请保持此页面不要关闭，分析完成后将自动跳转
          </p>
        </div>
      </div>
    </div>
  );
}
