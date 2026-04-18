import { useEvent } from "../context/EventContext";
import CrowdFlowPanel from "../components/Event/CrowdFlowPanel";

function HeatmapPage() {
  const { zones, activeDestination, setActiveDestination, liveRoute } = useEvent();

  return (
    <div className="page-grid page-grid--top" style={{ paddingBottom: "80px", padding: "16px" }}>
      <CrowdFlowPanel
        zones={zones}
        activeDestination={activeDestination}
        onDestinationChange={setActiveDestination}
        routeSuggestion={liveRoute}
      />
    </div>
  );
}

export default HeatmapPage;
