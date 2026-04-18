/**
 * useQueue — custom hook that extracts all virtual queue state and actions
 * from the EventContext.
 *
 * @returns {{
 *   liveQueues: Array,
 *   joinQueue: Function,
 *   activeQueueCount: number
 * }}
 */
import { useMemo } from "react";
import { useEvent } from "../context/EventContext";

export function useQueue() {
  const { liveQueues, joinQueue } = useEvent();

  const activeQueueCount = useMemo(() => liveQueues.filter((q) => q.joined).length, [liveQueues]);

  const nearReadyQueues = useMemo(() => liveQueues.filter((q) => q.joined && q.predictedWait <= 5), [liveQueues]);

  return { liveQueues, joinQueue, activeQueueCount, nearReadyQueues };
}
