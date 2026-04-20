'use client';

import { useState } from 'react';
import { FiUser, FiChevronDown, FiChevronUp, FiBook, FiAward, FiBriefcase } from 'react-icons/fi';
import type { AnalysisResult } from '@/types';

interface DetailsCollapseProps {
  mentor: AnalysisResult['mentor'];
  student: AnalysisResult['student'];
}

function MentorDetails({ mentor }: { mentor: AnalysisResult['mentor'] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">机构</p>
          <p className="font-medium text-gray-900">{mentor.institution}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">职称</p>
          <p className="font-medium text-gray-900">{mentor.title}</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2">研究方向</p>
        <div className="space-y-2">
          {mentor.researchFocus.map((focus, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{focus.area}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {focus.keywords.map((kw, kwIndex) => (
                  <span
                    key={kwIndex}
                    className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2">指导风格</p>
        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
          <p className="text-sm">
            <span className="text-gray-500">沟通方式: </span>
            {mentor.mentorStyle.communication}
          </p>
          <p className="text-sm">
            <span className="text-gray-500">指导风格: </span>
            {mentor.mentorStyle.supervision}
          </p>
          <p className="text-sm">
            <span className="text-gray-500">合作方式: </span>
            {mentor.mentorStyle.collaboration}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">经费情况</p>
          <p className="font-medium text-gray-900">
            {mentor.funding.hasFunding ? '有经费' : '未明确'}
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">实验室规模</p>
          <p className="font-medium text-gray-900">{mentor.labInfo.size}</p>
        </div>
      </div>

      {mentor.greenFlags.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">✓ 积极信号</p>
          <ul className="space-y-1">
            {mentor.greenFlags.map((flag, index) => (
              <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mentor.redFlags.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">⚠️ 警示信号</p>
          <ul className="space-y-1">
            {mentor.redFlags.map((flag, index) => (
              <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                <span className="mt-0.5">⚠</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StudentDetails({ student }: { student: AnalysisResult['student'] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">当前学历</p>
          <p className="font-medium text-gray-900">{student.academicBackground.degree}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">专业</p>
          <p className="font-medium text-gray-900">{student.academicBackground.major}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">就读学校</p>
          <p className="font-medium text-gray-900">{student.academicBackground.institution}</p>
        </div>
        {student.academicBackground.gpa && (
          <div>
            <p className="text-xs text-gray-500">GPA</p>
            <p className="font-medium text-gray-900">{student.academicBackground.gpa}</p>
          </div>
        )}
      </div>

      {student.academicBackground.relevantCourses.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">相关课程</p>
          <div className="flex flex-wrap gap-1">
            {student.academicBackground.relevantCourses.map((course, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {course}
              </span>
            ))}
          </div>
        </div>
      )}

      {student.researchExperience.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">研究经历</p>
          <div className="space-y-2">
            {student.researchExperience.map((exp, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{exp.title}</p>
                {exp.lab && <p className="text-sm text-gray-600">{exp.lab}</p>}
                <p className="text-sm text-gray-500">{exp.duration}</p>
                {exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {exp.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs text-gray-500 mb-2">技能</p>
        <div className="space-y-2">
          {student.skillSet.technical.length > 0 && (
            <div>
              <p className="text-xs text-gray-500">技术技能</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {student.skillSet.technical.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {student.skillSet.soft.length > 0 && (
            <div>
              <p className="text-xs text-gray-500">软技能</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {student.skillSet.soft.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {student.uniqueStrengths.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">独特优势</p>
          <ul className="space-y-1">
            {student.uniqueStrengths.map((strength, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="mt-0.5">✦</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 mb-1">职业目标</p>
        <p className="text-sm text-gray-700">{student.careerGoals}</p>
      </div>

      {student.motivation && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">申请动机</p>
          <p className="text-sm text-gray-700">{student.motivation}</p>
        </div>
      )}
    </div>
  );
}

export default function DetailsCollapse({ mentor, student }: DetailsCollapseProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'mentor' | 'student'>('mentor');

  if (!expanded) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setExpanded(true)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FiUser className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">详细信息</h3>
          </div>
          <FiChevronDown className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FiUser className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">详细信息</h3>
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiChevronUp className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="px-6 pt-4">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('mentor')}
            className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
              activeTab === 'mentor'
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FiBook className="w-4 h-4" />
              导师画像
            </div>
            {activeTab === 'mentor' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
              activeTab === 'student'
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FiAward className="w-4 h-4" />
              学生画像
            </div>
            {activeTab === 'student' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'mentor' ? (
          <MentorDetails mentor={mentor} />
        ) : (
          <StudentDetails student={student} />
        )}
      </div>
    </div>
  );
}
