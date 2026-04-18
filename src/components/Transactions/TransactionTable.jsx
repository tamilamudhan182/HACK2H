import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { formatCurrency, formatDate } from "../../utils/dataHelpers";

function TransactionTable() {
  const { filteredTransactions, role, deleteTransaction } = useAppContext();
  const [sortKey, setSortKey] = useState("date");
  const [direction, setDirection] = useState("desc");

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const multiplier = direction === "asc" ? 1 : -1;

    if (sortKey === "amount") {
      return (a.amount - b.amount) * multiplier;
    }

    return a[sortKey].localeCompare(b[sortKey]) * multiplier;
  });

  function toggleSort(nextKey) {
    if (nextKey === sortKey) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setDirection(nextKey === "amount" ? "desc" : "asc");
  }

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Transactions</p>
          <h3>Recent Activity</h3>
        </div>
        <span className="panel__chip">{sortedTransactions.length} visible items</span>
      </div>
      {!sortedTransactions.length ? (
        <div className="empty-state">
          <h4>No transactions yet.</h4>
          <p>Add your first one or adjust the current filters.</p>
        </div>
      ) : (
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>
                  <button type="button" onClick={() => toggleSort("date")}>
                    Date
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => toggleSort("description")}>
                    Description
                  </button>
                </th>
                <th>Category</th>
                <th>Account</th>
                <th>
                  <button type="button" onClick={() => toggleSort("amount")}>
                    Amount
                  </button>
                </th>
                <th>Type</th>
                {role === "Admin" ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.account}</td>
                  <td>{formatCurrency(transaction.amount)}</td>
                  <td>
                    <span
                      className={`status-pill status-pill--${transaction.type.toLowerCase()}`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  {role === "Admin" ? (
                    <td>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        Delete
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default TransactionTable;
