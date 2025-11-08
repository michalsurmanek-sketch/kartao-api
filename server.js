import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { saveProfile, getProfile, saveCard, getCard } from "./lib/db.js";
import { createCardFromProfile } from "./lib/card.js";
import { saveProviderLink, buildMetricsFromProviders } from "./lib/oauth.js";
import { syncAllCards } from "./lib/sync.js";

const app = express();
const PORT = process.env.PORT || 8787;
const ORIGIN = process.env.ORIGIN || "*";
const ADMIN_KEY = process.env.ADMIN_KEY || "kartao-dev";
const JWT_SECRET = process.env.JWT_SECRET || "secret";

app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());

// demo auth
function userFromAuth(req) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (token) { try { return jwt.verify(token, JWT_SECRET).sub; } catch {} }
  return req.query.userId || null; // fallback pro demo
}
function requireUser(req, res, next) {
  const userId = userFromAuth(req);
  if (!userId) return res.status(401).json({ error: "unauthorized" });
  req.userId = userId;
  next();
}

// admin token z klíče
app.post("/admin/token", (req, res)=>{
  const { key } = req.body || {};
  if (key === ADMIN_KEY) {
    const token = jwt.sign({ role:"admin" }, JWT_SECRET, { subject:"admin", expiresIn:"12h" });
    return res.json({ token });
  }
  res.json({ error: "invalid_key" });
});

// profil
app.post("/api/profile", requireUser, (req, res)=>{
  const data = req.body || {};
  saveProfile(req.userId, data);
  res.json({ ok:true });
});
app.get("/api/profile", requireUser, (req, res)=>{
  res.json({ profile: getProfile(req.userId) || null });
});

// karta
app.post("/api/card", requireUser, (req, res)=>{
  const profile = getProfile(req.userId) || {};
  const metrics = buildMetricsFromProviders(req.userId);
  const card = createCardFromProfile({ ...profile, ...req.body }, metrics);
  saveCard(card.slug, card);
  res.json({ card });
});
app.get("/api/card/:slug", (req, res)=>{
  const card = getCard(req.params.slug);
  if (!card) return res.status(404).json({ error:"not_found" });
  res.json({ card });
});

// oauth callback
app.post("/api/oauth/:provider/callback", requireUser, (req, res)=>{
  const { provider } = req.params;
  const { provider_user_id, access_token } = req.body || {};
  if (!provider_user_id || !access_token) {
    return res.status(400).json({ error:"missing_fields" });
  }
  const link = saveProviderLink(req.userId, provider, { provider_user_id, access_token });
  res.json({ ok:true, link });
});

// sync metrik (mock)
app.post("/api/social/sync", (req, res)=>{
  res.json(syncAllCards());
});

app.listen(PORT, ()=> console.log(`Kartao API on :${PORT}`));
