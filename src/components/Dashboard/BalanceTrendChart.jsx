function BalanceTrendChart({ data }) {
  if (!data.length) {
    return <div className="empty-chart">No balance history yet.</div>;
  }

  const width = 600;
  const height = 260;
  const padding = 30;
  const balances = data.map((point) => point.balance);
  const min = Math.min(...balances, 0);
  const max = Math.max(...balances, 0);
  const range = max - min || 1;

  const points = data
    .map((point, index) => {
      const x =
        padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
      const y =
        height - padding - ((point.balance - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Dashboard Overview</p>
          <h3>Balance Trend</h3>
        </div>
        <span className="panel__chip">Net movement over time</span>
      </div>
      <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} role="img">
        <polyline fill="none" stroke="#125a3e" strokeWidth="4" points={points} />
        {data.map((point, index) => {
          const x =
            padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
          const y =
            height -
            padding -
            ((point.balance - min) / range) * (height - padding * 2);

          return (
            <g key={point.label}>
              <circle cx={x} cy={y} r="5" fill="#125a3e" />
              <text x={x} y={height - 8} textAnchor="middle">
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

export default BalanceTrendChart;
