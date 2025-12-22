/**
 * Tests for useDebounce hook
 *
 * @module __tests__/useDebounce.test
 */

import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 500 });

    // Value should not update immediately
    expect(result.current).toBe('initial');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should now be updated
    expect(result.current).toBe('updated');
  });

  it('should cancel previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'change1' });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    rerender({ value: 'change2' });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // After 600ms total, but only 300ms since last change
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Now 500ms since last change
    expect(result.current).toBe('change2');
  });

  it('should work with different delay values', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 1000 },
    });

    rerender({ value: 'updated', delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(999);
    });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('updated');
  });

  it('should handle different value types', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: { count: 0 } },
    });

    const newValue = { count: 5 };
    rerender({ value: newValue });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toEqual({ count: 5 });
  });

  it('should cleanup timeout on unmount', () => {
    const { unmount } = renderHook(() => useDebounce('value', 500));

    unmount();

    // Should not throw or cause issues
    act(() => {
      jest.advanceTimersByTime(500);
    });
  });
});
