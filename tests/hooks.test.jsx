import { renderHook, act } from "@testing-library/react";
import { useTimeline } from "../src/hooks/useTimeline";
import { useTransport } from "../src/hooks/useTransport";
import { useAlerts } from "../src/hooks/useAlerts";
import { useQueue } from "../src/hooks/useQueue";
import { useWallet } from "../src/hooks/useWallet";
import { useSecureQr } from "../src/hooks/useSecureQr";
import { useEvent } from "../src/context/EventContext";

// Mock utilities
jest.mock("../src/context/EventContext", () => ({
  useEvent: jest.fn(),
}));

jest.mock("../src/utils/crypto", () => ({
  generateAesKey: jest.fn(() => Promise.resolve("mock-key")),
  encryptQrPayload: jest.fn(() => Promise.resolve("encrypted-payload")),
  exportKey: jest.fn(() => Promise.resolve("exported-key")),
}));

describe("Custom Hooks Logic", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    
    // Default mock for useEvent
    useEvent.mockReturnValue({
      deferredAlerts: [],
      liveQueues: [],
      wallet: { balance: 1000, history: [] },
      zones: [],
      joinQueue: jest.fn(),
      leaveQueue: jest.fn(),
      addWalletFunds: jest.fn(),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("useTimeline", () => {
    const mockMoments = [{ id: 1, label: "Test Moment", offsetMinutes: 10 }];
    const kickoffTime = 1000000;
    
    test("calculates T-minus status correctly", () => {
      const liveNow = 1000000 - (15 * 60 * 1000); // 15 mins before kickoff
      const result = useTimeline(mockMoments, kickoffTime, liveNow);
      expect(result[0].status).toBe("T-7");
    });

    test("handles completed status", () => {
      const liveNow = 1000000 + (60 * 60 * 1000); // 1 hour after kickoff
      const result = useTimeline(mockMoments, kickoffTime, liveNow);
      expect(result[0].status).toBe("Done");
    });
  });

  describe("useTransport", () => {
    const mockZones = [{ id: "A", density: 50, label: "Zone A" }];
    const mockOptions = [{ id: "shuttle", label: "Shuttle", liveEta: 10 }];
    const recommendRoute = jest.fn((args) => ({ path: ["A", "B"], priority: args.priority }));
    const suggestDepartureOption = jest.fn(() => mockOptions[0]);

    test("generates routes and advice with different priorities", () => {
      const { result, rerender } = renderHook(({ activeDestination }) => useTransport({
        transportOptions: mockOptions,
        zones: mockZones,
        activeDestination,
        selectedFriendName: "Aarav",
        recommendRoute,
        suggestDepartureOption,
        attendeeProfile: { seatLabel: "Seat 101" },
      }), { initialProps: { activeDestination: "exit" } });
      
      expect(result.current.liveRoute.priority).toBe("safety");
      
      rerender({ activeDestination: "seat" });
      expect(result.current.liveRoute.priority).toBe("balanced");
    });
  });

  describe("useHeatmap", () => {
    test("detects critical zones", () => {
      const { useHeatmap } = require("../src/hooks/useHeatmap");
      useEvent.mockReturnValue({
        zones: [
          { id: "A", density: 90, label: "Hot Zone" },
          { id: "B", density: 40, label: "Cool Zone" },
        ],
      });
      const { result } = renderHook(() => useHeatmap());
      expect(result.current.criticalZones.length).toBe(1);
      expect(result.current.criticalZones[0].id).toBe("A");
    });
  });

  describe("useAlerts", () => {
    test("calculates alert counts correctly", () => {
      useEvent.mockReturnValue({
        deferredAlerts: [
          { id: 1, tone: "urgent" },
          { id: 2, tone: "warning" },
        ],
      });
      const { result } = renderHook(() => useAlerts());
      expect(result.current.urgentCount).toBe(1);
    });
  });

  describe("useQueue", () => {
    test("provides queue actions", () => {
      const joinQueueMock = jest.fn();
      useEvent.mockReturnValue({
        liveQueues: [{ id: "q1", label: "Queue 1" }],
        joinQueue: joinQueueMock,
      });
      const { result } = renderHook(() => useQueue());
      act(() => {
        result.current.joinQueue("q1");
      });
      expect(joinQueueMock).toHaveBeenCalledWith("q1");
    });
  });

  describe("useWallet", () => {
    test("calculates spending stats", () => {
      useEvent.mockReturnValue({
        wallet: { 
          balance: 500, 
          history: [{ amount: 100, type: "debit" }, { amount: 50, type: "debit" }] 
        },
        attendeeProfile: {},
        addWalletFunds: jest.fn(),
        buyPass: jest.fn(),
      });
      const { result } = renderHook(() => useWallet());
      expect(result.current.totalDebits).toBe(150);
    });
  });

  describe("useSecureQr", () => {
    test("rotates key and encrypts payload", async () => {
      const { result } = renderHook(() => useSecureQr({ userId: "u1", venueId: "v1", channel: "c1" }));
      
      // Initially loading
      expect(result.current.loading).toBe(true);
      
      // Fast-forward initial setTimeout(0)
      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.encryptedToken).toBe("encrypted-payload");
      expect(result.current.loading).toBe(false);
    });
  });
});
