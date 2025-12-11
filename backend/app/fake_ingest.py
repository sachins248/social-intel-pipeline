import datetime
import random
import time

from .db import init_db, get_connection

TOPICS = ["netflix", "disney", "amazon", "hulu"]
SOURCES = ["fake_reddit", "fake_news", "fake_forum"]
MOODS = ["great", "terrible", "meh", "exciting", "boring"]


def insert_fake_post():
    conn = get_connection()
    cur = conn.cursor()

    now = datetime.datetime.utcnow().isoformat()
    topic = random.choice(TOPICS)
    source = random.choice(SOURCES)
    mood = random.choice(MOODS)

    text = f"This is a {mood} post about {topic}"

    # random sentiment between -1 and 1
    sentiment_score = random.uniform(-1.0, 1.0)
    if sentiment_score > 0.2:
        label = "positive"
    elif sentiment_score < -0.2:
        label = "negative"
    else:
        label = "neutral"

    cur.execute(
        """
        INSERT INTO posts (source, topic, text, created_at, ingested_at, sentiment_score, sentiment_label)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (source, topic, text, now, now, sentiment_score, label),
    )

    conn.commit()
    conn.close()


def main():
    print("Initializing DB and starting fake ingestion...")
    init_db()
    while True:
        insert_fake_post()
        print("Inserted a fake post")
        time.sleep(5)  # wait 5 seconds between posts


if __name__ == "__main__":
    main()
