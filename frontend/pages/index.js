import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Loading…");

  useEffect(() => {
    fetch("/api/message")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        setMessage("Error: " + error.message);
      });
  }, []);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "3rem" }}>
      <h1>GitOps Project</h1>
      <p>This is the Next.js frontend for the GitOps demo.</p>
      <p>It fetches the backend microservice through the internal API route.</p>
      <p>
        <a href="/about">About page</a>
      </p>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <h2>Backend response</h2>
        <pre>{message}</pre>
      </div>
    </main>
  );
}
