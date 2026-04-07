export const en = {
  nav: { dashboard: 'Dashboard', subjects: 'Subjects', notes: 'Notes', exams: 'Exams', profile: 'Profile' },
  dashboard: { title: 'Dashboard', subtitle: 'Your learning overview for this week', streak: 'Study Streak', thisWeek: 'This Week', subjectProgress: 'Subject Progress', recentTextbooks: 'Recent Textbooks', recentNotes: 'Recent Notes', examScores: 'Exam Scores', onboarding: 'Start your first session', onboardingDesc: 'Open a textbook or start a study timer to begin tracking your progress.', browseSubjects: 'Browse Subjects' },
  subjects: { title: 'Subjects', subtitle: 'Browse the Ethiopian curriculum by grade', all: 'All', empty: 'No subjects found', emptyGrade: (g: number) => `No subjects available for Grade ${g} yet.` },
  notes: { title: 'Notes', selectSubject: 'Select a subject to view notes.', noNotes: 'No notes for this subject yet.', untitled: 'Untitled note' },
  exam: { title: 'Exam Practice', start: 'Start Practice', loading: 'Loading…', summary: 'Session Summary', correct: 'correct', newSession: 'New Session', noQuestions: 'No questions available for this subject and grade. Try another subject.' },
  flashcards: { title: 'Flashcards', generate: 'Generate', generating: 'Generating…', prompt: 'Prompt', answer: 'Answer', tapToReveal: 'Tap to reveal answer', known: 'Known ✓', needsReview: 'Needs Review' },
  ai: { title: 'Tibeb AI', companion: 'Your Study Companion', summary: 'Summary', flashcards: 'Flashcards', questions: 'Questions', generate: 'Generate', loading: 'Generating…', error: 'Something went wrong.', retry: 'Try again', empty: 'Open a textbook or note to generate AI content', ask: 'Ask Assistant' },
  profile: { title: 'Profile', language: 'Language', grade: 'Grade', logout: 'Sign Out', save: 'Save Changes', saved: 'Saved' },
  auth: { login: 'Sign In', register: 'Create Account', email: 'Email', password: 'Password', name: 'Full name', grade: 'Grade', noAccount: "Don't have an account?", hasAccount: 'Already have an account?' },
  timer: { start: 'Start Timer', stop: 'Stop', breakTitle: 'Time for a break!', breakDesc: "You've been studying for 25 minutes. Take a 5-minute break.", keepGoing: 'Keep Going' },
};

export type Translations = typeof en;
