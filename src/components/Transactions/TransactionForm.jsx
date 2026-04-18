import { useState } from "react";
import { categoryOptions } from "../../utils/dataHelpers";
import { useAppContext } from "../../context/AppContext";

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  description: "",
  category: "Salary",
  type: "Income",
  amount: "",
  account: "",
};

function TransactionForm() {
  const { addTransaction, role } = useAppContext();
  const [form, setForm] = useState(emptyForm);

  if (role !== "Admin") {
    return (
      <section className="panel panel--muted">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Admin Controls</p>
            <h3>Transaction Form Locked</h3>
          </div>
        </div>
        <p className="helper-copy">Switch to the Admin role to add or manage transactions.</p>
      </section>
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    addTransaction(form);
    setForm({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10),
      category: form.type === "Income" ? "Salary" : "Food",
    });
  }

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Admin Controls</p>
          <h3>Add Transaction</h3>
        </div>
        <span className="panel__chip">Admin only</span>
      </div>
      <form className="transaction-form" onSubmit={handleSubmit}>
        <label>
          <span>Date</span>
          <input
            type="date"
            value={form.date}
            onChange={(event) => setForm({ ...form, date: event.target.value })}
            required
          />
        </label>
        <label>
          <span>Description</span>
          <input
            type="text"
            placeholder="Enter a short description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            required
          />
        </label>
        <label>
          <span>Type</span>
          <select
            value={form.type}
            onChange={(event) =>
              setForm({
                ...form,
                type: event.target.value,
                category: event.target.value === "Income" ? "Salary" : "Food",
              })
            }
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </label>
        <label>
          <span>Category</span>
          <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            {categoryOptions
              .filter((option) => option !== "All")
              .map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </label>
        <label>
          <span>Amount</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
            required
          />
        </label>
        <label>
          <span>Account</span>
          <input
            type="text"
            placeholder="Primary Account"
            value={form.account}
            onChange={(event) => setForm({ ...form, account: event.target.value })}
          />
        </label>
        <button type="submit">Add Transaction</button>
      </form>
    </section>
  );
}

export default TransactionForm;
