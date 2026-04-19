/**
 * useTimeline — extracts timeline moment logic from EventContext.
 *
 * Enriches each timeline moment with live countdown status based on
 * the current timestamp and the event kickoff time.
 *
 * @param {Array} timelineMoments - Static moment definitions from eventData.
 * @param {number} kickoffTime - Epoch ms for the event start.
 * @param {number} liveNow - Current epoch ms (updates every telemetry tick).
 * @returns {Array} Enriched timeline moments with `detail` and `status` fields.
 */
export function useTimeline(timelineMoments, kickoffTime, liveNow) {
  return timelineMoments.map((moment) => {
    const deltaMinutes = Math.round((kickoffTime - liveNow) / 60000) + (moment.offsetMinutes - 18);
    const isLive = deltaMinutes <= 0 && deltaMinutes > -20;

    return {
      ...moment,
      detail:
        deltaMinutes > 0 ? `Starts in ${deltaMinutes} min` : isLive ? "Happening now" : "Completed",
      status: deltaMinutes > 0 ? `T-${deltaMinutes}` : isLive ? "Live" : "Done",
    };
  });
}
