import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import {
  createTransaction,
  getDefaultState,
  getFilteredTransactions,
  summarizeTransactions,
} from "../utils/dataHelpers";

const AppContext = createContext(null);

const ACTIONS = {
  ADD_TRANSACTION: "ADD_TRANSACTION",
  UPDATE_TRANSACTION: "UPDATE_TRANSACTION",
  DELETE_TRANSACTION: "DELETE_TRANSACTION",
  SET_FILTERS: "SET_FILTERS",
  SET_ROLE: "SET_ROLE",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [createTransaction(action.payload), ...state.transactions],
      };
    case ACTIONS.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id
            ? { ...transaction, ...action.payload }
            : transaction
        ),
      };
    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        ),
      };
    case ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case ACTIONS.SET_ROLE:
      return {
        ...state,
        role: action.payload,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, getDefaultState);

  useEffect(() => {
    window.localStorage.setItem("finance-dashboard-state", JSON.stringify(state));
  }, [state]);

  const filteredTransactions = useMemo(
    () => getFilteredTransactions(state.transactions, state.filters),
    [state.transactions, state.filters]
  );

  const summary = useMemo(
    () => summarizeTransactions(state.transactions, filteredTransactions),
    [state.transactions, filteredTransactions]
  );

  const value = useMemo(
    () => ({
      ...state,
      filteredTransactions,
      summary,
      addTransaction: (transaction) =>
        dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: transaction }),
      editTransaction: (transaction) =>
        dispatch({ type: ACTIONS.UPDATE_TRANSACTION, payload: transaction }),
      deleteTransaction: (id) =>
        dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id }),
      setFilters: (filters) =>
        dispatch({ type: ACTIONS.SET_FILTERS, payload: filters }),
      setRole: (role) => dispatch({ type: ACTIONS.SET_ROLE, payload: role }),
    }),
    [state, filteredTransactions, summary]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
}
