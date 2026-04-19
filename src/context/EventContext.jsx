import { createContext, useContext, useEffect, useRef, useState, useDeferredValue, startTransition } from "react";
import { sanitizeAmount, sanitizeText, validateQueueId, buildAuditEntry } from "../utils/sanitize";
import { checkRateLimit, formatRetryMessage } from "../utils/rateLimit";
import {
  attendeeProfile,
  initialAlerts,
  initialFriends,
  initialQueues,
  initialWallet,
  initialZones,
  recommendationCatalog,
  sustainabilityActions,
  timelineMoments,
  transportOptions,
} from "../data/eventData";
import {
  buildAiAlert,
  clamp,
  createWalletActivity,
  predictWaitMinutes,
  recommendRoute,
  selectRecommendations,
  suggestDepartureOption,
} from "../utils/eventEngine";

const EventContext = createContext(null);

/**
 * Helper to prepend a new alert if it is not already in the list.
 * Maintains a maximum history size of 7 alerts.
 * @param {Array} currentAlerts - The existing list of alerts.
 * @param {Object} alert - The new alert object to insert.
 * @returns {Array} Updated array of alerts.
 */
function insertAlert(currentAlerts, alert) {
  if (currentAlerts.some((item) => item.id === alert.id)) {
    return currentAlerts;
  }
  return [alert, ...currentAlerts].slice(0, 7);
}

/**
 * Formats a timestamp into a 12-hour/24-hour localized string.
 * @param {number} now - The timestamp to format.
 * @returns {string} Formatted time string.
 */
function formatClock(now) {
  return new Date(now).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Context provider that manages globally shared event state, interactions,
 * simulated real-time backend data, and UI accessibility settings.
 * @param {Object} props - React component props.
 * @param {React.ReactNode} props.children - Child nodes wrapped by provider.
 * @returns {JSX.Element} The Context Provider.
 */
export function EventProvider({ children }) {
  const [wallet, setWallet] = useState(initialWallet);
  const [zones, setZones] = useState(initialZones);
  const [queues, setQueues] = useState(initialQueues);
  const [friends, setFriends] = useState(initialFriends);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    voiceAlerts: false,
  });
  const [selectedFriendId, setSelectedFriendId] = useState(initialFriends[0].id);
  const [activeDestination, setActiveDestination] = useState("seat");
  const [liveNow, setLiveNow] = useState(Date.now());
  const [kickoffTime] = useState(() => Date.now() + 18 * 60 * 1000);
  const lastSpokenAlertId = useRef("");

  useEffect(() => {
    const telemetryTimer = window.setInterval(() => {
      startTransition(() => {
        setLiveNow(Date.now());
        setZones((currentZones) =>
          currentZones.map((zone, index) => {
            const swing = Math.round((Math.random() - 0.5) * 16);
            const coolingOffset = zone.type === "exit" ? -2 : 0;
            const nextDensity = clamp(zone.density + swing + coolingOffset, 24, 96);
            const nextCheckIns = clamp(zone.checkIns + swing * 3 + (index % 2 === 0 ? 4 : -3), 52, 240);

            return {
              ...zone,
              density: nextDensity,
              checkIns: nextCheckIns,
            };
          })
        );

        setQueues((currentQueues) =>
          currentQueues.map((queue, index) => ({
            ...queue,
            peopleAhead: clamp(
              queue.peopleAhead +
                Math.round((Math.random() - 0.35) * 4) -
                (queue.joined ? 1 : 0) +
                (index === 0 ? 1 : 0),
              2,
              24
            ),
          }))
        );

        setFriends((currentFriends) =>
          currentFriends.map((friend, index) => ({
            ...friend,
            x: clamp(friend.x + (index % 2 === 0 ? 2 : -2) + Math.round((Math.random() - 0.5) * 5), 10, 90),
            y: clamp(friend.y + (index % 2 === 0 ? -1 : 1) + Math.round((Math.random() - 0.5) * 5), 12, 88),
          }))
        );
      });
    }, 4200);

    return () => window.clearInterval(telemetryTimer);
  }, []);

  const liveQueues = queues.map((queue) => {
    const zoneDensity = zones.find((zone) => zone.id === queue.zoneId)?.density ?? 55;
    return {
      ...queue,
      predictedWait: predictWaitMinutes(queue, zoneDensity),
    };
  });

  const routeDestinationMap = {
    seat: attendeeProfile.seatLabel,
    restroom: "Restroom Cluster D",
    exit: "Exit Gate C",
  };

  const liveRoute = recommendRoute({
    destination: routeDestinationMap[activeDestination],
    zones,
    priority: activeDestination === "exit" ? "safety" : "balanced",
  });

  const selectedFriend = friends.find((friend) => friend.id === selectedFriendId) ?? friends[0];
  const meetupRoute = recommendRoute({
    destination: `meet ${selectedFriend.name}`,
    zones,
    priority: "balanced",
  });

  const timeline = timelineMoments.map((moment) => {
    const deltaMinutes = Math.round((kickoffTime - liveNow) / 60000) + (moment.offsetMinutes - 18);
    const isLive = deltaMinutes <= 0 && deltaMinutes > -20;

    return {
      ...moment,
      detail: deltaMinutes > 0 ? `Starts in ${deltaMinutes} min` : isLive ? "Happening now" : "Completed",
      status: deltaMinutes > 0 ? `T-${deltaMinutes}` : isLive ? "Live" : "Done",
    };
  });

  const transportAdvice = suggestDepartureOption(transportOptions, zones);
  const recommendations = selectRecommendations(recommendationCatalog, attendeeProfile.preferences, 3);
  const deferredAlerts = useDeferredValue(alerts);

  useEffect(() => {
    const busiestZone = [...zones].sort((left, right) => right.density - left.density)[0];
    const safestZone = [...zones].sort((left, right) => left.riskScore - right.riskScore)[0];

    if (busiestZone.density < 82) return;
    const emergency = busiestZone.type === "exit" && busiestZone.density >= 88;

    setAlerts((currentAlerts) =>
      insertAlert(currentAlerts, {
        id: `crowd-${busiestZone.id}-${emergency ? "urgent" : "warn"}`,
        tone: emergency ? "urgent" : "warning",
        title: emergency ? "Emergency reroute" : "Congestion advisory",
        message: buildAiAlert({
          zoneName: busiestZone.label,
          density: busiestZone.density,
          alternateZone: safestZone.label,
          emergency,
        }),
        timestamp: formatClock(Date.now()),
      })
    );
  }, [zones]);

  useEffect(() => {
    const readyQueue = liveQueues.find((queue) => queue.joined && queue.predictedWait <= 5);
    if (!readyQueue) return;

    setAlerts((currentAlerts) =>
      insertAlert(currentAlerts, {
        id: `queue-ready-${readyQueue.id}`,
        tone: "info",
        title: `${readyQueue.label} is ready`,
        message: `Your ${readyQueue.type.toLowerCase()} slot is almost up. Head over now for queue token ${readyQueue.token}.`,
        timestamp: formatClock(Date.now()),
      })
    );
  }, [liveQueues]);

  useEffect(() => {
    const upcomingMoment = timeline.find((item) => item.status.startsWith("T-") && Number(item.status.slice(2)) <= 10);
    if (!upcomingMoment) return;

    setAlerts((currentAlerts) =>
      insertAlert(currentAlerts, {
        id: `timeline-${upcomingMoment.id}`,
        tone: upcomingMoment.tone,
        title: `${upcomingMoment.label} soon`,
        message: `${upcomingMoment.label} begins in less than 10 minutes. Wrap up food pickups and move toward your seat.`,
        timestamp: formatClock(Date.now()),
      })
    );
  }, [timeline]);

  useEffect(() => {
    if (!settings.voiceAlerts || typeof window === "undefined" || !window.speechSynthesis) return;

    const urgentAlert = alerts.find((alert) => alert.tone === "urgent");
    if (!urgentAlert || urgentAlert.id === lastSpokenAlertId.current) return;

    lastSpokenAlertId.current = urgentAlert.id;
    const utterance = new SpeechSynthesisUtterance(urgentAlert.message);
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [alerts, settings.voiceAlerts]);

  function toggleSetting(key) {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function addWalletFunds(channel, amount) {
    // Rate limit: max 3 top-ups per 10 seconds
    const { allowed, retryAfterMs } = checkRateLimit("wallet_topup", 3, 10_000);
    if (!allowed) {
      console.warn("[RateLimit]", formatRetryMessage(retryAfterMs));
      return;
    }

    // Sanitize inputs
    const safeChannel = sanitizeText(channel);
    const safeAmount = sanitizeAmount(amount, 1, 10_000);
    if (!safeChannel || safeAmount === null) {
      console.warn("[Security] addWalletFunds: invalid input", { channel, amount });
      return;
    }

    console.info("[Audit]", buildAuditEntry("wallet_topup", { channel: safeChannel, amount: safeAmount }));
    const timestamp = formatClock(Date.now());
    setWallet((currentWallet) => ({
      ...currentWallet,
      balance: currentWallet.balance + safeAmount,
      history: createWalletActivity(currentWallet.history, {
        id: `wallet-${Date.now()}`,
        label: `Wallet top-up via ${safeChannel}`,
        amount: safeAmount,
        type: "credit",
        channel: safeChannel,
        timestamp,
      }),
    }));
    setAlerts((currentAlerts) =>
      insertAlert(currentAlerts, {
        id: `wallet-top-up-${safeChannel}-${safeAmount}`,
        tone: "info",
        title: "Balance updated",
        message: `${safeChannel} top-up successful. Your wallet is ready for faster QR payments.`,
        timestamp,
      })
    );
  }

  function buyPass() {
    const timestamp = formatClock(Date.now());
    setWallet((currentWallet) => {
      if (currentWallet.balance < 140) return currentWallet;
      return {
        ...currentWallet,
        balance: currentWallet.balance - 140,
        activePasses: [
          {
            id: `pass-${Date.now()}`,
            label: "Metro Express",
            status: "New",
            validity: "Valid for tonight's departure",
            channel: "Transport",
          },
          ...currentWallet.activePasses,
        ].slice(0, 3),
        history: createWalletActivity(currentWallet.history, {
          id: `wallet-pass-${Date.now()}`,
          label: "Metro express pass",
          amount: -140,
          type: "debit",
          channel: "QR Wallet",
          timestamp,
        }),
      };
    });
    setAlerts((currentAlerts) =>
      insertAlert(currentAlerts, {
        id: `transport-pass-${Date.now()}`,
        tone: "info",
        title: "Transport added",
        message: "Metro Express has been added to your wallet for a smoother exit.",
        timestamp,
      })
    );
  }

  function joinQueue(queueId) {
    // Validate queue ID format (whitelist: alphanumeric + dash)
    if (!validateQueueId(queueId)) {
      console.warn("[Security] joinQueue: invalid queueId", queueId);
      return;
    }

    // Rate limit: max 4 queue joins per 15 seconds
    const { allowed, retryAfterMs } = checkRateLimit("queue_join", 4, 15_000);
    if (!allowed) {
      console.warn("[RateLimit]", formatRetryMessage(retryAfterMs));
      return;
    }

    console.info("[Audit]", buildAuditEntry("queue_join", { queueId }));
    const timestamp = formatClock(Date.now());
    setQueues((currentQueues) =>
      currentQueues.map((queue) =>
        queue.id === queueId
          ? {
              ...queue,
              joined: true,
              peopleAhead: Math.max(queue.peopleAhead - 2, 2),
            }
          : queue
      )
    );
    const queue = liveQueues.find((item) => item.id === queueId);
    if (!queue) return;
    setAlerts((currentAlerts) =>
      insertAlert(currentAlerts, {
        id: `queue-join-${queueId}`,
        tone: "info",
        title: "Queue slot reserved",
        message: `You're booked for ${queue.label}. Expected wait is ${queue.predictedWait} minutes.`,
        timestamp,
      })
    );
  }

  function rewardAction(action) {
    // Rate limit: max 5 reward logs per 30 seconds
    const { allowed, retryAfterMs } = checkRateLimit("reward_action", 5, 30_000);
    if (!allowed) {
      console.warn("[RateLimit]", formatRetryMessage(retryAfterMs));
      return;
    }

    // Sanitize label before storing
    const safeLabel = sanitizeText(action.label);
    const safePoints = sanitizeAmount(action.points, 1, 500);
    if (!safeLabel || safePoints === null) {
      console.warn("[Security] rewardAction: invalid action", action);
      return;
    }

    console.info("[Audit]", buildAuditEntry("reward_action", { id: action.id, points: safePoints }));
    const timestamp = formatClock(Date.now());
    setWallet((currentWallet) => ({
      ...currentWallet,
      rewardPoints: currentWallet.rewardPoints + safePoints,
    }));
    setAlerts((currentAlerts) =>
      insertAlert(currentAlerts, {
        id: `reward-${action.id}-${Date.now()}`,
        tone: "info",
        title: "Reward captured",
        message: `${safeLabel} logged. ${safePoints} eco points added to your profile.`,
        timestamp,
      })
    );
  }

  const value = {
    wallet,
    zones,
    queues,
    friends,
    alerts,
    settings,
    selectedFriendId,
    activeDestination,
    liveNow,
    kickoffTime,
    liveQueues,
    liveRoute,
    meetupRoute,
    timeline,
    transportAdvice,
    recommendations,
    deferredAlerts,
    attendeeProfile,
    sustainabilityActions,
    setActiveDestination,
    setSelectedFriendId,
    toggleSetting,
    addWalletFunds,
    buyPass,
    joinQueue,
    rewardAction,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvent() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
}
