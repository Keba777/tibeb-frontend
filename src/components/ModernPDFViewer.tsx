'use client';

import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface ModernPDFViewerProps {
  /** The textbook ID. We build the proxy URL from this. */
  textbookId: string;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

export function ModernPDFViewer({ textbookId, initialPage = 1, onPageChange }: ModernPDFViewerProps) {
  // defaultLayoutPlugin uses hooks internally — MUST be called at top level directly.
  // We rely on parent-level stabilization (onPageChange) to prevent infinite loops.
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Use our Next.js same-origin proxy route so the browser cookie is sent
  const proxyUrl = `/api/textbooks/${textbookId}/content`;

  // pdfjs-dist 3.11.174 is the version compatible with @react-pdf-viewer/core 3.x
  const workerUrl = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

  return (
    <div className="h-full w-full bg-surface-dim overflow-hidden">
      <Worker workerUrl={workerUrl}>
        <Viewer
          fileUrl={proxyUrl}
          initialPage={initialPage - 1} // 0-indexed in react-pdf-viewer
          onPageChange={(e) => onPageChange?.(e.currentPage + 1)}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={SpecialZoomLevel.PageFit}
          theme="light"
        />
      </Worker>
    </div>
  );
}
