
import { useReducer } from "react";

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
};

function reducer(state, action) {
  if (!state.isActive && action.type !== "openAccount") return state;

  switch (action.type) {
    case "openAccount":
      return {
        ...state,
        balance: 500,
        isActive: true,
      };

    case "deposite":
      return {
        ...state,
        balance: state.balance + action.payload,
      };

    case "withdraw":
      return {
        ...state,
        balance: state.balance - action.payload,
      };

    case "requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload,
        balance: state.balance + action.payload,
      };

    case "payLoan":
      return {
        ...state,
        loan: 0,
        balance: state.balance - state.loan,
      };

    case "closeAccount":
      if (state.loan > 0 || state.balance !== 0) return state;
      return initialState;

    default:
      throw new Error("action unknown");
  }
}

const actionButtons = [
  {
    label: "Open account",
    type: "openAccount",
    payload: null,
    variant: "primary",
    disableWhen: (isActive) => isActive,
  },
  {
    label: "Deposit 150",
    type: "deposite",
    payload: 150,
    variant: "ghost",
    disableWhen: (isActive) => !isActive,
  },
  {
    label: "Withdraw 50",
    type: "withdraw",
    payload: 50,
    variant: "ghost",
    disableWhen: (isActive) => !isActive,
  },
  {
    label: "Request loan 5000",
    type: "requestLoan",
    payload: 5000,
    variant: "accent",
    disableWhen: (isActive) => !isActive,
  },
  {
    label: "Pay loan",
    type: "payLoan",
    payload: null,
    variant: "ghost",
    disableWhen: (isActive) => !isActive,
  },
  {
    label: "Close account",
    type: "closeAccount",
    payload: null,
    variant: "danger",
    disableWhen: (isActive) => !isActive,
  },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function App() {
  const [{ balance, loan, isActive }, dispatch] = useReducer(reducer, initialState);

  return (
    <main className="app-shell">
      <section className="account-card">
        <header className="account-header">
          <p className="eyebrow">React Savings Club</p>
          <h1>useReducer Bank Account</h1>
          <p className={`status-badge ${isActive ? "status-active" : "status-idle"}`}>
            {isActive ? "Account active" : "Account locked"}
          </p>
        </header>

        <div className="account-stats">
          <article className="stat-card">
            <p className="stat-label">Balance</p>
            <p className="stat-value">{currency.format(balance)}</p>
            <p className="stat-helper">Includes cash + approved loans</p>
          </article>

          <article className="stat-card">
            <p className="stat-label">Outstanding loan</p>
            <p className="stat-value">{currency.format(loan)}</p>
            <p className="stat-helper">
              {loan > 0 ? "Clear this before closing the account" : "No active loans"}
            </p>
          </article>
        </div>

        <div className="actions-grid">
          {actionButtons.map(({ label, type, payload, variant, disableWhen }) => (
            <button
              key={type}
              className={`bank-btn ${variant}`}
              onClick={() =>
                dispatch({
                  type,
                  ...(payload !== null && { payload }),
                })
              }
              disabled={disableWhen(isActive)}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="footnote">
          Tip: open the account, make a few deposits, then request a loan to see the reducer in action.
        </p>
      </section>
    </main>
  );
}
