/**
 * useTransport — extracts transport advice + route calculation from EventContext.
 *
 * @param {Array} transportOptions - All available transport options from eventData.
 * @param {Array} zones - Live zone data (density, risk) from EventContext.
 * @param {string} activeDestination - One of "seat" | "restroom" | "exit".
 * @param {string} selectedFriendName - Name of the friend to meet up with.
 * @param {Function} recommendRoute - Route recommendation utility.
 * @param {Function} suggestDepartureOption - Departure suggestion utility.
 * @param {Object} attendeeProfile - Current user profile from eventData.
 * @returns {{ liveRoute: Object, meetupRoute: Object, transportAdvice: Object }}
 */
export function useTransport({
  transportOptions,
  zones,
  activeDestination,
  selectedFriendName,
  recommendRoute,
  suggestDepartureOption,
  attendeeProfile,
}) {
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

  const meetupRoute = recommendRoute({
    destination: `meet ${selectedFriendName}`,
    zones,
    priority: "balanced",
  });

  const transportAdvice = suggestDepartureOption(transportOptions, zones);

  return { liveRoute, meetupRoute, transportAdvice };
}
