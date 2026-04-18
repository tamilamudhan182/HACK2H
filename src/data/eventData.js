export const attendeeProfile = {
  id: "attendee-27",
  name: "Aarav Mehta",
  venueId: "stadium-neo",
  seatLabel: "Block A · Row 12 · Seat 08",
  groupName: "Weekend Crew",
  preferences: ["vegetarian", "spicy", "retro", "sustainable"],
};

export const initialWallet = {
  balance: 1840,
  rewardPoints: 420,
  activePasses: [
    {
      id: "pass-entry",
      label: "Entry Pass",
      status: "Validated",
      validity: "Gate opens now",
      channel: "Venue Entry",
    },
    {
      id: "pass-metro",
      label: "Metro Return",
      status: "Ready",
      validity: "Valid until 23:45",
      channel: "Transport",
    },
  ],
  history: [
    {
      id: "txn-1",
      label: "Entry pass verified",
      amount: 0,
      type: "scan",
      channel: "Gate A",
      timestamp: "17:05",
    },
    {
      id: "txn-2",
      label: "Wallet top-up",
      amount: 1000,
      type: "credit",
      channel: "UPI",
      timestamp: "16:48",
    },
    {
      id: "txn-3",
      label: "Merch pre-order",
      amount: -550,
      type: "debit",
      channel: "QR Wallet",
      timestamp: "16:32",
    },
  ],
};

export const initialZones = [
  {
    id: "north-gate",
    label: "North Gate",
    density: 84,
    checkIns: 216,
    type: "entry",
    x: 14,
    y: 16,
    riskScore: 72,
  },
  {
    id: "east-concourse",
    label: "East Concourse",
    density: 61,
    checkIns: 144,
    type: "circulation",
    x: 52,
    y: 18,
    riskScore: 48,
  },
  {
    id: "food-court",
    label: "Food Court",
    density: 76,
    checkIns: 182,
    type: "service",
    x: 76,
    y: 42,
    riskScore: 58,
  },
  {
    id: "seat-bowl",
    label: "Seat Bowl A",
    density: 57,
    checkIns: 136,
    type: "seating",
    x: 34,
    y: 48,
    riskScore: 41,
  },
  {
    id: "restroom-d",
    label: "Restroom Cluster D",
    density: 49,
    checkIns: 88,
    type: "restroom",
    x: 20,
    y: 70,
    riskScore: 34,
  },
  {
    id: "merch-avenue",
    label: "Merch Avenue",
    density: 68,
    checkIns: 128,
    type: "merch",
    x: 62,
    y: 72,
    riskScore: 45,
  },
  {
    id: "exit-b",
    label: "Exit Gate B",
    density: 73,
    checkIns: 164,
    type: "exit",
    x: 18,
    y: 88,
    riskScore: 68,
  },
  {
    id: "exit-c",
    label: "Exit Gate C",
    density: 38,
    checkIns: 74,
    type: "exit",
    x: 82,
    y: 86,
    riskScore: 22,
  },
];

export const initialQueues = [
  {
    id: "queue-food-1",
    label: "Spice Bowl Express",
    type: "Food",
    zoneId: "food-court",
    peopleAhead: 18,
    counters: 3,
    serviceMinutes: 2.1,
    slot: "17:28",
    sustainabilityBonus: "+35 pts for reusable cup",
    joined: true,
    token: "F-112",
  },
  {
    id: "queue-merch-1",
    label: "Official Jersey Lab",
    type: "Merch",
    zoneId: "merch-avenue",
    peopleAhead: 12,
    counters: 2,
    serviceMinutes: 2.7,
    slot: "17:40",
    sustainabilityBonus: "+20 pts for digital receipt",
    joined: false,
    token: "M-208",
  },
  {
    id: "queue-restroom-1",
    label: "Restroom Cluster D",
    type: "Restroom",
    zoneId: "restroom-d",
    peopleAhead: 7,
    counters: 5,
    serviceMinutes: 1.4,
    slot: "17:19",
    sustainabilityBonus: "Priority lane available",
    joined: false,
    token: "R-019",
  },
];

export const initialFriends = [
  { id: "friend-1", name: "Neha", x: 28, y: 48, status: "At seat", accent: "cyan" },
  { id: "friend-2", name: "Kabir", x: 76, y: 40, status: "Getting snacks", accent: "green" },
  { id: "friend-3", name: "Ira", x: 20, y: 72, status: "Near restroom", accent: "pink" },
];

export const timelineMoments = [
  { id: "moment-1", label: "Kickoff", offsetMinutes: 18, tone: "info" },
  { id: "moment-2", label: "First hydration push", offsetMinutes: 28, tone: "info" },
  { id: "moment-3", label: "Halftime show", offsetMinutes: 63, tone: "warning" },
  { id: "moment-4", label: "Post-match departure", offsetMinutes: 118, tone: "warning" },
];

export const recommendationCatalog = [
  {
    id: "rec-1",
    title: "Paneer Loaded Nachos",
    category: "Food",
    tags: ["vegetarian", "spicy"],
    sustainability: "Served in recyclable tray",
  },
  {
    id: "rec-2",
    title: "Retro Blue Supporter Scarf",
    category: "Merch",
    tags: ["retro"],
    sustainability: "Organic cotton blend",
  },
  {
    id: "rec-3",
    title: "Express Metro Exit Bundle",
    category: "Transport",
    tags: ["sustainable"],
    sustainability: "Fastest low-carbon departure",
  },
  {
    id: "rec-4",
    title: "Glow Band Combo",
    category: "Merch",
    tags: ["night"],
    sustainability: "Rechargeable wristband",
  },
];

export const transportOptions = [
  {
    id: "transport-metro",
    label: "Metro Green Line",
    travelMinutes: 18,
    crowdSensitivity: 0.45,
    walletLabel: "Scan metro gate QR",
  },
  {
    id: "transport-bus",
    label: "Shuttle Bus Bay 4",
    travelMinutes: 26,
    crowdSensitivity: 0.3,
    walletLabel: "Activate bus ride QR",
  },
  {
    id: "transport-cab",
    label: "Cab Priority Pickup",
    travelMinutes: 14,
    crowdSensitivity: 0.72,
    walletLabel: "Share pickup pass",
  },
];

export const initialAlerts = [
  {
    id: "alert-1",
    tone: "info",
    title: "Wallet ready",
    message: "Unified QR is active for entry, food, merch, and transport scans.",
    timestamp: "Now",
  },
  {
    id: "alert-2",
    tone: "warning",
    title: "Gate advisory",
    message: "North Gate is busy. The app is prioritizing East Concourse for smoother entry.",
    timestamp: "1 min ago",
  },
];

export const sustainabilityActions = [
  { id: "action-1", label: "Log recycling", points: 50 },
  { id: "action-2", label: "Use metro exit", points: 80 },
  { id: "action-3", label: "Choose digital receipt", points: 20 },
];
