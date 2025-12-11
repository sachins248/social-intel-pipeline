import { useEffect, useState } from "react";

function App() {
  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    // Call your FastAPI backend
    fetch("http://127.0.0.1:8000/")
      .then((res) => res.json())
      .then((data) => setBackendData(data))
      .catch((err) => console.error("Error calling backend:", err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Social Intel Pipeline Dashboard</h1>
      <p>Frontend ↔ Backend test</p>

      <pre
        style={{
          marginTop: "1rem",
          background: "#111",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        {backendData ? JSON.stringify(backendData, null, 2) : "Loading..."}
      </pre>
    </div>
  );
}

export default App;
