import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { useState } from "react";

import Clients from "../pages/Clients.jsx";
import Invoices from "../pages/Invoices.jsx";
import Login from "../pages/login.jsx";

// Clean up after every test
afterEach(() => {
  cleanup();
});

// CLIENTS TEST DATA
const projects = [
  { id: 1, name: "Website Design", client: "Acme Corp", amount: 1000, progress: 80 },
  { id: 2, name: "Mobile App", client: "Acme Corp", amount: 500, progress: 50 },
  { id: 3, name: "Logo Design", client: "Beta Ltd", amount: 200, progress: 100 },
  { id: 4, name: "Marketing", client: "Project Only", amount: 300, progress: 40 },
];

const invoices = [
  { id: 1, client: "Acme Corp", items: "Website Payment", amount: 700, status: "paid" },
  { id: 2, client: "Acme Corp", items: "App Payment", amount: 300, status: "pending" },
  { id: 3, client: "Beta Ltd", items: "Logo Invoice", amount: 200, status: "paid" },
  { id: 4, client: "Invoice Only", items: "Consultation", amount: 50, status: "pending" },
];

// CLIENTS COMPONENT TESTING
describe("Clients Component Unit Testing", () => {
  it("should display all unique clients", () => {
    render(<Clients projects={projects} invoices={invoices} />);

    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Beta Ltd")).toBeInTheDocument();
    expect(screen.getByText("Project Only")).toBeInTheDocument();
    expect(screen.getByText("Invoice Only")).toBeInTheDocument();
  });

  it("should not display duplicate clients", () => {
    render(<Clients projects={projects} invoices={invoices} />);

    expect(screen.getAllByText("Acme Corp")).toHaveLength(1);
  });

  it("should search clients by name", () => {
    render(<Clients projects={projects} invoices={invoices} />);

    fireEvent.change(screen.getByPlaceholderText("Search clients..."), {
      target: { value: "Acme" },
    });

    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.queryByText("Beta Ltd")).not.toBeInTheDocument();
  });

  it("should display no clients found for invalid search", () => {
    render(<Clients projects={projects} invoices={invoices} />);

    fireEvent.change(screen.getByPlaceholderText("Search clients..."), {
      target: { value: "Unknown" },
    });

    expect(screen.getByText("No clients found")).toBeInTheDocument();
  });

  it("should display the correct project count", () => {
    render(<Clients projects={projects} invoices={invoices} />);

    expect(screen.getByText("2 projects")).toBeInTheDocument();
    expect(screen.getAllByText("1 project")).toHaveLength(2);
  });

  it("should calculate the correct total billed amount", () => {
    render(<Clients projects={projects} invoices={invoices} />);

    expect(screen.getByText("Total Billed: $1,500")).toBeInTheDocument();
  });

  it("should calculate paid and outstanding invoice amounts", () => {
    render(<Clients projects={projects} invoices={invoices} />);

    fireEvent.click(screen.getByText("Acme Corp"));

    expect(
      screen.getByText(/Total Billed: \$1,500 \| Paid: \$700 \| Outstanding: \$300/)
    ).toBeInTheDocument();
  });

  it("should display selected client's project details", () => {
    render(<Clients projects={projects} invoices={invoices} />);

    fireEvent.click(screen.getByText("Acme Corp"));

    expect(screen.getByText("Website Design")).toBeInTheDocument();
    expect(screen.getByText("Mobile App")).toBeInTheDocument();
  });

  it("should display selected client's invoice details", () => {
    render(<Clients projects={projects} invoices={invoices} />);

    fireEvent.click(screen.getByText("Acme Corp"));

    expect(screen.getByText("Website Payment")).toBeInTheDocument();
    expect(screen.getByText("App Payment")).toBeInTheDocument();
  });

  it("should display no projects when client has no projects", () => {
    render(<Clients projects={projects} invoices={invoices} />);

    fireEvent.click(screen.getByText("Invoice Only"));

    expect(screen.getByText("No projects")).toBeInTheDocument();
  });

  it("should display no invoices when client has no invoices", () => {
    render(<Clients projects={projects} invoices={invoices} />);

    fireEvent.click(screen.getByText("Project Only"));

    expect(screen.getByText("No invoices")).toBeInTheDocument();
  });

  it("should close client details when Close button is clicked", () => {
    render(<Clients projects={projects} invoices={invoices} />);

    fireEvent.click(screen.getByText("Acme Corp"));

    expect(screen.getByText("Website Design")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByText("Website Design")).not.toBeInTheDocument();
  });

  it("should display no clients when projects and invoices are empty", () => {
    render(<Clients projects={[]} invoices={[]} />);

    expect(screen.getByText("No clients found")).toBeInTheDocument();
  });
});

// INVOICES TEST DATA
const invoiceData = [
  { id: 1, client: "Acme Corp", items: "Website", amount: 1000, status: "paid" },
  { id: 2, client: "Beta Ltd", items: "Mobile App", amount: 500, status: "pending" },
  { id: 3, client: "Gamma Ltd", items: "Logo", amount: 300, status: "overdue" },
];

// INVOICES TEST WRAPPER
function InvoiceTestWrapper({
  generatePDF = vi.fn(),
  toggleInvoiceStatus = vi.fn(),
}) {
  const [invoiceFilter, setInvoiceFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  return (
    <Invoices
      invoices={invoiceData}
      invoiceFilter={invoiceFilter}
      setInvoiceFilter={setInvoiceFilter}
      selectedInvoice={selectedInvoice}
      setSelectedInvoice={setSelectedInvoice}
      generatePDF={generatePDF}
      toggleInvoiceStatus={toggleInvoiceStatus}
    />
  );
}

// INVOICES COMPONENT TESTING
describe("Invoices Component Unit Testing", () => {
  it("should display all invoices", () => {
    render(<InvoiceTestWrapper />);

    expect(screen.getByText("Acme Corp - Website")).toBeInTheDocument();
    expect(screen.getByText("Beta Ltd - Mobile App")).toBeInTheDocument();
    expect(screen.getByText("Gamma Ltd - Logo")).toBeInTheDocument();
  });

  it("should filter pending invoices", () => {
    render(<InvoiceTestWrapper />);

    fireEvent.click(screen.getByRole("button", { name: /pending/i }));

    expect(screen.getByText("Beta Ltd - Mobile App")).toBeInTheDocument();
    expect(screen.queryByText("Acme Corp - Website")).not.toBeInTheDocument();
  });

  it("should filter overdue invoices", () => {
    render(<InvoiceTestWrapper />);

    fireEvent.click(screen.getByRole("button", { name: /overdue/i }));

    expect(screen.getByText("Gamma Ltd - Logo")).toBeInTheDocument();
    expect(screen.queryByText("Beta Ltd - Mobile App")).not.toBeInTheDocument();
  });

  it("should show no invoices when invoice list is empty", () => {
    render(
      <Invoices
        invoices={[]}
        invoiceFilter="all"
        setInvoiceFilter={vi.fn()}
        selectedInvoice={null}
        setSelectedInvoice={vi.fn()}
        generatePDF={vi.fn()}
        toggleInvoiceStatus={vi.fn()}
      />
    );

    expect(screen.getByText("No invoices found")).toBeInTheDocument();
  });

  it("should display selected invoice details", () => {
    render(<InvoiceTestWrapper />);

    fireEvent.click(screen.getByText("Acme Corp - Website"));

    expect(screen.getByText("Invoice #1")).toBeInTheDocument();
  });

  it("should call generatePDF when Download PDF is clicked", () => {
    const generatePDF = vi.fn();

    render(<InvoiceTestWrapper generatePDF={generatePDF} />);

    fireEvent.click(screen.getByText("Acme Corp - Website"));
    fireEvent.click(screen.getByRole("button", { name: "Download PDF" }));

    expect(generatePDF).toHaveBeenCalledWith(invoiceData[0]);
  });

  it("should call toggleInvoiceStatus when clicked", () => {
    const toggleInvoiceStatus = vi.fn();

    render(<InvoiceTestWrapper toggleInvoiceStatus={toggleInvoiceStatus} />);

    fireEvent.click(screen.getByText("Acme Corp - Website"));
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle Paid/Pending" })
    );

    expect(toggleInvoiceStatus).toHaveBeenCalledWith(invoiceData[0]);
  });

  it("should close selected invoice details", () => {
    render(<InvoiceTestWrapper />);

    fireEvent.click(screen.getByText("Acme Corp - Website"));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByText("Invoice #1")).not.toBeInTheDocument();
  });
});

// LOGIN TEST WRAPPER
function LoginTestWrapper({ handleLogin = vi.fn() }) {
  const [loginForm, setLoginForm] = useState({
    name: "",
    email: "",
  });

  return (
    <Login
      loginForm={loginForm}
      setLoginForm={setLoginForm}
      handleLogin={handleLogin}
    />
  );
}

// LOGIN COMPONENT TESTING
describe("Login Component Unit Testing", () => {
  it("should display the login form", () => {
    render(<LoginTestWrapper />);

    expect(
      screen.getByRole("heading", { name: "FreelanceOS" })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Your Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
  });

  it("should update the name input", () => {
    render(<LoginTestWrapper />);

    const nameInput = screen.getByPlaceholderText("Your Name");

    fireEvent.change(nameInput, {
      target: { value: "Ali" },
    });

    expect(nameInput).toHaveValue("Ali");
  });

  it("should update the email input", () => {
    render(<LoginTestWrapper />);

    const emailInput = screen.getByPlaceholderText("Email Address");

    fireEvent.change(emailInput, {
      target: { value: "ali@example.com" },
    });

    expect(emailInput).toHaveValue("ali@example.com");
  });

  it("should call handleLogin when Continue button is clicked", () => {
    const handleLogin = vi.fn();

    render(<LoginTestWrapper handleLogin={handleLogin} />);

    fireEvent.click(
      screen.getByRole("button", { name: /Continue to Workspace/i })
    );

    expect(handleLogin).toHaveBeenCalledTimes(1);
  });
});