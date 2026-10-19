export default function Dashboard({
  user,
  greeting,
  todayDate,
  totalEarned,
  projects,
  invoicesDue,
  avgDailyRate,
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", lineHeight: "1.2" }}>
            {greeting}, {user.name}
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: "#888",
              fontFamily: "DM Mono",
              marginTop: "6px",
            }}
          >
            {todayDate}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          border: "1px solid #EAE0D5",
          background: "#FFFDF9",
          marginBottom: "24px",
        }}
      >
        <div style={{ padding: "20px", borderRight: "1px solid #EAE0D5", borderBottom: "1px solid #EAE0D5" }}>
          <div style={{ fontSize: "10px", color: "#999", fontFamily: "DM Mono" }}>TOTAL EARNED</div>
          <div style={{ fontSize: "32px", fontWeight: 700 }}>${totalEarned.toLocaleString()}</div>
        </div>

        <div style={{ padding: "20px", borderBottom: "1px solid #EAE0D5" }}>
          <div style={{ fontSize: "10px", color: "#999", fontFamily: "DM Mono" }}>ACTIVE PROJECTS</div>
          <div style={{ fontSize: "32px", fontWeight: 700 }}>{projects.length}</div>
        </div>

        <div style={{ padding: "20px", borderRight: "1px solid #EAE0D5" }}>
          <div style={{ fontSize: "10px", color: "#999", fontFamily: "DM Mono" }}>INVOICES DUE</div>
          <div style={{ fontSize: "32px", fontWeight: 700 }}>${invoicesDue.toLocaleString()}</div>
        </div>

        <div style={{ padding: "20px" }}>
          <div style={{ fontSize: "10px", color: "#999", fontFamily: "DM Mono" }}>AVG. PROJECT VALUE</div>
          <div style={{ fontSize: "32px", fontWeight: 700 }}>${avgDailyRate.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ background: "#FFFDF9", border: "1px solid #EAE0D5" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #EAE0D5", fontWeight: 600, fontSize: "13px" }}>
          Active Projects
        </div>

        {projects.map((p) => (
          <div
            key={p.id}
            style={{
              padding: "18px 20px",
              borderBottom: "1px solid #F0E6D9",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "14px" }}>{p.name}</div>
              <div style={{ fontSize: "11px", color: "#999", fontFamily: "DM Mono" }}>{p.client}</div>

              <div style={{ marginTop: "10px", height: "4px", background: "#F0E6D9", width: "90%" }}>
                <div
                  style={{
                    width: `${p.progress}%`,
                    height: "100%",
                    background: p.progress > 70 ? "#E85D2A" : "#121212",
                  }}
                />
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "DM Mono", fontWeight: 600, fontSize: "13px" }}>
                ${p.amount.toLocaleString()}
              </div>
              <div style={{ fontSize: "10px", color: "#999", fontFamily: "DM Mono" }}>
                {p.progress}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}