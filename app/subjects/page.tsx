import { SubjectCatalog } from './SubjectCatalog';
import type { Subject } from '@/src/types';
import { cookies } from 'next/headers';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:9000';

async function fetchSubjects(cookieHeader: string): Promise<Subject[]> {
  try {
    const res = await fetch(`${API}/subjects`, {
      headers: { Cookie: cookieHeader },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function SubjectsPage() {
  const cookieStore = await cookies();
  const subjects = await fetchSubjects(cookieStore.toString());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center">
      <h1 className="font-headline text-3xl font-extrabold text-primary mb-2 text-center">Subjects</h1>
      <p className="text-on-surface-variant mb-8 text-center">Browse the Ethiopian curriculum by grade</p>
      <div className="w-full">
        <SubjectCatalog subjects={subjects} />
      </div>
    </div>
  );
}
