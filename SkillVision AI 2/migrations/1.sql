
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  name TEXT,
  age INTEGER,
  education_level TEXT,
  current_interests TEXT,
  vision_2030_preference TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER,
  question_id TEXT,
  response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skill_recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER,
  skill_name TEXT,
  skill_category TEXT,
  vision_2030_pillar TEXT,
  confidence_score REAL,
  description TEXT,
  learning_path TEXT,
  projects TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learning_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER,
  skill_id INTEGER,
  progress_percentage REAL,
  completed_projects TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_quiz_responses_student_id ON quiz_responses(student_id);
CREATE INDEX idx_skill_recommendations_student_id ON skill_recommendations(student_id);
CREATE INDEX idx_learning_progress_student_id ON learning_progress(student_id);
