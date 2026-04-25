import { cookies } from 'next/headers';
import { TextbookCard } from '@/src/components/TextbookCard';
import type { Subject, Textbook, Note } from '@/src/types';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:9000';

async function fetchSubject(id: string, cookieHeader: string): Promise<Subject | null> {
  try {
    const res = await fetch(`${API}/subjects/${id}`, {
      headers: { Cookie: cookieHeader },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchTextbooks(subjectId: string, cookieHeader: string): Promise<Textbook[]> {
  try {
    const res = await fetch(`${API}/textbooks?subject_id=${subjectId}`, {
      headers: { Cookie: cookieHeader },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function fetchNotes(subjectId: string, cookieHeader: string): Promise<Note[]> {
  try {
    // Note: The notes API usually returns all notes for the user, 
    // we might need to filter them or the API might support subject_id query.
    // For now, let's assume it returns notes and we might filter or just show recent.
    const res = await fetch(`${API}/notes`, {
      headers: { Cookie: cookieHeader },
    });
    if (!res.ok) return [];
    const allNotes: Note[] = await res.json();
    return allNotes.filter(n => n.subjectId === subjectId);
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SubjectDetailPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const [subject, textbooks, notes] = await Promise.all([
    fetchSubject(id, cookieHeader),
    fetchTextbooks(id, cookieHeader),
    fetchNotes(id, cookieHeader),
  ]);

  if (!subject) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Subject not found</h1>
        <Link href="/subjects" className="text-primary hover:underline">Back to catalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-10">
        <Link href="/subjects" className="inline-flex items-center text-sm font-bold text-primary mb-4 hover:underline gap-1 group">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
          Back to Subjects
        </Link>
        <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
          <div>
            <span className="inline-block bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full mb-2">
              Grade {subject.grade}
            </span>
            <h1 className="font-headline text-4xl font-extrabold text-primary">{subject.nameEn}</h1>
            <p className="ethiopic-text text-xl text-on-surface-variant mt-1">{subject.nameAm}</p>
          </div>
          <Link 
            href={`/notes?subjectId=${subject.id}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold hover:bg-primary-container hover:text-primary transition-all duration-300 shadow-lg shadow-primary/20"
          >
            Create Note
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Textbooks Section */}
        <div className="lg:col-span-2">
          <h2 className="font-headline text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            Textbooks
            <span className="text-sm font-normal text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md">
              {textbooks.length}
            </span>
          </h2>
          {textbooks.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border-2 border-dashed border-surface-container-high">
              <p className="text-on-surface-variant">No textbooks available for this subject yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {textbooks.map((tb) => (
                <TextbookCard key={tb.id} textbook={tb} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar / Notes Section */}
        <div>
          <h2 className="font-headline text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            My Notes
            <span className="text-sm font-normal text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md">
              {notes.length}
            </span>
          </h2>
          {notes.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-6 text-center border border-surface-container-high">
              <p className="text-sm text-on-surface-variant mb-4">You haven't taken any notes for this subject yet.</p>
              <Link 
                href={`/notes?subjectId=${subject.id}`}
                className="text-sm font-bold text-primary hover:underline"
              >
                Start your first note
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="block bg-surface-container-lowest p-4 rounded-xl border border-surface-container hover:border-primary/30 hover:bg-surface-container-low transition-all group"
                >
                  <h4 className="font-bold text-primary truncate group-hover:text-primary-container">{note.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
              <Link
                href="/notes"
                className="block text-center py-2 text-sm font-bold text-primary hover:underline"
              >
                View all notes
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
