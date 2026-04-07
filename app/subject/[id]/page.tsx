import { redirect } from 'next/navigation';

/**
 * Subject detail page — redirects to the subjects catalog.
 * Individual subject content (textbooks, notes) is accessed via the subjects page.
 */
export default function SubjectDetailPage() {
  redirect('/subjects');
}
