
export default function Login({ loginForm, setLoginForm, handleLogin }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FDF5ED",
        fontFamily: "Outfit, sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          border: "1px solid #EAE0D5",
          width: "360px",
          textAlign: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>
          Freelance<span style={{ color: "#E85D2A" }}>OS</span>
        </h2>

        <p style={{ color: "#888", fontSize: "13px", marginTop: "8px" }}>
          Sign in to your workspace
        </p>

        <input
          value={loginForm.name}
          onChange={(e) =>
            setLoginForm({ ...loginForm, name: e.target.value })
          }
          placeholder="Your Name"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "24px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <input
          value={loginForm.email}
          onChange={(e) =>
            setLoginForm({ ...loginForm, email: e.target.value })
          }
          placeholder="Email Address"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            background: "#121214",
            color: "white",
            border: "none",
            borderRadius: "8px",
            marginTop: "16px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Continue to Workspace →
        </button>
      </div>
    </div>
  );
}