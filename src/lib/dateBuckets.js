export function dateKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function lastNDays(n) {
  const days = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    days.push(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i));
  }
  return days;
}

export function dailyCounts(items, n) {
  const counts = {};
  for (const item of items) {
    const key = dateKey(item.created_at);
    counts[key] = (counts[key] || 0) + 1;
  }
  return lastNDays(n).map((d) => counts[dateKey(d)] || 0);
}
