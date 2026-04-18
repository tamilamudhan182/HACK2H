/**
 * AuthGuard — wraps protected routes so only signed-in users can access them.
 * Shows a beautiful sign-in prompt if the user is not authenticated.
 *
 * @param {{ children: React.ReactNode }} props
 */
import { useAuth } from "../context/AuthContext";

function AuthGuard({ children }) {
  const { user, loading, error, signIn } = useAuth();

  if (loading) {
    return (
      <div className="loading-skeleton fade-in" style={{ flexDirection: "column", gap: "16px" }}>
        <div style={{ fontSize: "2rem" }}>🔐</div>
        <span>Signing you in…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="fade-in"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--spacing-4)",
          padding: "var(--spacing-4)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "4rem" }}>🏟️</div>
        <h1
          style={{
            fontSize: "2.2rem",
            background: "linear-gradient(to right, #d4af37, #fff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Smart Event Companion
        </h1>
        <p style={{ color: "var(--color-text-muted)", maxWidth: "360px", lineHeight: 1.7 }}>
          Your all-in-one venue companion — wallet, heatmap, queues, and emergency alerts.
        </p>

        {error && (
          <p
            role="alert"
            style={{
              color: "var(--color-danger)",
              background: "rgba(239,35,60,0.1)",
              border: "1px solid rgba(239,35,60,0.3)",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </p>
        )}

        <button
          id="btn-google-signin"
          className="btn-primary"
          onClick={signIn}
          aria-label="Sign in with Google to access Smart Event Companion"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 32px",
            fontSize: "1rem",
          }}
        >
          <span>🔑</span> Continue with Google
        </button>

        <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
          Secured with OAuth 2.0 · Data encrypted in transit
        </p>
      </div>
    );
  }

  return children;
}

export default AuthGuard;
