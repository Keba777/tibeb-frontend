import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { StudyTimer } from '../StudyTimer';

// Mock the useStudyTracker hook so we can control state
vi.mock('@/src/hooks/useStudyTracker', () => ({
  useStudyTracker: vi.fn(),
}));

import { useStudyTracker } from '@/src/hooks/useStudyTracker';

const mockUseStudyTracker = vi.mocked(useStudyTracker);

describe('StudyTimer', () => {
  const mockStop = vi.fn();
  const mockStart = vi.fn();
  const mockDismissBreak = vi.fn();

  beforeEach(() => {
    mockStop.mockReset();
    mockStart.mockReset();
    mockDismissBreak.mockReset();
  });

  it('shows start button when not running and subjectId provided', () => {
    mockUseStudyTracker.mockReturnValue({
      isRunning: false,
      elapsed: 0,
      showBreakPrompt: false,
      subjectId: null,
      start: mockStart,
      stop: mockStop,
      dismissBreak: mockDismissBreak,
    });

    render(<StudyTimer subjectId="subject-1" />);
    expect(screen.getByLabelText('Start study session')).toBeTruthy();
  });

  it('shows timer bar when running', () => {
    mockUseStudyTracker.mockReturnValue({
      isRunning: true,
      elapsed: 125,
      showBreakPrompt: false,
      subjectId: 'subject-1',
      start: mockStart,
      stop: mockStop,
      dismissBreak: mockDismissBreak,
    });

    render(<StudyTimer subjectId="subject-1" />);
    // 125 seconds = 02:05
    expect(screen.getByText('02:05')).toBeTruthy();
    expect(screen.getByLabelText('Stop study session')).toBeTruthy();
  });

  it('calls stop when stop button clicked', () => {
    mockUseStudyTracker.mockReturnValue({
      isRunning: true,
      elapsed: 300,
      showBreakPrompt: false,
      subjectId: 'subject-1',
      start: mockStart,
      stop: mockStop,
      dismissBreak: mockDismissBreak,
    });

    render(<StudyTimer subjectId="subject-1" />);
    fireEvent.click(screen.getByLabelText('Stop study session'));
    expect(mockStop).toHaveBeenCalledOnce();
  });

  it('shows 25-minute break prompt when showBreakPrompt is true', () => {
    mockUseStudyTracker.mockReturnValue({
      isRunning: true,
      elapsed: 1500,
      showBreakPrompt: true,
      subjectId: 'subject-1',
      start: mockStart,
      stop: mockStop,
      dismissBreak: mockDismissBreak,
    });

    render(<StudyTimer subjectId="subject-1" />);
    expect(screen.getByText('Time for a break!')).toBeTruthy();
    expect(screen.getByText('Keep Going')).toBeTruthy();
  });

  it('calls dismissBreak when "Keep Going" clicked', () => {
    mockUseStudyTracker.mockReturnValue({
      isRunning: true,
      elapsed: 1500,
      showBreakPrompt: true,
      subjectId: 'subject-1',
      start: mockStart,
      stop: mockStop,
      dismissBreak: mockDismissBreak,
    });

    render(<StudyTimer subjectId="subject-1" />);
    fireEvent.click(screen.getByText('Keep Going'));
    expect(mockDismissBreak).toHaveBeenCalledOnce();
  });
});
