import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TimeTracker from "../pages/TimeTracker";

describe("TimeTracker Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should display Time Tracker heading", () => {
    render(<TimeTracker />);
    expect(
      screen.getByRole("heading", { name: "Time Tracker" })
    ).toBeInTheDocument();
  });

  it("should display initial timer as 00:00:00", () => {
    render(<TimeTracker />);
    expect(screen.getByText("00:00:00")).toBeInTheDocument();
  });

  it("should display Ready to track status initially", () => {
    render(<TimeTracker />);
    expect(screen.getByText("Ready to track")).toBeInTheDocument();
  });

  it("should start the timer", () => {
    render(<TimeTracker />);
    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    expect(screen.getByText("Tracking active")).toBeInTheDocument();
  });

  it("should increase timer after one second", () => {
    render(<TimeTracker />);

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText("00:00:01")).toBeInTheDocument();
  });

  it("should stop the timer", () => {
    render(<TimeTracker />);

    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    fireEvent.click(screen.getByRole("button", { name: "Stop" }));

    expect(screen.getByText("Ready to track")).toBeInTheDocument();
  });

  it("should reset the timer", () => {
    render(<TimeTracker />);

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByText("00:00:00")).toBeInTheDocument();
    expect(screen.getByText("Ready to track")).toBeInTheDocument();
  });

  it("should display default hourly rate", () => {
    render(<TimeTracker />);

    expect(screen.getByLabelText("Hourly Rate")).toHaveValue(20);
  });

  it("should update hourly rate", () => {
    render(<TimeTracker />);

    const rateInput = screen.getByLabelText("Hourly Rate");
    fireEvent.change(rateInput, { target: { value: "30" } });

    expect(rateInput).toHaveValue(30);
  });

  it("should display zero estimated earnings initially", () => {
    render(<TimeTracker />);

    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("should disable Save Log when timer is zero", () => {
    render(<TimeTracker />);

    expect(
      screen.getByRole("button", { name: "Save Log" })
    ).toBeDisabled();
  });

  it("should show empty logs message initially", () => {
    render(<TimeTracker />);

    expect(screen.getByText("No time logs yet")).toBeInTheDocument();
  });

  it("should save a work session", () => {
    render(<TimeTracker />);

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Log" }));

    expect(screen.getByText("1 sessions")).toBeInTheDocument();
    expect(screen.getByText(/00:00:05/)).toBeInTheDocument();
    expect(screen.getByText("Work session")).toBeInTheDocument();
  });

  it("should reset timer after saving a log", () => {
    render(<TimeTracker />);

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Log" }));

    expect(screen.getByText("00:00:00")).toBeInTheDocument();
    expect(screen.getByText("Ready to track")).toBeInTheDocument();
  });

  it("should calculate estimated earnings correctly", () => {
    render(<TimeTracker />);

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    act(() => {
      vi.advanceTimersByTime(3600000);
    });

    expect(screen.getByText("$20.00")).toBeInTheDocument();
    expect(screen.getByText("1.00 hrs")).toBeInTheDocument();
  });
});