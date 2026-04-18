import { useAppContext } from "../../context/AppContext";
import { formatCurrency } from "../../utils/dataHelpers";

function InsightsPanel() {
  const { summary } = useAppContext();
  const insights = summary.insights;

  return (
    <section className="panel insights-panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Insights</p>
          <h3>Financial Observations</h3>
        </div>
        <span className="panel__chip">Auto-generated</span>
      </div>
      <div className="insights-grid">
        <article>
          <span className="insights-grid__label">Top spend</span>
          <strong>
            {insights.topCategory
              ? `${insights.topCategory.category} · ${formatCurrency(
                  insights.topCategory.amount
                )}`
              : "No expense data"}
          </strong>
        </article>
        <article>
          <span className="insights-grid__label">Month-over-month</span>
          <strong>{formatCurrency(insights.monthlyChange)}</strong>
        </article>
        <article>
          <span className="insights-grid__label">Savings rate</span>
          <strong>{insights.savingsRate}%</strong>
        </article>
      </div>
      <div className="observation-list">
        {insights.observations.map((observation) => (
          <p key={observation}>{observation}</p>
        ))}
      </div>
    </section>
  );
}

export default InsightsPanel;
