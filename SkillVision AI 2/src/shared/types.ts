import z from "zod";

// Student profile schema
export const StudentSchema = z.object({
  id: z.number(),
  user_id: z.string().optional(),
  name: z.string(),
  age: z.number(),
  education_level: z.string(),
  current_interests: z.string(),
  vision_2030_preference: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type StudentType = z.infer<typeof StudentSchema>;

// Quiz response schema
export const QuizResponseSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  question_id: z.string(),
  response: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type QuizResponseType = z.infer<typeof QuizResponseSchema>;

// Skill recommendation schema
export const SkillRecommendationSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  skill_name: z.string(),
  skill_category: z.string(),
  vision_2030_pillar: z.string(),
  confidence_score: z.number(),
  description: z.string(),
  learning_path: z.string(),
  projects: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type SkillRecommendationType = z.infer<typeof SkillRecommendationSchema>;

// Learning progress schema
export const LearningProgressSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  skill_id: z.number(),
  progress_percentage: z.number(),
  completed_projects: z.string(),
  notes: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type LearningProgressType = z.infer<typeof LearningProgressSchema>;

// API request/response schemas
export const CreateStudentSchema = z.object({
  name: z.string(),
  age: z.number(),
  education_level: z.string(),
  current_interests: z.string(),
  vision_2030_preference: z.string(),
});

export type CreateStudentType = z.infer<typeof CreateStudentSchema>;

export const QuizSubmissionSchema = z.object({
  responses: z.array(z.object({
    question_id: z.string(),
    response: z.string(),
  })),
});

export type QuizSubmissionType = z.infer<typeof QuizSubmissionSchema>;

export const SkillAnalysisSchema = z.object({
  student_id: z.number(),
  quiz_responses: z.array(z.object({
    question_id: z.string(),
    response: z.string(),
  })),
});

export type SkillAnalysisType = z.infer<typeof SkillAnalysisSchema>;
