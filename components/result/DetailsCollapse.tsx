'use client';

import { useState } from 'react';

interface ProfileData {
  mentor?: any;
  student?: any;
}

interface DetailsCollapseProps {
  profiles: ProfileData;
}

function ProfileSection({ title, data }: { title: string; data: any }) {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const entries = Object.entries(data).filter(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.length > 0;
    if (typeof value === 'number') return true;
    return value !== null && value !== undefined;
  });

  if (entries.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {entries.slice(0, 8).map(([key, value]) => (
          <div key={key} className="flex items-start gap-3">
            <span className="text-xs text-gray-400 w-24 flex-shrink-0 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="text-sm text-gray-700 flex-1">
              {Array.isArray(value) ? value.join(', ') : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DetailsCollapse({ profiles }: DetailsCollapseProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className="text-lg font-semibold text-gray-900">详细数据</h2>
        <span className="text-sm text-gray-500">
          {expanded ? '收起' : '展开'}
        </span>
      </button>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileSection title="导师画像" data={profiles.mentor} />
          <ProfileSection title="学生画像" data={profiles.student} />
        </div>
      )}
    </div>
  );
}
