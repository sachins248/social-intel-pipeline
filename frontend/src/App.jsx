import { useEffect, useState } from "react";

function App() {
  const [metrics, setMetrics] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [metricsRes, postsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/metrics`),
          fetch(`${BACKEND_URL}/posts?limit=10`),
        ]);

        if (!metricsRes.ok || !postsRes.ok) {
          throw new Error("Backend request failed");
        }

        const metricsJson = await metricsRes.json();
        const postsJson = await postsRes.json();

        setMetrics(metricsJson);
        setPosts(postsJson.posts || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Could not load data from backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Optional: refresh every 5 seconds to see new fake posts
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#f5f5f5",
        background: "#020617",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        Social Intel Pipeline Dashboard
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#94a3b8" }}>
        Live data from your FastAPI backend + SQLite DB (fake stream).
      </p>

      {loading && <p>Loading data…</p>}
      {error && <p style={{ color: "tomato" }}>{error}</p>}

      {!loading && !error && metrics && (
        <>
          {/* Metrics cards */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                padding: "1rem 1.5rem",
                background: "#0f172a",
                borderRadius: "0.75rem",
                border: "1px solid #1e293b",
                minWidth: "180px",
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                Total Posts
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 600 }}>
                {metrics.total_posts}
              </div>
            </div>

            <div
              style={{
                padding: "1rem 1.5rem",
                background: "#0f172a",
                borderRadius: "0.75rem",
                border: "1px solid #1e293b",
                minWidth: "180px",
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                Avg Sentiment
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 600 }}>
                {metrics.avg_sentiment !== null
                  ? metrics.avg_sentiment.toFixed(3)
                  : "N/A"}
              </div>
            </div>
          </div>

          {/* Recent posts */}
          <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
            Recent Posts
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  padding: "0.75rem 1rem",
                  background: "#020617",
                  borderRadius: "0.75rem",
                  border: "1px solid #1e293b",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#64748b",
                    marginBottom: "0.25rem",
                  }}
                >
                  <strong>{post.topic}</strong> · {post.source} ·{" "}
                  {post.sentiment_label || "unknown"}
                </div>
                <div style={{ fontSize: "0.95rem" }}>{post.text}</div>
              </div>
            ))}

            {posts.length === 0 && (
              <p style={{ color: "#64748b" }}>No posts yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
