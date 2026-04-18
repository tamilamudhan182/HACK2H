import { useEvent } from "../context/EventContext";
import CoordinationPanel from "../components/Event/CoordinationPanel";

function LocatorPage() {
  const { friends, selectedFriendId, setSelectedFriendId, meetupRoute, timeline, transportAdvice } = useEvent();

  return (
    <div className="page-grid page-grid--top" style={{ paddingBottom: "80px", padding: "16px" }}>
      <CoordinationPanel
        friends={friends}
        selectedFriendId={selectedFriendId}
        onSelectFriend={setSelectedFriendId}
        meetupRoute={meetupRoute}
        timeline={timeline}
        transportAdvice={transportAdvice}
      />
    </div>
  );
}

export default LocatorPage;
