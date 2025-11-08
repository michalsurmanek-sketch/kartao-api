export const db = {
  profiles: new Map(),  // key: userId
  cards: new Map(),     // key: slug
  providers: new Map()  // key: userId -> { instagram: {...}, ... }
};

export const saveProfile = (userId, data) =>
  db.profiles.set(userId, { ...(db.profiles.get(userId)||{}), ...data });
export const getProfile  = (userId) => db.profiles.get(userId) || null;

export const saveCard = (slug, data) => { db.cards.set(slug, data); return data; };
export const getCard  = (slug) => db.cards.get(slug) || null;
