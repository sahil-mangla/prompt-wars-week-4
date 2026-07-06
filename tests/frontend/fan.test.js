import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FanPage from '../../app/fan/page';
import { syncStore } from '@/lib/sync-store';

jest.mock('@/lib/sync-store', () => ({
  syncStore: {
    subscribeState: jest.fn(),
    updateState: jest.fn(),
  },
}));

describe('Fan Companion App (Frontend)', () => {
  let mockState;
  let mockSubscribeCallback;

  beforeEach(() => {
    jest.clearAllMocks();

    mockState = {
      simulationStatus: 'idle',
      activeIncidents: [],
      volunteers: [],
      operatorLog: [],
      timeRemaining: 120,
    };

    syncStore.subscribeState.mockImplementation((callback) => {
      mockSubscribeCallback = callback;
      callback(mockState);
      return jest.fn();
    });
  });

  test('renders loading state initially if no state is provided', () => {
    syncStore.subscribeState.mockImplementation(() => jest.fn());
    render(<FanPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders the fan app header and toggles language correctly', () => {
    render(<FanPage />);
    
    // Default language is English now based on state
    expect(screen.getByText('Welcome, Yusuf')).toBeInTheDocument();
    
    // Toggle language
    const langSelect = screen.getByRole('combobox');
    fireEvent.change(langSelect, { target: { value: 'es' } });
    
    // Now it should be Spanish
    expect(screen.getByText('Bienvenido, Yusuf')).toBeInTheDocument();
  });

  test('displays normal ticket view when simulation status is idle', () => {
    render(<FanPage />);
    
    // Verify gate info in english
    expect(screen.getAllByText('Gate 7').length).toBeGreaterThan(0);
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
        activeIncidents: [{
          id: 'inc_1',
          type: 'Crowd Bottleneck',
          zone: 'Gate 7'
        }]
      });
    });

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('DETOUR ALERT')).toBeInTheDocument();
    
    expect(screen.getByText('Route Change Required')).toBeInTheDocument();
  });

  test('renders transport tab correctly', () => {
    render(<FanPage />);
    
    // Click Transport tab
    fireEvent.click(screen.getByRole('tab', { name: /Transport/i }));
    
    expect(screen.getByText('Metro Line B')).toBeInTheDocument();
    expect(screen.getByText('Shuttle Bus 7')).toBeInTheDocument();
  });

  test('displays sustainability metrics as eco pills at the top level', () => {
    render(<FanPage />);
    
    expect(screen.getByText(/Renewable: 78%/i)).toBeInTheDocument();
    expect(screen.getByText(/Recycled: 62%/i)).toBeInTheDocument();
    expect(screen.getByText(/Transit: 44%/i)).toBeInTheDocument();
  });
});
