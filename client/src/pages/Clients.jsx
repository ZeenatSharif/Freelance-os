import { useState } from "react";

export default function Clients({ projects, invoices }) {
  const [search, setSearch] = useState("");
  const [selectedName, setSelectedName] = useState(null);

  const names = [
    ...new Set([...projects.map((p) => p.client), ...invoices.map((i) => i.client)]),
  ];

  const clients = names.map((name) => {
    const clientProjects = projects.filter((p) => p.client === name);
    const clientInvoices = invoices.filter((i) => i.client === name);
    return {
      name,
      projects: clientProjects,
      invoices: clientInvoices,
      totalBilled: clientProjects.reduce((a, b) => a + b.amount, 0),
      paid: clientInvoices
        .filter((i) => i.status === "paid")
        .reduce((a, b) => a + b.amount, 0),
      outstanding: clientInvoices
        .filter((i) => i.status !== "paid")
        .reduce((a, b) => a + b.amount, 0),
    };
  });

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedClient = clients.find((c) => c.name === selectedName) || null;

  return (
    <div>
      <h2
        style={{
          margin: 0,
          fontSize: "26px",
          fontWeight: 700,
          color: "#121214",
          letterSpacing: "-0.5px",
        }}
      >
        Clients
      </h2>

      <p
        style={{
          fontSize: "12px",
          color: "#888",
          fontFamily: "DM Mono",
          marginTop: "4px",
        }}
      >
        View your clients, their projects and billing
      </p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search clients..."
        style={{
          width: "100%",
          maxWidth: "320px",
          padding: "10px 12px",
          margin: "16px 0",
          borderRadius: "8px",
          border: "1px solid #ddd",
          fontSize: "13px",
        }}
      />

      <div style={{ background: "#FFFDF9", border: "1px solid #EAE0D5" }}>
        {filteredClients.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
            No clients found
          </div>
        ) : (
          filteredClients.map((c) => (
            <div
              key={c.name}
              onClick={() => setSelectedName(c.name)}
              style={{
                padding: "16px",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                cursor: "pointer",
                background: selectedName === c.name ? "#FFF0E8" : "transparent",
              }}
            >
              <span style={{ flex: 1, fontWeight: 600 }}>{c.name}</span>

              <span style={{ fontSize: "12px", color: "#888" }}>
                {c.projects.length} project{c.projects.length === 1 ? "" : "s"}
              </span>

              <span style={{ fontFamily: "DM Mono" }}>
                Total Billed: ${c.totalBilled.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>

      {selectedClient && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "white",
            border: "2px solid #E85D2A",
            borderRadius: "12px",
          }}
        >
          <h3 style={{ margin: 0 }}>{selectedClient.name}</h3>

          <p style={{ fontSize: "13px" }}>
            Total Billed: ${selectedClient.totalBilled.toLocaleString()} | Paid: $
            {selectedClient.paid.toLocaleString()} | Outstanding: $
            {selectedClient.outstanding.toLocaleString()}
          </p>

          <div style={{ fontSize: "12px", fontFamily: "DM Mono", color: "#888" }}>
            PROJECTS
          </div>
          {selectedClient.projects.length === 0 ? (
            <div style={{ fontSize: "13px", color: "#999", padding: "6px 0" }}>
              No projects
            </div>
          ) : (
            selectedClient.projects.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                  fontSize: "13px",
                }}
              >
                <span>{p.name}</span>
                <span style={{ fontFamily: "DM Mono" }}>
                  {p.progress}% | ${p.amount.toLocaleString()}
                </span>
              </div>
            ))
          )}

          <div
            style={{
              fontSize: "12px",
              fontFamily: "DM Mono",
              color: "#888",
              marginTop: "14px",
            }}
          >
            INVOICES
          </div>
          {selectedClient.invoices.length === 0 ? (
            <div style={{ fontSize: "13px", color: "#999", padding: "6px 0" }}>
              No invoices
            </div>
          ) : (
            selectedClient.invoices.map((inv) => (
              <div
                key={inv.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                  fontSize: "13px",
                }}
              >
                <span>{inv.items}</span>
                <span style={{ fontFamily: "DM Mono" }}>
                  ${inv.amount.toLocaleString()} | {inv.status}
                </span>
              </div>
            ))
          )}

          <button
            onClick={() => setSelectedName(null)}
            style={{
              marginTop: "16px",
              padding: "10px 20px",
              background: "#FFFFFF",
              color: "#121214",
              border: "1px solid #D8D8D8",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}