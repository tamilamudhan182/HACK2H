/**
 * useAlerts — custom hook that extracts the alert feed and derived
 * alert counts from EventContext.
 *
 * @returns {{
 *   alerts: Array,
 *   urgentCount: number,
 *   warningCount: number
 * }}
 */
import { useMemo } from "react";
import { useEvent } from "../context/EventContext";

export function useAlerts() {
  const { deferredAlerts } = useEvent();

  const urgentCount = useMemo(() => deferredAlerts.filter((a) => a.tone === "urgent").length, [deferredAlerts]);

  const warningCount = useMemo(() => deferredAlerts.filter((a) => a.tone === "warning").length, [deferredAlerts]);

  return { alerts: deferredAlerts, urgentCount, warningCount };
}
