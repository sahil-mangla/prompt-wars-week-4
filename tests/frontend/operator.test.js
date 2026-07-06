import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import OperatorPage from '../../app/operator/page';
import { syncStore } from '@/lib/sync-store';

jest.mock('@/lib/sync-store', () => ({
  syncStore: {
    subscribeState: jest.fn(),
    updateState: jest.fn(),
  },
}));

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({ translatedText: 'Mocked translation text' })
}));


describe('Operator Command Console (Frontend)', () => {
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
      operatorLog: [
        { time: '10:00:00 AM', text: 'System initialized.' }
      ],
      timeRemaining: 90,
    };

    syncStore.subscribeState.mockImplementation((callback) => {
      mockSubscribeCallback = callback;
      callback(mockState);
      return jest.fn();
    });
    syncStore.updateState.mockResolvedValue();
  });

  test('renders loading state initially if no state is provided', () => {
    syncStore.subscribeState.mockImplementation(() => jest.fn());
    render(<OperatorPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/Initialising/i)).toBeInTheDocument();
  });

  test('renders header and standard telemetry when idle', () => {
    render(<OperatorPage />);
    
    // Header
    expect(screen.getByRole('heading', { name: /MatchMind Command Console/i })).toBeInTheDocument();
    expect(screen.getByText(/T-90/i)).toBeInTheDocument();

    // Telemetry Normal values
    expect(screen.getByText('1.4 m/s')).toBeInTheDocument(); // Gate 7 Flow
    expect(screen.getByText('24 scans/min')).toBeInTheDocument();
    expect(screen.getByText("32°C")).toBeInTheDocument();
    expect(screen.getByText("Humid")).toBeInTheDocument();
    
    // SentinelAI Core should be online
    expect(screen.getByText(/ONLINE \/ SCANNING/i)).toBeInTheDocument();
    expect(screen.getByText('No developing threats predicted. Monitoring telemetry streams...')).toBeInTheDocument();
  });

  test('displays predictive incident details when an incident is active', () => {
    render(<OperatorPage />);
    
    act(() => {
      mockSubscribeCallback({
        ...mockState,
        simulationStatus: 'predicted',
        activeIncidents: [
          {
            id: 'inc_gate7',
            type: 'Crowd Bottleneck',
            zone: 'Gate 7 / Sector C',
            confidence: 88,
            predictedIn: 12,
            status: 'pending_approval',
            signals: {
              flowSlowdown: 15,
              scanRateSurge: 30,
              heatIndex: 38,
            },
            insights: {
              explanation: "Test explanation",
              proposedActions: ["Test Action 1", "Test Action 2"],
              ecoImpact: "Test Eco Impact"
            }
          }
        ],
      });
    });

    // Alert badge
    expect(screen.getByText('INCIDENT PREDICTION')).toBeInTheDocument();
    
    // Alert Details
    expect(screen.getByText('Crowd Bottleneck detected at Gate 7 / Sector C')).toBeInTheDocument();
    expect(screen.getByText('In 12 minutes')).toBeInTheDocument();
    
    // Action Dispatch Plans
    expect(screen.getByText('Proposed Action Dispatch Plans:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Approve SentinelAI action plan/i })).toBeInTheDocument();
  });

  test('approving dispatch updates firebase state correctly', async () => {
    render(<OperatorPage />);
    
    act(() => {
      mockSubscribeCallback({
        ...mockState,
        simulationStatus: 'predicted',
        activeIncidents: [
          {
            id: 'inc_gate7',
            type: 'Crowd Bottleneck',
            zone: 'Gate 7 / Sector C',
            confidence: 88,
            predictedIn: 12,
            status: 'pending_approval',
            signals: {
              flowSlowdown: 15,
              scanRateSurge: 30,
              heatIndex: 38,
            },
            insights: {
              explanation: "Test explanation",
              proposedActions: ["Test Action 1", "Test Action 2"],
              ecoImpact: "Test Eco Impact"
            }
          }
        ],
      });
    });

    const approveBtn = screen.getByRole('button', { name: /Approve SentinelAI action plan/i });
    
    await act(async () => {
      fireEvent.click(approveBtn);
    });

    // updateState is called twice: once immediately, and once after translation fetch
    expect(syncStore.updateState).toHaveBeenCalled();
    
    const callArgs = syncStore.updateState.mock.calls[0][0];
    expect(callArgs.simulationStatus).toBe('dispatched');
    expect(callArgs.activeIncidents[0].status).toBe('dispatched');
    expect(callArgs.volunteers[0].status).toBe('notified');
    // Expect the hardcoded initial task instructions before translation resolves
    expect(callArgs.volunteers[0].task.instructions).toContain('O SentinelAI previu congestionamento no Portão 7');
  });

  test('renders ground volunteers correctly', () => {
    render(<OperatorPage />);
    
    expect(screen.getByRole('heading', { name: /Ground Volunteers/i })).toBeInTheDocument();
    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByText('IDLE')).toBeInTheDocument();
  });

  test('renders operator logs correctly', () => {
    render(<OperatorPage />);
    
    expect(screen.getByRole('heading', { name: /Operator Incident Logs/i })).toBeInTheDocument();
    expect(screen.getByText('System initialized.')).toBeInTheDocument();
  });
});
