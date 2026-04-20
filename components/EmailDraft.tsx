'use client';

import { useState } from 'react';
import { FiMail, FiChevronDown, FiChevronUp, FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi';
import type { EmailDraft } from '@/types';

interface EmailDraftProps {
  email: EmailDraft;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export default function EmailDraftComponent({
  email,
  onRegenerate,
  isRegenerating = false,
}: EmailDraftProps) {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email.fullEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <FiMail className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">邮件草稿</h3>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
            {email.estimatedLength}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              copied
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
            {copied ? '已复制' : '复制邮件'}
          </button>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              重新生成
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">邮件主题</p>
            <p className="font-medium text-gray-900">{email.subject}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">邮件正文</p>
            <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              <p className="font-medium">{email.greeting}</p>
              {email.introduction && <p className="mt-2">{email.introduction}</p>}
              {email.body && <p className="mt-2">{email.body}</p>}
              {email.closing && <p className="mt-2">{email.closing}</p>}
            </div>
          </div>

          {email.keyPoints.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-blue-600 font-medium mb-2">邮件要点</p>
              <div className="flex flex-wrap gap-2">
                {email.keyPoints.map((point, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/50 text-blue-700 text-xs rounded-full"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setExpanded(false)}
            className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            收起详情
          </button>
        </div>
      )}

      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <FiChevronDown className="w-4 h-4" />
          展开详情
        </button>
      )}
    </div>
  );
}
