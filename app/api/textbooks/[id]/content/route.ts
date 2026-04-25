import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:9000';

/**
 * Proxy route: GET /api/textbooks/[id]/content
 *
 * Fetches the PDF from the Rust backend, forwarding the user's
 * httpOnly JWT cookie so the backend can authenticate the request.
 * The PDF.js viewer talks to this same-origin endpoint instead of
 * the backend directly, bypassing the cookie-on-cross-origin problem.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const upstream = await fetch(`${API_BASE}/textbooks/${id}/content`, {
    headers: { Cookie: cookieHeader },
    // Don't cache PDFs; always fetch fresh
    cache: 'no-store',
  });

  if (!upstream.ok) {
    return new NextResponse(null, { status: upstream.status });
  }

  // Stream the body back to the browser
  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      // Allow PDF.js to read the response
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
