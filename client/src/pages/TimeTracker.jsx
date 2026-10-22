import { useEffect, useState } from "react";
import "./TimeTracker.css";

export default function TimeTracker() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(20);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return [hours, minutes, secs]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };

  const earned = (seconds / 3600) * Number(hourlyRate || 0);

  const saveLog = () => {
    if (seconds === 0) {
      alert("Start the timer before saving a log.");
      return;
    }

    setLogs((previous) => [
      {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        duration: formatTime(seconds),
        seconds,
        rate: Number(hourlyRate),
        earned,
      },
      ...previous,
    ]);

    setSeconds(0);
    setRunning(false);
  };

  const resetTimer = () => {
    setRunning(false);
    setSeconds(0);
  };

  return (
    <main className="tracker-page">
      <header className="tracker-header">
        <div>
          <p className="tracker-eyebrow">WORKSPACE / TRACKING</p>
          <h1>Time Tracker</h1>
          <p className="tracker-subtitle">
            Track your work. Know what your time is worth.
          </p>
        </div>
        <span className="tracker-status">
          <span className="status-dot" />
          {running ? "Tracking active" : "Ready to track"}
        </span>
      </header>

      <section className="tracker-card">
        <p className="tracker-label">TOTAL TIME</p>
        <div className="tracker-time">{formatTime(seconds)}</div>

        <div className="tracker-actions">
          <button
            className="tracker-button primary"
            onClick={() => setRunning(!running)}
          >
            {running ? "Stop" : "Start"}
          </button>

          <button
            className="tracker-button secondary"
            onClick={resetTimer}
          >
            Reset
          </button>

          <button
            className="tracker-button secondary"
            onClick={saveLog}
            disabled={seconds === 0}
          >
            Save Log
          </button>
        </div>
      </section>

      <section className="tracker-stats">
        <article className="tracker-stat">
          <label htmlFor="hourly-rate">Hourly Rate</label>
          <div className="rate-input">
            <span>$</span>
            <input
              id="hourly-rate"
              type="number"
              min="0"
              step="0.5"
              value={hourlyRate}
              onChange={(event) =>
                setHourlyRate(event.target.value)
              }
            />
            <span>/ hr</span>
          </div>
        </article>

        <article className="tracker-stat">
          <p>Time Worked</p>
          <h2>{(seconds / 3600).toFixed(2)} hrs</h2>
        </article>

        <article className="tracker-stat">
          <p>Estimated Earnings</p>
          <h2>${earned.toFixed(2)}</h2>
        </article>
      </section>

      <section className="tracker-card logs-card">
        <div className="logs-heading">
          <div>
            <h2>Time Logs</h2>
            <p>Your saved work sessions</p>
          </div>
          <span className="logs-count">{logs.length} sessions</span>
        </div>

        {logs.length === 0 ? (
          <div className="empty-logs">
            <h3>No time logs yet</h3>
            <p>Start tracking and save your first work session.</p>
          </div>
        ) : (
          <div className="logs-list">
            {logs.map((log) => (
              <article className="log-row" key={log.id}>
                <div>
                  <strong>Work session</strong>
                  <p>{log.date} · {log.duration}</p>
                </div>
                <strong>${log.earned.toFixed(2)}</strong>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}