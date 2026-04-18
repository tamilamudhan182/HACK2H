import { render, screen, fireEvent } from "@testing-library/react";
import QueuePanel from "../src/components/Event/QueuePanel";

const mockQueues = [
  {
    id: "queue-food-1",
    label: "Spice Bowl Express",
    type: "Food",
    peopleAhead: 18,
    predictedWait: 12,
    joined: true,
    token: "F-112",
    sustainabilityBonus: "+35 pts for reusable cup",
  },
  {
    id: "queue-merch-1",
    label: "Official Jersey Lab",
    type: "Merch",
    peopleAhead: 12,
    predictedWait: 8,
    joined: false,
    token: "M-208",
    sustainabilityBonus: "+20 pts for digital receipt",
  },
];

describe("QueuePanel Component", () => {
  test("renders queue cards with correct labels", () => {
    render(<QueuePanel queues={mockQueues} onJoinQueue={jest.fn()} />);
    expect(screen.getByText("Spice Bowl Express")).toBeInTheDocument();
    expect(screen.getByText("Official Jersey Lab")).toBeInTheDocument();
  });

  test("shows Joined badge on joined queue", () => {
    render(<QueuePanel queues={mockQueues} onJoinQueue={jest.fn()} />);
    expect(screen.getByText("Joined")).toBeInTheDocument();
  });

  test("shows Join Queue button only for unjoined queues", () => {
    render(<QueuePanel queues={mockQueues} onJoinQueue={jest.fn()} />);
    const joinButtons = screen.getAllByText("Join Queue");
    expect(joinButtons).toHaveLength(1);
  });

  test("calls onJoinQueue with correct id when button clicked", () => {
    const mockJoin = jest.fn();
    render(<QueuePanel queues={mockQueues} onJoinQueue={mockJoin} />);
    fireEvent.click(screen.getByText("Join Queue"));
    expect(mockJoin).toHaveBeenCalledWith("queue-merch-1");
  });

  test("shows token for joined queue", () => {
    render(<QueuePanel queues={mockQueues} onJoinQueue={jest.fn()} />);
    expect(screen.getByText("F-112")).toBeInTheDocument();
  });

  test("displays predicted wait times", () => {
    render(<QueuePanel queues={mockQueues} onJoinQueue={jest.fn()} />);
    expect(screen.getByText("12 min")).toBeInTheDocument();
    expect(screen.getByText("8 min")).toBeInTheDocument();
  });

  test("shows sustainability bonus text", () => {
    render(<QueuePanel queues={mockQueues} onJoinQueue={jest.fn()} />);
    expect(screen.getByText(/reusable cup/i)).toBeInTheDocument();
  });

  test("queue section has accessible role=list", () => {
    render(<QueuePanel queues={mockQueues} onJoinQueue={jest.fn()} />);
    expect(screen.getByRole("list", { name: /available virtual queues/i })).toBeInTheDocument();
  });
});
