'use client';

import { useState, useEffect } from 'react';
import { FiCopy, FiCheck, FiZap, FiRefreshCw } from 'react-icons/fi';
import type { EmailDraft } from '@/types';

interface EmailDraftPanelProps {
  email: EmailDraft;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export default function EmailDraftPanel({ email, onRegenerate, isRegenerating }: EmailDraftPanelProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'chinese' | 'english'>('chinese');
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState('');
  const [refineSuccess, setRefineSuccess] = useState(false);

  // 可编辑状态
  const [editedSubjectCN, setEditedSubjectCN] = useState(email.chineseEmail?.subject || '');
  const [editedBodyCN, setEditedBodyCN] = useState(email.chineseEmail?.body || '');
  const [editedSubjectEN, setEditedSubjectEN] = useState(email.subject || '');
  const [editedBodyEN, setEditedBodyEN] = useState(email.body || '');

  // 当 email prop 更新时同步状态
  useEffect(() => {
    setEditedSubjectCN(email.chineseEmail?.subject || '');
    setEditedBodyCN(email.chineseEmail?.body || '');
    setEditedSubjectEN(email.subject || '');
    setEditedBodyEN(email.body || '');
  }, [email]);

  const hasChinese = !!email.chineseEmail;
  const currentSubject = activeTab === 'chinese' ? editedSubjectCN : editedSubjectEN;
  const currentBody = activeTab === 'chinese' ? editedBodyCN : editedBodyEN;

  const handleCopy = async () => {
    const text = currentSubject
      ? `Subject: ${currentSubject}\n\n${currentBody}`
      : currentBody;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefine = async () => {
    setIsRefining(true);
    setRefineError('');
    setRefineSuccess(false);

    try {
      const emailContent = currentSubject
        ? `Subject: ${currentSubject}\n\n${currentBody}`
        : currentBody;

      const response = await fetch('/api/refine-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailContent }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const refined = data.data;
        if (refined.body) {
          if (activeTab === 'chinese') {
            setEditedBodyCN(refined.body);
            if (refined.subject) setEditedSubjectCN(refined.subject);
          } else {
            setEditedBodyEN(refined.body);
            if (refined.subject) setEditedSubjectEN(refined.subject);
          }
          setRefineSuccess(true);
          setTimeout(() => setRefineSuccess(false), 2000);
        }
      } else {
        setRefineError(data.error || '润色失败');
      }
    } catch (err) {
      console.error('Refine failed:', err);
      setRefineError('网络错误，请重试');
    } finally {
      setIsRefining(false);
    }
  };

  const hasContent = currentSubject || currentBody;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">邮件草稿</h2>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {isRegenerating ? (
                <>
                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <FiRefreshCw className="w-4 h-4" />
                  重新生成
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 语言切换标签 */}
      {hasChinese && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('chinese')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'chinese'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            中文邮件
          </button>
          <button
            onClick={() => setActiveTab('english')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'english'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            英文邮件
          </button>
        </div>
      )}

      {/* 操作按钮 */}
      {hasContent && (
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={handleCopy}
            disabled={copied}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              copied
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {copied ? (
              <>
                <FiCheck className="w-4 h-4" />
                已复制
              </>
            ) : (
              <>
                <FiCopy className="w-4 h-4" />
                复制邮件
              </>
            )}
          </button>
          <button
            onClick={handleRefine}
            disabled={isRefining || isRegenerating}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50 ${
              refineSuccess
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg'
            }`}
          >
            {isRefining ? (
              <>
                <FiZap className="w-4 h-4 animate-pulse" />
                润色中...
              </>
            ) : refineSuccess ? (
              <>
                <FiCheck className="w-4 h-4" />
                润色完成
              </>
            ) : (
              <>
                <FiZap className="w-4 h-4" />
                AI 润色
              </>
            )}
          </button>
        </div>
      )}

      {/* 状态提示 */}
      {refineError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          {refineError}
        </div>
      )}

      {/* 折叠按钮 */}
      {!expanded && hasContent && (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <span>📧</span> 展开邮件内容
        </button>
      )}

      {expanded && hasContent && (
        <div className="space-y-4">
          {/* 主题 */}
          {currentSubject && (
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">邮件主题</label>
              <input
                type="text"
                value={currentSubject}
                onChange={(e) => {
                  if (activeTab === 'chinese') {
                    setEditedSubjectCN(e.target.value);
                  } else {
                    setEditedSubjectEN(e.target.value);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="输入邮件主题..."
              />
            </div>
          )}

          {/* 正文 - textarea 可编辑 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs text-gray-500 font-medium">邮件正文</label>
              <span className="text-xs text-gray-400">
                {currentBody.length} 字符
              </span>
            </div>
            <textarea
              value={currentBody}
              onChange={(e) => {
                if (activeTab === 'chinese') {
                  setEditedBodyCN(e.target.value);
                } else {
                  setEditedBodyEN(e.target.value);
                }
              }}
              rows={14}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-700 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="在此编辑邮件内容..."
            />
          </div>

          <button
            onClick={() => setExpanded(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            收起内容
          </button>

          {/* 提示信息 */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-xs text-blue-700">
              💡 <strong>使用提示：</strong>可以直接编辑邮件内容，修改后点击"复制邮件"按钮复制到剪贴板
            </p>
          </div>
        </div>
      )}

      {!hasContent && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📧</span>
          </div>
          <p className="text-sm text-gray-400">暂无邮件内容</p>
        </div>
      )}
    </div>
  );
}
