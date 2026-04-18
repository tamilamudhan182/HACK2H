import { formatCurrency } from "../../utils/dataHelpers";

function SummaryCard({ label, value, tone, detail }) {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <p>{label}</p>
      <h3>{typeof value === "number" ? formatCurrency(value) : value}</h3>
      <span>{detail}</span>
    </article>
  );
}

export default SummaryCard;
