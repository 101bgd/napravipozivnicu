// First-party action counters only. Never send user input or a visitor identifier.
export function recordUsage(templateId, event) {
  if (!['napravipozivnicu.com', 'www.napravipozivnicu.com'].includes(location.hostname) || navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  void fetch('/api/usage', {
    method: 'POST', credentials: 'omit', keepalive: true, referrerPolicy: 'no-referrer',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ templateId, event }),
  }).catch(() => {});
}
