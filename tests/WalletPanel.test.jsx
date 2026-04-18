import { render, screen, fireEvent } from "@testing-library/react";
import WalletPanel from "../src/components/Event/WalletPanel";

const mockAttendee = { name: "Aarav Mehta", seatLabel: "Block A · Row 12 · Seat 08" };
const mockWallet = {
  balance: 1840,
  history: [
    { id: "t1", label: "Entry pass verified", amount: 0, type: "scan", channel: "Gate A", timestamp: "17:05" },
    { id: "t2", label: "Wallet top-up", amount: 1000, type: "credit", channel: "UPI", timestamp: "16:48" },
    { id: "t3", label: "Merch pre-order", amount: -550, type: "debit", channel: "QR Wallet", timestamp: "16:32" },
  ],
};
const mockSettings = { highContrast: false, largeText: false, voiceAlerts: false };

describe("WalletPanel Component", () => {
  test("displays attendee name and balance", () => {
    render(
      <WalletPanel
        attendee={mockAttendee}
        wallet={mockWallet}
        settings={mockSettings}
        onAddMoney={jest.fn()}
        onBuyPass={jest.fn()}
        onToggleSetting={jest.fn()}
      />
    );
    expect(screen.getByText("Aarav Mehta")).toBeInTheDocument();
    expect(screen.getByText(/1840.00/)).toBeInTheDocument();
  });

  test("calls onAddMoney when UPI top-up button clicked", () => {
    const mockAdd = jest.fn();
    render(
      <WalletPanel
        attendee={mockAttendee}
        wallet={mockWallet}
        settings={mockSettings}
        onAddMoney={mockAdd}
        onBuyPass={jest.fn()}
        onToggleSetting={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("+ Add INR 500"));
    expect(mockAdd).toHaveBeenCalledWith("UPI", 500);
  });

  test("calls onBuyPass when Metro Pass button clicked", () => {
    const mockBuy = jest.fn();
    render(
      <WalletPanel
        attendee={mockAttendee}
        wallet={mockWallet}
        settings={mockSettings}
        onAddMoney={jest.fn()}
        onBuyPass={mockBuy}
        onToggleSetting={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("Buy Metro Pass"));
    expect(mockBuy).toHaveBeenCalled();
  });

  test("calls onToggleSetting when a toggle switch is clicked", () => {
    const mockToggle = jest.fn();
    render(
      <WalletPanel
        attendee={mockAttendee}
        wallet={mockWallet}
        settings={mockSettings}
        onAddMoney={jest.fn()}
        onBuyPass={jest.fn()}
        onToggleSetting={mockToggle}
      />
    );
    fireEvent.click(screen.getByRole("switch", { name: /high contrast/i }));
    expect(mockToggle).toHaveBeenCalledWith("highContrast");
  });

  test("renders transaction history items", () => {
    render(
      <WalletPanel
        attendee={mockAttendee}
        wallet={mockWallet}
        settings={mockSettings}
        onAddMoney={jest.fn()}
        onBuyPass={jest.fn()}
        onToggleSetting={jest.fn()}
      />
    );
    expect(screen.getByText("Wallet top-up")).toBeInTheDocument();
    expect(screen.getByText("Merch pre-order")).toBeInTheDocument();
  });

  test("switches have correct aria-checked states", () => {
    render(
      <WalletPanel
        attendee={mockAttendee}
        wallet={mockWallet}
        settings={{ ...mockSettings, highContrast: true }}
        onAddMoney={jest.fn()}
        onBuyPass={jest.fn()}
        onToggleSetting={jest.fn()}
      />
    );
    const toggle = screen.getByRole("switch", { name: /high contrast/i });
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });
});
