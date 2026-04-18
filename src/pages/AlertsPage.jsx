import { useEvent } from "../context/EventContext";
import NotificationRail from "../components/Event/NotificationRail";
import EngagementPanel from "../components/Event/EngagementPanel";

function AlertsPage() {
  const { deferredAlerts, wallet, sustainabilityActions, rewardAction, recommendations } = useEvent();

  return (
    <div className="page-grid page-grid--top" style={{ paddingBottom: "80px", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <NotificationRail alerts={deferredAlerts} />
      <EngagementPanel
        rewardPoints={wallet.rewardPoints}
        actions={sustainabilityActions}
        onRedeemAction={rewardAction}
        recommendations={recommendations}
      />
    </div>
  );
}

export default AlertsPage;
