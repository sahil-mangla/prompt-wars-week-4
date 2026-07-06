import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FanPage from '../../app/fan/page';
import { syncStore } from '../../lib/firebase';

// Mock the firebase syncStore
jest.mock('../../lib/firebase', () => ({
  syncStore: {
    subscribeState: jest.fn(),
    updateState: jest.fn(),
  },
}));

describe('Fan Companion App (Frontend)', () => {
  let mockState;
  let mockSubscribeCallback;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    mockState = {
      simulationStatus: 'idle',
      activeIncidents: [],
      volunteers: [],
      operatorLog: [],
      timeRemaining: 120,
    };

    // Capture the callback passed to subscribeState
    syncStore.subscribeState.mockImplementation((callback) => {
      mockSubscribeCallback = callback;
      // Immediately call with initial mock state
      callback(mockState);
      return jest.fn(); // Unsubscribe mock function
    });
  });

  test('renders loading state initially if no state is provided', () => {
    syncStore.subscribeState.mockImplementation(() => jest.fn());
    render(<FanPage />);
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  test('renders the fan app header and toggles language correctly', () => {
    render(<FanPage />);
    
    // Default language is Arabic
    expect(screen.getByText('بطاقة المشجع الرقمية')).toBeInTheDocument();
    
    // Toggle language
    const langBtn = screen.getByRole('button', { name: /Switch to English/i });
    fireEvent.click(langBtn);
    
    // Now it should be English
    expect(screen.getByText('Digital Fan Ticket & Guide')).toBeInTheDocument();
    expect(screen.getByText('Welcome, Yusuf')).toBeInTheDocument();
  });

  test('toggles accessibility mode correctly', () => {
    render(<FanPage />);
    
    const a11yToggle = screen.getByRole('switch', { name: /مسار ذوي الهمم/i });
    expect(a11yToggle).toHaveAttribute('aria-checked', 'true'); // default is true
    
    fireEvent.click(a11yToggle);
    expect(a11yToggle).toHaveAttribute('aria-checked', 'false');
  });

  test('displays normal ticket view when simulation status is idle', () => {
    render(<FanPage />);
    
    // Verify gate info
    expect(screen.getByText('البوابة الموصى بها: البوابة 7')).toBeInTheDocument();
    // Alert should not be present
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('displays detour alert when simulation status is dispatched', () => {
    render(<FanPage />);
    
    // Trigger state change via mock
    act(() => {
      mockSubscribeCallback({
        ...mockState,
        simulationStatus: 'dispatched',
      });
    });

    // Alert should now be visible in Arabic (default)
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('تنبيه تبديل المسار')).toBeInTheDocument();
    
    // Also ticket gate should show 'تحديث المسار مطلوب'
    expect(screen.getByText('تحديث المسار مطلوب')).toBeInTheDocument();
  });

  test('renders transport tab correctly and displays shuttle wait times', () => {
    render(<FanPage />);
    
    // Switch to English for easier testing
    fireEvent.click(screen.getByRole('button', { name: /Switch to English/i }));
    
    // Click Transport tab
    fireEvent.click(screen.getByRole('button', { name: /Transport and shuttle information/i }));
    
    expect(screen.getByText('Metro Line B — Stadium Direct')).toBeInTheDocument();
    expect(screen.getAllByText('Wait:').length).toBeGreaterThan(0);
    
    // Check for capacity
    expect(screen.getByText(/Capacity: High/i)).toBeInTheDocument();
  });

  test('displays sustainability metrics as eco pills at the top level', () => {
    render(<FanPage />);
    
    // Switch to English
    fireEvent.click(screen.getByRole('button', { name: /Switch to English/i }));
    
    // Check for Renewable energy and other metrics in the pills
    expect(screen.getByText(/Renewable: 78%/i)).toBeInTheDocument();
    expect(screen.getByText(/Recycled: 62%/i)).toBeInTheDocument();
    expect(screen.getByText(/Transit: 44%/i)).toBeInTheDocument();
  });
});
