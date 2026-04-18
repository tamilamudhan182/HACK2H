import { formatCurrency } from "../../utils/dataHelpers";

const chartColors = ["#125a3e", "#f2a65a", "#6d9dc5", "#a23e48", "#58641d", "#7d5ba6"];

function SpendingBreakdownChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  if (!total) {
    return <div className="empty-chart">No expense categories available.</div>;
  }

  let cumulativePercent = 0;
  const segments = data.map((item, index) => {
    const percent = item.amount / total;
    const start = cumulativePercent;
    cumulativePercent += percent;
    return {
      ...item,
      color: chartColors[index % chartColors.length],
      start,
      end: cumulativePercent,
    };
  });

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Spending Breakdown</p>
          <h3>Expense Categories</h3>
        </div>
        <span className="panel__chip">Current portfolio mix</span>
      </div>
      <div className="donut-layout">
        <div className="donut-chart" aria-hidden="true">
          <div
            className="donut-chart__ring"
            style={{
              background: `conic-gradient(${segments
                .map((segment) => `${segment.color} ${segment.start * 100}% ${segment.end * 100}%`)
                .join(", ")})`,
            }}
          />
          <div className="donut-chart__center">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>
        <div className="legend">
          {segments.map((segment) => (
            <div key={segment.category} className="legend__item">
              <span
                className="legend__swatch"
                style={{ backgroundColor: segment.color }}
              />
              <div>
                <strong>{segment.category}</strong>
                <p>
                  {formatCurrency(segment.amount)} • {Math.round((segment.amount / total) * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpendingBreakdownChart;
