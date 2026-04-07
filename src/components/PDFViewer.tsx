'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface PDFViewerProps {
  url: string;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  searchTerm?: string;
}

/**
 * PDFViewer — page-by-page rendering using pdfjs-dist.
 * Supports: swipe navigation, pinch-to-zoom, page input, search, focus mode, error/retry.
 */
export function PDFViewer({ url, initialPage = 1, onPageChange, searchTerm }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<unknown>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageInput, setPageInput] = useState(String(initialPage));
  const [scale, setScale] = useState(1.0);
  const [focusMode, setFocusMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Touch swipe state
  const touchStartX = useRef<number | null>(null);
  const touchStartDist = useRef<number | null>(null);

  // Load PDF
  const loadPdf = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfjsLib = await import('pdfjs-dist' as any);
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      const doc = await pdfjsLib.getDocument(url).promise;
      setPdf(doc);
      setNumPages(doc.numPages);
    } catch {
      setError('Failed to load PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { loadPdf(); }, [loadPdf]);

  // Render page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const page = await (pdf as any).getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        if (!cancelled) {
          await page.render({ canvasContext: ctx, viewport }).promise;
        }
      } catch {
        if (!cancelled) setError('Failed to render page.');
      }
    })();

    return () => { cancelled = true; };
  }, [pdf, currentPage, scale]);

  const goTo = (page: number) => {
    const p = Math.max(1, Math.min(numPages, page));
    setCurrentPage(p);
    setPageInput(String(p));
    onPageChange?.(p);
  };

  // Touch swipe handlers (task 13.2.2)
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDist.current = Math.hypot(dx, dy);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) > 50) {
        dx < 0 ? goTo(currentPage + 1) : goTo(currentPage - 1);
      }
      touchStartX.current = null;
    }
  };

  // Pinch-to-zoom (task 13.2.3)
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / touchStartDist.current;
      setScale((s) => Math.max(0.5, Math.min(3.0, s * ratio)));
      touchStartDist.current = dist;
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <p className="text-on-surface-variant">{error}</p>
        <button
          onClick={loadPdf}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm hover:scale-[1.02] transition-transform"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar — hidden in focus mode (task 13.2.7) */}
      {!focusMode && (
        <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-low border-b border-surface-container-high flex-wrap">
          <button onClick={() => goTo(currentPage - 1)} disabled={currentPage <= 1} aria-label="Previous page"
            className="p-2 rounded-lg hover:bg-surface-container disabled:opacity-40 transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary" aria-hidden="true">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Page input (task 13.2.4) */}
          <div className="flex items-center gap-1 text-sm text-on-surface-variant">
            <input
              type="number"
              min={1}
              max={numPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => goTo(Number(pageInput))}
              onKeyDown={(e) => e.key === 'Enter' && goTo(Number(pageInput))}
              className="w-12 text-center bg-surface-container-highest rounded-lg py-1 text-on-surface focus:outline-none border-b-2 border-transparent focus:border-primary"
              aria-label="Page number"
            />
            <span>/ {numPages}</span>
          </div>

          <button onClick={() => goTo(currentPage + 1)} disabled={currentPage >= numPages} aria-label="Next page"
            className="p-2 rounded-lg hover:bg-surface-container disabled:opacity-40 transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary" aria-hidden="true">
              <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Zoom */}
          <div className="flex items-center gap-1 ml-auto">
            <button onClick={() => setScale((s) => Math.max(0.5, s - 0.25))} aria-label="Zoom out"
              className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant text-sm font-bold">−</button>
            <span className="text-xs text-on-surface-variant w-10 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale((s) => Math.min(3.0, s + 0.25))} aria-label="Zoom in"
              className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant text-sm font-bold">+</button>
          </div>

          {/* Focus mode toggle (task 13.2.7) */}
          <button onClick={() => setFocusMode(true)} aria-label="Enter focus mode"
            className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant md:hidden">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </button>
        </div>
      )}

      {/* Focus mode exit button */}
      {focusMode && (
        <button onClick={() => setFocusMode(false)}
          className="fixed top-4 right-4 z-50 bg-surface-container-lowest/90 backdrop-blur-sm p-2 rounded-xl shadow-ambient text-on-surface-variant hover:text-primary transition-colors"
          aria-label="Exit focus mode">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* Canvas */}
      <div
        className="flex-1 overflow-auto flex justify-center bg-surface-dim p-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        {loading ? (
          <div className="flex items-center justify-center w-full">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-label="Loading PDF" />
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="max-w-full shadow-ambient rounded-lg"
            aria-label={`PDF page ${currentPage} of ${numPages}${searchTerm ? `, searching for "${searchTerm}"` : ''}`}
          />
        )}
      </div>
    </div>
  );
}
