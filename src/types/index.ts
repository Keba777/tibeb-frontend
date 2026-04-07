// =============================================================================
// Tibeb Platform — TypeScript Domain Types
// =============================================================================

export interface User {
  id: string;
  email: string;
  displayName: string;
  grade: number;
  languagePref: 'en' | 'am';
}

export interface Subject {
  id: string;
  nameEn: string;
  nameAm: string;
  grade: number;
}

export interface Textbook {
  id: string;
  subjectId: string;
  title: string;
  grade: number;
  fileUrl: string;
}

export interface TextbookBookmark {
  id: string;
  textbookId: string;
  pageNumber: number;
  isLastRead: boolean;
}

export interface Note {
  id: string;
  subjectId: string;
  textbookId?: string;
  pageRef?: number;
  title: string;
  content: object; // Tiptap JSON document
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
}

export interface SubjectStudyTotal {
  subjectId: string;
  totalSeconds: number;
}

export interface StudyStats {
  period: string;
  totals: SubjectStudyTotal[];
}

export interface StreakData {
  streak: number;
}

export interface ExamQuestion {
  id: string;
  subjectId: string;
  grade: number;
  year?: number;
  questionText: string;
  questionType: 'multiple_choice' | 'short_answer';
  choices?: string[];
  isAiGenerated: boolean;
}

export interface AnswerResult {
  id: string;
  questionId: string;
  submittedAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
}

export interface SubjectExamScore {
  subjectId: string;
  totalAnswers: number;
  correctAnswers: number;
  scorePercent: number;
}

export interface FlashCard {
  prompt: string;
  answer: string;
  status?: 'new' | 'known' | 'needs_review';
}

export interface AiSummary {
  id: string;
  summary: string;
  cached: boolean;
}

export interface AiFlashcards {
  id: string;
  cards: FlashCard[];
  cached: boolean;
}

export interface AiQuestions {
  id: string;
  questions: GeneratedQuestion[];
  cached: boolean;
}

export interface GeneratedQuestion {
  questionText: string;
  questionType: 'multiple_choice' | 'short_answer';
  choices?: string[];
  correctAnswer: string;
}

export interface DashboardData {
  weeklyStudyBySubject: Record<string, number>;
  streak: number;
  avgExamScores: Record<string, number>;
  recentTextbooks: Textbook[];
  recentNotes: Note[];
  subjectProgress: Record<string, { sessions: number; goal: number }>;
}

// API response wrappers
export interface ApiError {
  error: string;
  message: string;
}
