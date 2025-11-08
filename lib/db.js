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
export const db = {
  cards: [
    {
      id: 'uuid',
      slug: 'marie-novotna',
      name: 'Marie Novotná',
      handle: '@mariemakeup',
      city: 'Praha',
      category: 'Krása',
      bio: 'Krása a životní styl.',
      avatar: 'https://example.com/avatar.jpg',
      cover: 'https://example.com/cover.jpg',
      price: 12000,
      rating: 4.6,
      verified: false,
      platforms: ['instagram', 'tiktok', 'youtube', 'facebook'],
      metrics: {
        instagram: { connected: true, followers: 53200, updatedAt: '2025-11-08' },
        tiktok: { connected: false, followers: 0, updatedAt: null },
        youtube: { connected: true, followers: 8100, updatedAt: '2025-11-08' },
        facebook: { connected: false, followers: 0, updatedAt: null },
      },
      gallery: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
      createdAt: 1731058000000,
      updatedAt: 1731059000000,
    },
  ],
  profiles: [],
};
