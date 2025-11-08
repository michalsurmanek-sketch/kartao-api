import { db } from "./db.js";

export function saveProviderLink(userId, provider, payload) {
  const map = db.providers.get(userId) || {};
  map[provider] = {
    provider_user_id: payload.provider_user_id || null,
    access_token: payload.access_token || null,
    connected_at: Date.now()
  };
  db.providers.set(userId, map);
  return map[provider];
}

export function buildMetricsFromProviders(userId) {
  const links = db.providers.get(userId) || {};
  const m = {};
  ["instagram","tiktok","youtube","facebook"].forEach(p=>{
    if (links[p]) {
      m[p] = { connected:true, followers: Math.floor(1000+Math.random()*50000), updatedAt: new Date().toISOString() };
    } else {
      m[p] = { connected:false, followers:null, updatedAt:null };
    }
  });
  return m;
}
