import type { Translations } from './en';

export const am: Translations = {
  nav: { dashboard: 'ዳሽቦርድ', subjects: 'ትምህርቶች', notes: 'ማስታወሻ', exams: 'ፈተና', profile: 'መገለጫ' },
  dashboard: { title: 'ዳሽቦርድ', subtitle: 'የዚህ ሳምንት የትምህርት ማጠቃለያ', streak: 'የጥናት ተከታታይ ቀናት', thisWeek: 'ይህ ሳምንት', subjectProgress: 'የትምህርት ሂደት', recentTextbooks: 'የቅርብ ጊዜ መጻሕፍት', recentNotes: 'የቅርብ ጊዜ ማስታወሻዎች', examScores: 'የፈተና ውጤቶች', onboarding: 'የመጀመሪያ ክፍለ ጊዜዎን ይጀምሩ', onboardingDesc: 'ሂደትዎን ለመከታተል መጽሐፍ ይክፈቱ ወይም ቆጣሪ ይጀምሩ።', browseSubjects: 'ትምህርቶችን ያስሱ' },
  subjects: { title: 'ትምህርቶች', subtitle: 'የኢትዮጵያ ሥርዓተ ትምህርት በክፍል', all: 'ሁሉም', empty: 'ምንም ትምህርቶች አልተገኙም', emptyGrade: (g: number) => `ለክፍል ${g} ምንም ትምህርቶች የሉም።` },
  notes: { title: 'ማስታወሻዎች', selectSubject: 'ማስታወሻዎችን ለማየት ትምህርት ይምረጡ።', noNotes: 'ለዚህ ትምህርት ምንም ማስታወሻዎች የሉም።', untitled: 'ስም-አልባ ማስታወሻ' },
  exam: { title: 'የፈተና ልምምድ', start: 'ልምምድ ጀምር', loading: 'በመጫን ላይ…', summary: 'የክፍለ ጊዜ ማጠቃለያ', correct: 'ትክክል', newSession: 'አዲስ ክፍለ ጊዜ', noQuestions: 'ለዚህ ትምህርት ምንም ጥያቄዎች የሉም። ሌላ ትምህርት ይሞክሩ።' },
  flashcards: { title: 'ፍላሽካርዶች', generate: 'ፍጠር', generating: 'በመፍጠር ላይ…', prompt: 'ጥያቄ', answer: 'መልስ', tapToReveal: 'መልሱን ለማሳየት ይጫኑ', known: 'ታወቀ ✓', needsReview: 'ክለሳ ያስፈልጋል' },
  ai: { title: 'ጥበብ AI', companion: 'የጥናት ረዳትዎ', summary: 'ማጠቃለያ', flashcards: 'ፍላሽካርዶች', questions: 'ጥያቄዎች', generate: 'ፍጠር', loading: 'በመፍጠር ላይ…', error: 'ችግር ተፈጥሯል።', retry: 'እንደገና ሞክር', empty: 'AI ይዘት ለመፍጠር መጽሐፍ ወይም ማስታወሻ ይክፈቱ', ask: 'ረዳቱን ጠይቅ' },
  profile: { title: 'መገለጫ', language: 'ቋንቋ', grade: 'ክፍል', logout: 'ውጣ', save: 'ለውጦችን አስቀምጥ', saved: 'ተቀምጧል' },
  auth: { login: 'ግባ', register: 'መለያ ፍጠር', email: 'ኢሜይል', password: 'የይለፍ ቃል', name: 'ሙሉ ስም', grade: 'ክፍል', noAccount: 'መለያ የለዎትም?', hasAccount: 'መለያ አለዎት?' },
  timer: { start: 'ቆጣሪ ጀምር', stop: 'አቁም', breakTitle: 'ለዕረፍት ጊዜ ነው!', breakDesc: 'ለ25 ደቂቃ ሲያጠኑ ቆዩ። 5 ደቂቃ ያርፉ።', keepGoing: 'ቀጥሉ' },
};
