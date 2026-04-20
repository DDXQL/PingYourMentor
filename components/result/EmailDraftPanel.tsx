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

  const handleCopy = () => {
    const text = email.subject ? `${email.subject}\n\n${email.body}` : email.body;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasContent = email?.subject || email?.body;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">邮件草稿</h2>
        <div className="flex items-center gap-2">
          {hasContent && (
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {copied ? '已复制' : '复制'}
            </button>
          )}
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

      {/* 折叠按钮 */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          展开邮件内容
        </button>
      )}

      {expanded && hasContent && (
        <>
          <div className="bg-gray-50 rounded-xl p-4">
            {email.subject && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <span className="text-xs text-gray-500">主题</span>
                <p className="font-medium text-gray-900 mt-1">{email.subject}</p>
              </div>
            )}
            <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {email.body}
            </div>
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="text-sm text-gray-500 hover:text-gray-700 mt-3"
          >
            收起
          </button>
        </>
      )}

      {!hasContent && (
        <p className="text-sm text-gray-400">暂无邮件内容</p>
      )}
    </div>
  );
}
