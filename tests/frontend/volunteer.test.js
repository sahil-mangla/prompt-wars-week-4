import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import VolunteerPage from '../../app/volunteer/page';
import { syncStore } from '../../lib/firebase';

jest.mock('../../lib/firebase', () => ({
  syncStore: {
    subscribeState: jest.fn(),
    updateState: jest.fn(),
  },
}));

describe('Volunteer Mobile PWA (Frontend)', () => {
  let mockState;
  let mockSubscribeCallback;

  beforeEach(() => {
    jest.clearAllMocks();

    mockState = {
      simulationStatus: 'idle',
      activeIncidents: [],
      volunteers: [
        { id: 'v1', name: 'Maria Silva', role: 'Gate Marshal', lang: 'pt', status: 'idle', task: null }
      ],
      operatorLog: [],
    };

    syncStore.subscribeState.mockImplementation((callback) => {
      mockSubscribeCallback = callback;
      callback(mockState);
      return jest.fn();
    });
    syncStore.updateState.mockResolvedValue();
  });

  test('renders loading state initially', () => {
    syncStore.subscribeState.mockImplementation(() => jest.fn());
    render(<VolunteerPage />);
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  test('renders volunteer profile and idle state correctly', () => {
    render(<VolunteerPage />);
    
    expect(screen.getByRole('heading', { name: /FIFA World Cup Volunteers/i })).toBeInTheDocument();
    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    
    // Status should be idle -> AVAILABLE
    expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
    
    // Empty state for tasks
    expect(screen.getByText('No pending instructions')).toBeInTheDocument();
  });

  test('displays emergency task when notified', () => {
    render(<VolunteerPage />);
    
    act(() => {
      mockSubscribeCallback({
        ...mockState,
        simulationStatus: 'dispatched',
        activeIncidents: [{ timestamp: '10:15:00 AM' }],
        volunteers: [
          {
            id: 'v1',
            name: 'Maria Silva',
            role: 'Gate Marshal',
            lang: 'pt',
            status: 'notified',
            task: {
              title: 'Direcionar Fluxo do Portão 7 para Portão 7B',
              instructions: 'O SentinelAI previu congestionamento no Portão 7. Abra o portão auxiliar 7B.',
              priority: 'HIGH'
            }
          }
        ]
      });
    });

    // Alert
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('EMERGENCY TASK')).toBeInTheDocument();
    
    // Task instructions
    expect(screen.getByRole('heading', { name: /Direcionar Fluxo do Portão 7 para Portão 7B/i })).toBeInTheDocument();
    expect(screen.getByText(/O SentinelAI previu congestionamento no Portão 7/i)).toBeInTheDocument();
    
    // Recommended AI script
    expect(screen.getByText(/AI Recommended Script/i)).toBeInTheDocument();
    
    // Action button to confirm arrival
    expect(screen.getByRole('button', { name: /Confirm arrival/i })).toBeInTheDocument();
  });

  test('updating task status triggers firebase update', () => {
    render(<VolunteerPage />);
    
    act(() => {
      mockSubscribeCallback({
        ...mockState,
        simulationStatus: 'dispatched',
        activeIncidents: [{ timestamp: '10:15:00 AM' }],
        volunteers: [
          {
            id: 'v1',
            name: 'Maria Silva',
            role: 'Gate Marshal',
            lang: 'pt',
            status: 'notified',
            task: {
              title: 'Direcionar Fluxo',
              instructions: '...',
              priority: 'HIGH'
            }
          }
        ]
      });
    });

    const confirmBtn = screen.getByRole('button', { name: /Confirm arrival/i });
    fireEvent.click(confirmBtn);

    expect(syncStore.updateState).toHaveBeenCalledTimes(1);
    const callArgs = syncStore.updateState.mock.calls[0][0];
    
    expect(callArgs.volunteers[0].status).toBe('in_position');
    expect(callArgs.operatorLog[0].text).toContain('Confirmed in position at Gate 7B.');
  });
});
