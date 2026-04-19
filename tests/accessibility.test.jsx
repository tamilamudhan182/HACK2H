/**
 * Automated accessibility tests using jest-axe.
 *
 * Renders each core panel with explicit props and runs axe-core to
 * catch WCAG 2.1 AA violations automatically.
 */
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import QueuePanel from "../src/components/Event/QueuePanel";
import NotificationRail from "../src/components/Event/NotificationRail";
import WalletPanel from "../src/components/Event/WalletPanel";

expect.extend(toHaveNoViolations);

// ── Shared fixture data ──────────────────────────────────────────────────────
const queues = [
  { id: "q1", label: "Food Court", type: "Food", joined: false, peopleAhead: 8, predictedWait: 4, token: "FC-88" },
  { id: "q2", label: "Merch Stand", type: "Merch", joined: true, peopleAhead: 2, predictedWait: 1, token: "MS-21" },
];

const alerts = [
  { id: "a1", tone: "info", title: "Test info", message: "All good here.", timestamp: "9:00 AM" },
  { id: "a2", tone: "warning", title: "Test warning", message: "Stay alert.", timestamp: "9:05 AM" },
];

const wallet = {
  balance: 620,
  rewardPoints: 140,
  activePasses: [{ id: "p1", label: "Metro Express", status: "New", validity: "Tonight", channel: "Transport" }],
  history: [{ id: "h1", label: "Top-up", amount: 200, type: "credit", channel: "UPI", timestamp: "9:00 AM" }],
};

const attendee = { qrToken: "QR-TOKEN-123", name: "Test User", seatLabel: "Block A, Row 5" };
const settings = { highContrast: false, largeText: false, voiceAlerts: false };

// ── Tests ────────────────────────────────────────────────────────────────────

describe("QueuePanel — axe accessibility", () => {
  it("has no WCAG violations", async () => {
    const { container } = render(
      <QueuePanel queues={queues} onJoinQueue={jest.fn()} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("NotificationRail — axe accessibility", () => {
  it("has no WCAG violations", async () => {
    const { container } = render(<NotificationRail alerts={alerts} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("WalletPanel — axe accessibility", () => {
  it("has no WCAG violations", async () => {
    const { container } = render(
      <WalletPanel
        attendee={attendee}
        wallet={wallet}
        settings={settings}
        onAddMoney={jest.fn()}
        onBuyPass={jest.fn()}
        onToggleSetting={jest.fn()}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
