/**
 * useHeatmap — custom hook that extracts heatmap zone state and routing actions.
 *
 * @returns {{
 *   zones: Array,
 *   liveRoute: Object,
 *   activeDestination: string,
 *   setActiveDestination: Function,
 *   criticalZones: Array
 * }}
 */
import { useMemo } from "react";
import { useEvent } from "../context/EventContext";

export function useHeatmap() {
  const { zones, liveRoute, activeDestination, setActiveDestination } = useEvent();

  const criticalZones = useMemo(() => zones.filter((z) => z.density >= 80), [zones]);

  const safestExit = useMemo(
    () => [...zones].filter((z) => z.type === "exit").sort((a, b) => a.riskScore - b.riskScore)[0] ?? null,
    [zones]
  );

  return { zones, liveRoute, activeDestination, setActiveDestination, criticalZones, safestExit };
}
