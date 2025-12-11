from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import init_db, get_connection

app = FastAPI()

origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Ensure the database and table exist
    init_db()


@app.get("/")
def read_root():
    return {"status": "ok", "message": "Social Intel Pipeline backend is running"}


@app.get("/posts")
def list_posts(limit: int = 20):
    """Return the most recent posts."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, source, topic, text, created_at, sentiment_score, sentiment_label
        FROM posts
        ORDER BY id DESC
        LIMIT ?
        """,
        (limit,),
    )
    rows = [dict(row) for row in cur.fetchall()]
    conn.close()
    return {"posts": rows}


@app.get("/metrics")
def metrics():
    """Return simple metrics about posts."""
    conn = get_connection()
    cur = conn.cursor()

    # total posts
    cur.execute("SELECT COUNT(*) AS count FROM posts;")
    total_posts = cur.fetchone()["count"]

    # average sentiment (can be null if no posts yet)
    cur.execute("SELECT AVG(sentiment_score) AS avg_sentiment FROM posts;")
    row = cur.fetchone()
    avg_sentiment = row["avg_sentiment"]

    conn.close()
    return {"total_posts": total_posts, "avg_sentiment": avg_sentiment}
