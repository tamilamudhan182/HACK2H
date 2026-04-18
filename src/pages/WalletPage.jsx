import { useEvent } from "../context/EventContext";
import WalletPanel from "../components/Event/WalletPanel";

function WalletPage() {
  const { attendeeProfile, wallet, settings, toggleSetting, addWalletFunds, buyPass } = useEvent();

  return (
    <div className="page-grid page-grid--top" style={{ paddingBottom: "80px", padding: "16px" }}>
      <WalletPanel
        attendee={attendeeProfile}
        wallet={wallet}
        settings={settings}
        onAddMoney={addWalletFunds}
        onBuyPass={buyPass}
        onToggleSetting={toggleSetting}
      />
    </div>
  );
}

export default WalletPage;
