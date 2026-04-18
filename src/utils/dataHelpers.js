const seededTransactions = [
  {
    id: "txn-1001",
    date: "2026-04-02",
    description: "April Salary",
    category: "Salary",
    type: "Income",
    amount: 5200,
    account: "Primary Account",
  },
  {
    id: "txn-1002",
    date: "2026-04-01",
    description: "Rent Payment",
    category: "Housing",
    type: "Expense",
    amount: 1450,
    account: "Primary Account",
  },
  {
    id: "txn-1003",
    date: "2026-03-30",
    description: "Groceries",
    category: "Food",
    type: "Expense",
    amount: 218,
    account: "Card",
  },
  {
    id: "txn-1004",
    date: "2026-03-28",
    description: "Freelance Project",
    category: "Freelance",
    type: "Income",
    amount: 960,
    account: "Savings",
  },
  {
    id: "txn-1005",
    date: "2026-03-26",
    description: "Internet Bill",
    category: "Utilities",
    type: "Expense",
    amount: 72,
    account: "Card",
  },
  {
    id: "txn-1006",
    date: "2026-03-24",
    description: "Portfolio ETF",
    category: "Investment",
    type: "Expense",
    amount: 340,
    account: "Brokerage",
  },
  {
    id: "txn-1007",
    date: "2026-03-22",
    description: "Coffee Meetings",
    category: "Food",
    type: "Expense",
    amount: 45,
    account: "Card",
  },
  {
    id: "txn-1008",
    date: "2026-03-20",
    description: "Transport Recharge",
    category: "Transport",
    type: "Expense",
    amount: 65,
    account: "Wallet",
  },
];

export const categoryOptions = [
  "All",
  "Salary",
  "Freelance",
  "Housing",
  "Food",
  "Utilities",
  "Investment",
  "Transport",
  "Entertainment",
  "Health",
];

export const typeOptions = ["All", "Income", "Expense"];

export function createTransaction(transaction) {
  return {
    id: transaction.id || `txn-${Date.now()}`,
    date: transaction.date,
    description: transaction.description.trim(),
    category: transaction.category,
    type: transaction.type,
    amount: Number(transaction.amount),
    account: transaction.account.trim() || "Primary Account",
  };
}

export function getDefaultState() {
  const persisted = window.localStorage.getItem("finance-dashboard-state");

  if (persisted) {
    return JSON.parse(persisted);
  }

  return {
    transactions: seededTransactions,
    filters: { category: "All", type: "All", search: "" },
    role: "Viewer",
  };
}

export function getFilteredTransactions(transactions, filters) {
  return transactions
    .filter((transaction) =>
      filters.category === "All" ? true : transaction.category === filters.category
    )
    .filter((transaction) =>
      filters.type === "All" ? true : transaction.type === filters.type
    )
    .filter((transaction) => {
      const query = filters.search.trim().toLowerCase();
      if (!query) return true;

      const haystack = [
        transaction.description,
        transaction.category,
        transaction.account,
        transaction.type,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function buildMonthlyOverview(transactions) {
  const map = new Map();

  [...transactions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((transaction) => {
      const label = new Date(transaction.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const previous = map.get(label) || 0;
      const signedAmount =
        transaction.type === "Income" ? transaction.amount : -transaction.amount;
      map.set(label, previous + signedAmount);
    });

  let runningBalance = 0;

  return Array.from(map.entries()).map(([label, net]) => {
    runningBalance += net;
    return { label, balance: runningBalance };
  });
}

function buildCategoryTotals(transactions) {
  const expenses = transactions.filter((transaction) => transaction.type === "Expense");
  const totals = expenses.reduce((accumulator, transaction) => {
    accumulator[transaction.category] =
      (accumulator[transaction.category] || 0) + transaction.amount;
    return accumulator;
  }, {});

  return Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

function buildInsights(allTransactions) {
  const monthlyGroups = allTransactions.reduce((accumulator, transaction) => {
    const monthKey = transaction.date.slice(0, 7);
    accumulator[monthKey] = accumulator[monthKey] || {
      income: 0,
      expense: 0,
    };

    if (transaction.type === "Income") {
      accumulator[monthKey].income += transaction.amount;
    } else {
      accumulator[monthKey].expense += transaction.amount;
    }

    return accumulator;
  }, {});

  const orderedMonths = Object.entries(monthlyGroups).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  const currentMonth = orderedMonths.at(-1)?.[1] || { income: 0, expense: 0 };
  const previousMonth = orderedMonths.at(-2)?.[1] || { income: 0, expense: 0 };
  const categoryTotals = buildCategoryTotals(allTransactions);
  const topCategory = categoryTotals[0];
  const savingsRate =
    currentMonth.income > 0
      ? Math.round(((currentMonth.income - currentMonth.expense) / currentMonth.income) * 100)
      : 0;

  return {
    topCategory,
    monthlyChange: currentMonth.expense - previousMonth.expense,
    savingsRate,
    observations: [
      topCategory
        ? `${topCategory.category} is your largest expense category at ${formatCurrency(
            topCategory.amount
          )}.`
        : "Expenses will appear here once you log spending activity.",
      currentMonth.expense > previousMonth.expense
        ? `Spending is up ${formatCurrency(
            currentMonth.expense - previousMonth.expense
          )} compared with the previous month.`
        : `Spending is down ${formatCurrency(
            previousMonth.expense - currentMonth.expense
          )} compared with the previous month.`,
      `Current month savings rate is ${Math.max(0, Math.min(100, savingsRate))}%.`,
    ],
  };
}

export function summarizeTransactions(allTransactions, visibleTransactions) {
  const income = allTransactions
    .filter((transaction) => transaction.type === "Income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = allTransactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const visibleAmount = visibleTransactions.reduce(
    (sum, transaction) =>
      sum + (transaction.type === "Income" ? transaction.amount : -transaction.amount),
    0
  );

  return {
    balance: income - expenses,
    income,
    expenses,
    visibleAmount,
    totalTransactions: allTransactions.length,
    monthlyOverview: buildMonthlyOverview(allTransactions),
    categoryBreakdown: buildCategoryTotals(allTransactions),
    insights: buildInsights(allTransactions),
  };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
