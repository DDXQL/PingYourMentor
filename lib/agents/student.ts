// =============================================================================
// Student Analysis Agent
// =============================================================================
// 分析学生简历，提取关键特征用于后续匹配

import { createChatCompletion } from './openai';
import type { StudentAnalysis } from '@/types';

const STUDENT_SYSTEM_PROMPT = `You are an expert at analyzing student profiles and resumes. Your task is to extract and analyze comprehensive information about a student based on their resume/CV text.

Analyze the student's:
1. Academic background (degree, major, institution, GPA)
2. Research experience (projects, publications, skills)
3. Technical and soft skills
4. Career goals
5. Motivation for applying
6. Unique strengths and differentiators

Output a JSON object with the following structure:
{
  "raw": "Original text summary (max 200 chars)",
  "summary": "Brief summary of the student profile (max 100 chars)",
  "name": "Student's name if mentioned",
  "academicBackground": {
    "degree": "Current highest degree or expected degree",
    "major": "Major or field of study",
    "institution": "Current institution name",
    "gpa": "GPA if mentioned (e.g., '3.8/4.0')",
    "relevantCourses": ["Course 1", "Course 2", "..."]
  },
  "researchExperience": [
    {
      "title": "Research project title",
      "lab": "Lab or research group name if mentioned",
      "duration": "Duration (e.g., '2 years')",
      "publications": ["Publication 1", "..."] or [],
      "skills": ["Skill 1", "Skill 2", "..."]
    }
  ],
  "skillSet": {
    "technical": ["Technical skill 1", "..."],
    "soft": ["Soft skill 1", "..."],
    "languages": ["Language 1", "..."]
  },
  "careerGoals": "Brief description of career aspirations",
  "motivation": "Motivation for applying to this program/mentor",
  "uniqueStrengths": ["Unique strength 1", "..."]
}

Be honest and objective in your assessment. If certain information is not available, indicate "Not specified" or use empty arrays.`;

const STUDENT_USER_PROMPT = `Analyze the following student resume/CV and extract structured data:

---
{RESUME_TEXT}
---

Return ONLY the JSON object, no additional text.`;

export async function studentAnalysis(resumeText: string): Promise<StudentAnalysis> {
  const messages: import('openai').Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: STUDENT_SYSTEM_PROMPT },
    { role: 'user', content: STUDENT_USER_PROMPT.replace('{RESUME_TEXT}', resumeText) },
  ];

  const response = await createChatCompletion(messages, { type: 'json_object' });

  if (!response) {
    throw new Error('Failed to analyze student profile');
  }

  try {
    const parsed = JSON.parse(response);
    return {
      raw: parsed.raw || resumeText.slice(0, 200),
      summary: parsed.summary || 'Student profile analysis completed',
      name: parsed.name,
      academicBackground: parsed.academicBackground || {
        degree: 'Not specified',
        major: 'Not specified',
        institution: 'Not specified',
        gpa: undefined,
        relevantCourses: [],
      },
      researchExperience: parsed.researchExperience || [],
      skillSet: parsed.skillSet || {
        technical: [],
        soft: [],
        languages: [],
      },
      careerGoals: parsed.careerGoals || 'Not specified',
      motivation: parsed.motivation || 'Not specified',
      uniqueStrengths: parsed.uniqueStrengths || [],
    };
  } catch (error) {
    console.error('Failed to parse student analysis:', error);
    throw new Error('Failed to parse student analysis result');
  }
}
