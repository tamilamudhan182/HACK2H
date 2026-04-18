import SummaryCard from "../components/Dashboard/SummaryCard";
import BalanceTrendChart from "../components/Dashboard/BalanceTrendChart";
import SpendingBreakdownChart from "../components/Dashboard/SpendingBreakdownChart";
import TransactionTable from "../components/Transactions/TransactionTable";
import TransactionForm from "../components/Transactions/TransactionForm";
import FilterBar from "../components/Transactions/FilterBar";
import InsightsPanel from "../components/Insights/InsightsPanel";
import RoleToggle from "../components/RoleToggle";
import { useAppContext } from "../context/AppContext";
import { formatCurrency } from "../utils/dataHelpers";

function DashboardPage() {
  const { summary, filteredTransactions, role } = useAppContext();

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Financial Dashboard</p>
          <h1>Track balances, spending, and account health from one workspace.</h1>
          <p className="hero__copy">
            A role-aware finance dashboard with transaction controls, trend visuals, and insight summaries for
            decision-ready reporting.
          </p>
        </div>
        <div className="hero__side">
          <RoleToggle />
          <div className="hero__stat">
            <span>Active role</span>
            <strong>{role}</strong>
          </div>
          <div className="hero__stat">
            <span>Filtered net</span>
            <strong>
              {filteredTransactions.length} entries � {summary.visibleAmount >= 0 ? "+" : ""}
              {formatCurrency(summary.visibleAmount)}
            </strong>
          </div>
        </div>
      </section>

      <section className="summary-grid">
        <SummaryCard
          label="Net Balance"
          value={summary.balance}
          tone="balance"
          detail="Income minus tracked expenses"
        />
        <SummaryCard label="Income" value={summary.income} tone="income" detail="All recorded income streams" />
        <SummaryCard label="Expenses" value={summary.expenses} tone="expense" detail="Total outgoing cash flow" />
        <SummaryCard
          label="Transactions"
          value={summary.totalTransactions.toLocaleString("en-US")}
          tone="neutral"
          detail="Across all synced accounts"
        />
      </section>

      <section className="content-grid">
        <BalanceTrendChart data={summary.monthlyOverview} />
        <SpendingBreakdownChart data={summary.categoryBreakdown} />
      </section>

      <section className="content-grid content-grid--secondary">
        <div className="stack">
          <FilterBar />
          <TransactionTable />
        </div>
        <div className="stack">
          <TransactionForm />
          <InsightsPanel />
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
