export default function Invoices({
  invoices,
  invoiceFilter,
  setInvoiceFilter,
  selectedInvoice,
  setSelectedInvoice,
  generatePDF,
  toggleInvoiceStatus,
}) {
  const filteredInvoices =
    invoiceFilter === "all"
      ? invoices
      : invoices.filter((i) => i.status === invoiceFilter);

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
  Invoices
</h2>

      <p
        style={{
          fontSize: "12px",
          color: "#888",
          fontFamily: "DM Mono",
          marginTop: "4px",
        }}
      >
        Manage and download client invoices
      </p>

      <div style={{ display: "flex", gap: "8px", margin: "16px 0", flexWrap: "wrap" }}>
        {["all", "pending", "overdue", "paid"].map((f) => (
          <button
            key={f}
            onClick={() => setInvoiceFilter(f)}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid #ddd",
              background: invoiceFilter === f ? "#121214" : "white",
              color: invoiceFilter === f ? "white" : "#333",
              textTransform: "capitalize",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {f} (
              {f === "all"
                ? invoices.length
                : invoices.filter((i) => i.status === f).length}
            )
          </button>
        ))}
      </div>

      <div style={{ background: "#FFFDF9", border: "1px solid #EAE0D5" }}>
        {filteredInvoices.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#999",
            }}
          >
            No invoices found
          </div>
        ) : (
          filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              onClick={() => setSelectedInvoice(inv)}
              style={{
                padding: "16px",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                cursor: "pointer",
                background:
                  selectedInvoice?.id === inv.id
                    ? "#FFF0E8"
                    : "transparent",
              }}
            >
              <span style={{ flex: 1 }}>
                {inv.client} - {inv.items}
              </span>

              <span style={{ fontFamily: "DM Mono" }}>
                ${inv.amount}
              </span>

              <span
                style={{
                  marginLeft: "12px",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  background:
                    inv.status === "paid"
                      ? "#d4edda"
                      : inv.status === "overdue"
                      ? "#f8d7da"
                      : "#fff3cd",
                }}
              >
                {inv.status}
              </span>
            </div>
          ))
        )}
      </div>

      {selectedInvoice && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "white",
            border: "2px solid #E85D2A",
            borderRadius: "12px",
          }}
        >
          <h3 style={{ margin: 0 }}>
            Invoice #{selectedInvoice.id}
          </h3>

          <p style={{ fontSize: "13px" }}>
            Client: {selectedInvoice.client} | Amount: $
            {selectedInvoice.amount} | Status: {selectedInvoice.status}
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => generatePDF(selectedInvoice)}
              style={{
                padding: "10px 20px",
                background: "#E85D2A",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Download PDF
            </button>

            <button
              onClick={() => toggleInvoiceStatus(selectedInvoice)}
              style={{
                padding: "10px 20px",
                background: "#121214",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Toggle Paid/Pending
            </button>

            <button
  onClick={() => setSelectedInvoice(null)}
  style={{
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
        </div>
      )}
    </div>
  );
}