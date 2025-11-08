import { nanoid } from "nanoid";
import slugify from "slugify";

const s = v => slugify(String(v||"").toLowerCase(), { remove:/[*+~.()'"!:@/?]/g });

export function createCardFromProfile(profile={}, metricsMap={}) {
  const now = Date.now();
  const slug = s(profile.name || profile.handle || "profil") || `profil-${nanoid(6)}`;
  const platforms = ["instagram","tiktok","youtube","facebook"];

  const metrics = {};
  platforms.forEach(p=>{
    const m = metricsMap?.[p] || {};
    metrics[p] = {
      connected: !!m.connected,
      followers: Number.isFinite(Number(m.followers)) ? Number(m.followers) : null,
      updatedAt: m.updatedAt || null
    };
  });

  return {
    id: nanoid(),
    slug,
    name: profile.name || "Nový tvůrce",
    handle: profile.handle || `@${slug}`,
    city: profile.city || "Praha",
    category: profile.category || "Lifestyle",
    bio: profile.bio || "",
    avatar: profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name||"K")}`,
    cover: profile.cover || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    price: Number(profile.price||6000),
    rating: 4.6,
    verified: false,
    platforms: platforms.filter(p=> metrics[p]?.connected),
    metrics,
    gallery: profile.gallery || [],
    createdAt: now,
    updatedAt: now
  };
}
