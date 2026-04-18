import { useEvent } from "../context/EventContext";
import QueuePanel from "../components/Event/QueuePanel";

function QueuePage() {
  const { liveQueues, joinQueue } = useEvent();

  return (
    <div className="page-grid page-grid--top" style={{ paddingBottom: "80px", padding: "16px" }}>
      <QueuePanel queues={liveQueues} onJoinQueue={joinQueue} />
    </div>
  );
}

export default QueuePage;
