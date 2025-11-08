import { db } from "./db.js";

export function syncAllCards() {
  let count = 0;
  db.cards.forEach((card, slug)=>{
    const updated = { ...card };
    Object.keys(updated.metrics||{}).forEach(pid=>{
      const m = updated.metrics[pid];
      if (m?.connected && typeof m.followers === "number") {
        m.followers = Math.max(0, m.followers + Math.floor(Math.random()*50));
        m.updatedAt = new Date().toISOString();
      }
    });
    updated.updatedAt = Date.now();
    db.cards.set(slug, updated);
    count++;
  });
  return { updated: count };
}
