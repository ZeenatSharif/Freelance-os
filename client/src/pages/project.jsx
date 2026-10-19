export default function Projects({ projects, updateProgress, deleteProject }) {
  return (
    <div>
      <h2>Projects - {projects.length}</h2>
      <p style={{ fontSize: "12px", color: "#888", fontFamily: "DM Mono" }}>
        Update progress to see changes on Dashboard progress bars
      </p>

      <div
        style={{
          background: "#FFFDF9",
          border: "1px solid #EAE0D5",
          marginTop: "16px",
        }}
      >
        {projects.map((p) => (
          <div
            key={p.id}
            style={{ padding: "16px", borderBottom: "1px solid #eee" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontWeight: 600 }}>
                {p.name} - {p.client}
              </span>
              <span>
                {p.progress}% | ${p.amount}
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="range"
                min="0"
                max="100"
                value={p.progress}
                onChange={(e) => updateProgress(p.id, e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                onClick={() => deleteProject(p.id)}
                style={{
                  background: "#ff4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}