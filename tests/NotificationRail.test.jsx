import { render, screen } from "@testing-library/react";
import NotificationRail from "../src/components/Event/NotificationRail";

const mockAlerts = [
  { id: "a1", tone: "info", title: "Wallet ready", message: "QR is active for all scans.", timestamp: "Now" },
  { id: "a2", tone: "warning", title: "Gate advisory", message: "North Gate is busy.", timestamp: "1 min ago" },
  { id: "a3", tone: "urgent", title: "Emergency reroute", message: "Emergency routing active.", timestamp: "Just now" },
];

describe("NotificationRail Component", () => {
  test("renders all alert titles", () => {
    render(<NotificationRail alerts={mockAlerts} />);
    expect(screen.getByText("Wallet ready")).toBeInTheDocument();
    expect(screen.getByText("Gate advisory")).toBeInTheDocument();
    expect(screen.getByText("Emergency reroute")).toBeInTheDocument();
  });

  test("renders all alert messages", () => {
    render(<NotificationRail alerts={mockAlerts} />);
    expect(screen.getByText(/QR is active/i)).toBeInTheDocument();
    expect(screen.getByText(/North Gate is busy/i)).toBeInTheDocument();
  });

  test("has role=log for screen reader live region", () => {
    render(<NotificationRail alerts={mockAlerts} />);
    expect(screen.getByRole("log")).toBeInTheDocument();
  });

  test("renders timestamps using time element", () => {
    render(<NotificationRail alerts={mockAlerts} />);
    const times = screen.getAllByRole("time") 
      ?? document.querySelectorAll("time");
    // At least one time element should exist
    expect(document.querySelectorAll("time").length).toBeGreaterThan(0);
  });

  test("renders empty state gracefully (no alerts)", () => {
    render(<NotificationRail alerts={[]} />);
    expect(screen.getByText("Live Alerts")).toBeInTheDocument();
  });

  test("each alert has an article role", () => {
    render(<NotificationRail alerts={mockAlerts} />);
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(3);
  });
});
