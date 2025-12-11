from pathlib import Path
import sqlite3

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "app.db"


def get_connection():
    """Open a connection to the SQLite database."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # so we can get dict-like rows
    return conn


def init_db():
    """Create the posts table if it doesn't exist."""
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL,
            topic TEXT NOT NULL,
            text TEXT NOT NULL,
            created_at TEXT NOT NULL,
            ingested_at TEXT NOT NULL,
            sentiment_score REAL,
            sentiment_label TEXT
        );
        """
    )

    conn.commit()
    conn.close()
