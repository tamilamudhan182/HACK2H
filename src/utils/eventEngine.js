export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildQrToken({ userId, venueId, channel }) {
  const payload = `${userId}|${venueId}|${channel}`;
  let hash = 0;

  for (const char of payload) {
    hash = (hash * 31 + char.charCodeAt(0)) % 10000019;
  }

  return `SEC-${hash.toString(16).toUpperCase()}-${channel.slice(0, 4).toUpperCase()}`;
}

export function getDensityTone(density) {
  if (density >= 80) {
    return "critical";
  }

  if (density >= 60) {
    return "busy";
  }

  if (density >= 40) {
    return "steady";
  }

  return "clear";
}

export function predictWaitMinutes(queue, zoneDensity = 50) {
  const congestionMultiplier = 1 + zoneDensity / 170;
  const serviceLoad = queue.peopleAhead * queue.serviceMinutes;
  const adjustedWait = (serviceLoad * congestionMultiplier) / Math.max(queue.counters, 1);

  return Math.round(clamp(adjustedWait, 3, 45));
}

export function recommendRoute({ destination, zones, priority = "balanced" }) {
  const orderedZones = [...zones].sort((left, right) => {
    if (priority === "safety") {
      return left.riskScore - right.riskScore || left.density - right.density;
    }

    return left.density - right.density || left.riskScore - right.riskScore;
  });

  const path = orderedZones.slice(0, 3).map((zone) => zone.label);
  const loadAverage =
    path.length === 0
      ? 0
      : orderedZones.slice(0, 3).reduce((sum, zone) => sum + zone.density, 0) / path.length;
  const eta = Math.round(clamp(4 + loadAverage / 25, 4, 12));
  const advisory =
    priority === "safety"
      ? `Emergency routing active. Move via ${path.join(" -> ")} to reach ${destination}.`
      : `Best live path to ${destination}: ${path.join(" -> ")}.`;

  return {
    path,
    eta,
    advisory,
    confidence: `${Math.round(clamp(92 - loadAverage / 2, 68, 96))}%`,
  };
}

export function buildAiAlert({ zoneName, density, alternateZone, emergency = false }) {
  if (emergency) {
    return `Emergency routing active. Avoid ${zoneName} and move toward ${alternateZone}.`;
  }

  if (density >= 80) {
    return `${zoneName} is crowded right now. Use ${alternateZone} for a faster path.`;
  }

  return `${zoneName} is steady. Continue as planned and monitor live updates.`;
}

export function createWalletActivity(history, activity) {
  return [activity, ...history].slice(0, 6);
}

export function selectRecommendations(catalog, preferences, limit = 3) {
  return [...catalog]
    .map((item) => ({
      ...item,
      score: item.tags.reduce(
        (sum, tag) => sum + (preferences.includes(tag) ? 2 : 0),
        item.category === "Transport" ? 1 : 0
      ),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export function suggestDepartureOption(options, zones) {
  const exitLoad =
    zones.filter((zone) => zone.type === "exit").reduce((sum, zone) => sum + zone.density, 0) /
    Math.max(
      zones.filter((zone) => zone.type === "exit").length,
      1
    );

  const rankedOptions = options
    .map((option) => ({
      ...option,
      liveEta: Math.round(option.travelMinutes + exitLoad * option.crowdSensitivity * 0.1),
    }))
    .sort((left, right) => left.liveEta - right.liveEta);

  return {
    bestOption: rankedOptions[0],
    options: rankedOptions,
  };
}
