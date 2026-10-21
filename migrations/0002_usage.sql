-- Also created on first use by server/usage.js for existing installations.
CREATE TABLE IF NOT EXISTS usage_daily (
  day TEXT NOT NULL,
  template_id TEXT NOT NULL,
  event TEXT NOT NULL,
  total INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, template_id, event)
);
