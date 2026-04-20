'use client';

import { useState } from 'react';
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

  // 可编辑状态
  const [editedSubjectCN, setEditedSubjectCN] = useState(email.chineseEmail?.subject || '');
  const [editedBodyCN, setEditedBodyCN] = useState(email.chineseEmail?.body || '');
  const [editedSubjectEN, setEditedSubjectEN] = useState(email.subject || '');
  const [editedBodyEN, setEditedBodyEN] = useState(email.body || '');

  const hasChinese = !!email.chineseEmail;
  const currentSubject = activeTab === 'chinese' ? editedSubjectCN : editedSubjectEN;
  const currentBody = activeTab === 'chinese' ? editedBodyCN : editedBodyEN;

  const handleCopy = () => {
    const text = currentSubject ? `${currentSubject}\n\n${currentBody}` : currentBody;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefine = async () => {
    setIsRefining(true);
    setRefineError('');

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
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">邮件草稿</h2>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {isRegenerating ? '生成中...' : '重新生成'}
            </button>
          )}
        </div>
      </div>

      {/* 语言切换标签 */}
      {hasChinese && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('chinese')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'chinese'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📧 中文邮件
          </button>
          <button
            onClick={() => setActiveTab('english')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'english'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📧 英文邮件
          </button>
        </div>
      )}

      {/* 操作按钮 */}
      {hasContent && (
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {copied ? '✓ 已复制' : '📋 复制'}
          </button>
          <button
            onClick={handleRefine}
            disabled={isRefining}
            className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors disabled:opacity-50"
          >
            {isRefining ? '✨ 润色中...' : '✨ AI润色'}
          </button>
        </div>
      )}

      {/* 润色错误提示 */}
      {refineError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {refineError}
        </div>
      )}

      {/* 折叠按钮 */}
      {!expanded && hasContent && (
        <button
          onClick={() => setExpanded(true)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          展开邮件内容
        </button>
      )}

      {expanded && hasContent && (
        <>
          {/* 主题 */}
          {currentSubject && (
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">主题</label>
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="邮件主题..."
              />
            </div>
          )}

          {/* 正文 - textarea 可编辑 */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">正文</label>
            <textarea
              value={currentBody}
              onChange={(e) => {
                if (activeTab === 'chinese') {
                  setEditedBodyCN(e.target.value);
                } else {
                  setEditedBodyEN(e.target.value);
                }
              }}
              rows={12}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="邮件内容..."
            />
          </div>

          <button
            onClick={() => setExpanded(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            收起
          </button>
        </>
      )}

      {!hasContent && (
        <p className="text-sm text-gray-400">暂无邮件内容</p>
      )}

      {/* 提示信息 */}
      {hasContent && (
        <p className="text-xs text-gray-400 mt-4">
          💡 可以直接编辑内容，修改后点击"复制"按钮使用
        </p>
      )}
    </div>
  );
}
