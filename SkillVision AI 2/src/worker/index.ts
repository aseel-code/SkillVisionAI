import { Hono } from "hono";
import { cors } from "hono/cors";
import OpenAI from "openai";
import {
  authMiddleware,
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import {
  CreateStudentSchema,
  QuizSubmissionSchema,
  StudentType,
} from "../shared/types";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// Health check
app.get("/", (c) => {
  return c.json({ message: "SkillVision AI API is running" });
});

// Authentication routes
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Student profile routes
app.post("/api/students", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }
    const body = await c.req.json();
    const studentData = CreateStudentSchema.parse(body);

    const result = await c.env.DB.prepare(`
      INSERT INTO students (user_id, name, age, education_level, current_interests, vision_2030_preference, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `)
      .bind(
        user.id,
        studentData.name,
        studentData.age,
        studentData.education_level,
        studentData.current_interests,
        studentData.vision_2030_preference
      )
      .run();

    return c.json({ id: result.meta.last_row_id }, 201);
  } catch (error) {
    console.error("Error creating student:", error);
    return c.json({ error: "Failed to create student profile" }, 500);
  }
});

app.get("/api/students/me", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM students WHERE user_id = ? ORDER BY created_at DESC LIMIT 1
    `)
      .bind(user.id)
      .all();

    if (results.length === 0) {
      return c.json({ student: null });
    }

    return c.json({ student: results[0] });
  } catch (error) {
    console.error("Error fetching student:", error);
    return c.json({ error: "Failed to fetch student profile" }, 500);
  }
});

// Quiz routes
app.post("/api/quiz/submit", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }
    const body = await c.req.json();
    const quizData = QuizSubmissionSchema.parse(body);

    // Get student profile
    const { results: studentResults } = await c.env.DB.prepare(`
      SELECT * FROM students WHERE user_id = ? ORDER BY created_at DESC LIMIT 1
    `)
      .bind(user.id)
      .all();

    if (studentResults.length === 0) {
      return c.json({ error: "Student profile not found" }, 404);
    }

    const student = studentResults[0] as StudentType;

    // Save quiz responses
    for (const response of quizData.responses) {
      await c.env.DB.prepare(`
        INSERT INTO quiz_responses (student_id, question_id, response, created_at, updated_at)
        VALUES (?, ?, ?, datetime('now'), datetime('now'))
      `)
        .bind(student.id, response.question_id, response.response)
        .run();
    }

    // Generate AI skill recommendations
    const openai = new OpenAI({
      apiKey: c.env.OPENAI_API_KEY,
    });

    const prompt = `
      You are an expert educational advisor specializing in Saudi Vision 2030 career guidance.
      
      Carefully analyze this Saudi student's profile and quiz responses. Your goal is to identify THE ONE future skill that best matches their strengths, interests, and Vision 2030 opportunities.
      
      Student Profile:
      - Name: ${student.name}
      - Age: ${student.age}
      - Education Level: ${student.education_level}
      - Current Interests: ${student.current_interests}
      - Vision 2030 Preference: ${student.vision_2030_preference}
      
      Quiz Responses:
      ${quizData.responses.map(r => `${r.question_id}: ${r.response}`).join('\n')}
      
      Task:
      1. CAREFULLY analyze all responses to understand the student's learning style, preferences, and aspirations
      2. Identify ONE future skill that is the absolute best match for this student
      3. Suggest ONE practical mini-project they can start immediately to learn this skill
      4. Create a personalized learning plan with at least 2 FREE online resources (YouTube channels, Coursera free courses, edX, Khan Academy, etc.)
      5. Explain how to get started in simple, actionable steps
      6. Connect this skill to ONE specific Saudi Vision 2030 pillar (Thriving Economy, Ambitious Nation, or Vibrant Society)
      
      Return a JSON object with this structure:
      {
        "skill": {
          "skill_name": "The specific skill name",
          "skill_category": "The category (Technology, Healthcare, Business, Creative, etc.)",
          "vision_2030_pillar": "ONE of: Thriving Economy, Ambitious Nation, or Vibrant Society",
          "confidence_score": 0.90,
          "description": "A compelling 2-3 sentence explanation of why this skill is the perfect match for this student's interests and strengths, based on their quiz responses",
          "mini_project": {
            "title": "A catchy project name",
            "description": "A detailed description of one practical mini-project (100-150 words) the student can start working on immediately. Make it exciting, achievable, and relevant to Saudi context.",
            "estimated_time": "e.g., 2-3 weeks",
            "difficulty": "Beginner/Intermediate/Advanced"
          },
          "learning_plan": {
            "how_to_start": "3-4 clear, actionable steps explaining exactly how a beginner should start learning this skill (50-80 words)",
            "free_resources": [
              {
                "title": "Resource name",
                "type": "YouTube Channel/Free Course/Tutorial Series",
                "provider": "Platform name",
                "url": "actual URL if available, or describe how to find it",
                "description": "Brief description of what this resource covers"
              },
              {
                "title": "Resource name",
                "type": "YouTube Channel/Free Course/Tutorial Series",
                "provider": "Platform name",
                "url": "actual URL if available, or describe how to find it",
                "description": "Brief description of what this resource covers"
              }
            ]
          },
          "vision_2030_connection": "A specific 2-3 sentence explanation of how this skill directly contributes to the chosen Vision 2030 pillar and Saudi Arabia's transformation goals. Mention specific initiatives or sectors."
        }
      }
      
      Important Guidelines:
      - Be specific and practical
      - Focus on FREE resources only
      - Make the mini-project achievable and exciting
      - Ensure the Vision 2030 connection is clear and specific
      - Write in an encouraging, motivational tone
      - Base your recommendation on actual patterns in the student's responses
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    const skill = result.skill;

    if (!skill) {
      return c.json({ error: "Failed to generate recommendation" }, 500);
    }

    // Format the learning path with resources
    const learningPath = `
HOW TO GET STARTED:
${skill.learning_plan.how_to_start}

FREE LEARNING RESOURCES:

${skill.learning_plan.free_resources.map((resource: any, index: number) => `
${index + 1}. ${resource.title} (${resource.type})
   Provider: ${resource.provider}
   ${resource.url ? `URL: ${resource.url}` : `Find it by: ${resource.description}`}
   What you'll learn: ${resource.description}
`).join('\n')}

VISION 2030 CONNECTION:
${skill.vision_2030_connection}
    `.trim();

    // Format the mini-project
    const miniProject = `
MINI-PROJECT: ${skill.mini_project.title}

${skill.mini_project.description}

Estimated Time: ${skill.mini_project.estimated_time}
Difficulty Level: ${skill.mini_project.difficulty}
    `.trim();

    // Save recommendation to database
    const dbResult = await c.env.DB.prepare(`
      INSERT INTO skill_recommendations (
        student_id, skill_name, skill_category, vision_2030_pillar,
        confidence_score, description, learning_path, projects,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `)
      .bind(
        student.id,
        skill.skill_name,
        skill.skill_category,
        skill.vision_2030_pillar,
        skill.confidence_score,
        skill.description,
        learningPath,
        miniProject
      )
      .run();

    const savedRecommendation = {
      id: dbResult.meta.last_row_id,
      student_id: student.id,
      skill_name: skill.skill_name,
      skill_category: skill.skill_category,
      vision_2030_pillar: skill.vision_2030_pillar,
      confidence_score: skill.confidence_score,
      description: skill.description,
      learning_path: learningPath,
      projects: miniProject,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return c.json({ recommendations: [savedRecommendation] });
  } catch (error) {
    console.error("Error processing quiz:", error);
    return c.json({ error: "Failed to process quiz submission" }, 500);
  }
});

// Skill recommendations routes
app.get("/api/recommendations", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }
    
    // Get student profile
    const { results: studentResults } = await c.env.DB.prepare(`
      SELECT * FROM students WHERE user_id = ? ORDER BY created_at DESC LIMIT 1
    `)
      .bind(user.id)
      .all();

    if (studentResults.length === 0) {
      return c.json({ recommendations: [] });
    }

    const student = studentResults[0] as StudentType;

    // Get skill recommendations
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM skill_recommendations 
      WHERE student_id = ? 
      ORDER BY confidence_score DESC, created_at DESC
    `)
      .bind(student.id)
      .all();

    return c.json({ recommendations: results });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return c.json({ error: "Failed to fetch recommendations" }, 500);
  }
});

// Learning progress routes
app.post("/api/progress", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }
    const { skill_id, progress_percentage, completed_projects, notes } = await c.req.json();

    // Get student profile
    const { results: studentResults } = await c.env.DB.prepare(`
      SELECT * FROM students WHERE user_id = ? ORDER BY created_at DESC LIMIT 1
    `)
      .bind(user.id)
      .all();

    if (studentResults.length === 0) {
      return c.json({ error: "Student profile not found" }, 404);
    }

    const student = studentResults[0] as StudentType;

    const result = await c.env.DB.prepare(`
      INSERT OR REPLACE INTO learning_progress (
        student_id, skill_id, progress_percentage, completed_projects, notes,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `)
      .bind(
        student.id,
        skill_id,
        progress_percentage,
        completed_projects || "",
        notes || ""
      )
      .run();

    return c.json({ id: result.meta.last_row_id });
  } catch (error) {
    console.error("Error updating progress:", error);
    return c.json({ error: "Failed to update progress" }, 500);
  }
});

export default app;
