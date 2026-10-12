
export const KEYS = { books: 'wa_books', users: 'wa_users', tx: 'wa_transactions', session: 'wa_session' };
export const STAFF_ROLES = ['admin', 'librarian'];
export const isStaff = user => !!user && STAFF_ROLES.includes(user.role);

const SEED_BOOKS = [
  ['Bobby Fischer Teaches Chess', 'Bobby Fischer', 'Strategy & Games', '978-0-553-26315-3', 4],
  ['My System', 'Aron Nimzowitsch', 'Strategy & Games', '978-1-85744-422-6', 1],
  ['Dragon Ball Super, Vol. 1', 'Akira Toriyama', 'Anime & Manga', '978-1-4215-8444-3', 3],
  ['Attack on Titan, Vol. 1', 'Hajime Isayama', 'Anime & Manga', '978-1-61262-025-8', 0],
  ['Crime and Punishment', 'Fyodor Dostoevsky', 'Classic Literature', '978-0-14-044913-6', 5],
  ['The Brothers Karamazov', 'Fyodor Dostoevsky', 'Classic Literature', '978-0-374-52837-9', 2],
  ['Notes from Underground', 'Fyodor Dostoevsky', 'Classic Literature', '978-0-679-73452-2', 1],
  ['The 48 Laws of Power', 'Robert Greene', 'Strategy & Power', '978-0-14-028019-7', 6],
  ['Mastery', 'Robert Greene', 'Strategy & Power', '978-0-14-312417-8', 3],
  ['The Art of Seduction', 'Robert Greene', 'Strategy & Power', '978-0-14-200119-3', 2],
  ['Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'Non-Fiction', '978-0-06-231609-7', 4],
  ['The Alchemist', 'Paulo Coelho', 'Fiction', '978-0-06-231500-7', 3],
  ['Atomic Habits', 'James Clear', 'Self-Help', '978-0-7352-1129-2', 5]
].map(([title, author, genre, isbn, quantity], i) => ({
  id: 'BK-' + String(i + 1).padStart(3, '0'), title, author, genre, isbn, quantity
}));

const SEED_USERS = [
  { id: 'U-001', name: 'Thabo Motete', membershipId: 'ADM-001', role: 'admin', username: 'thabo', password: 'thabo123', joined: '2026-01-12' },
  { id: 'U-002', name: 'Realeboha Dingane', membershipId: 'LIB-001', role: 'librarian', username: 'realeboha', password: 'realeboha123', joined: '2026-02-03' },
  { id: 'U-003', name: 'Reitumetse Moremoholo', membershipId: 'MEM-001', role: 'member', username: 'reitumetse', password: 'reitumetse123', joined: '2026-03-18' }
];

export function load(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* fall through to seed */ }
  return seed;
}
export const loadBooks = () => load(KEYS.books, SEED_BOOKS);
export const loadUsers = () => load(KEYS.users, SEED_USERS);
export const loadTx = () => load(KEYS.tx, []);
export const loadSessionUsername = () => load(KEYS.session, null)?.username ?? null;

export function nextId(prefix, list) {
  const max = list.reduce((m, item) => {
    const n = Number(String(item.id).split('-').pop());
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return prefix + '-' + String(max + 1).padStart(3, '0');
}
