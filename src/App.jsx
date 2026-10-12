import { useCallback, useEffect, useRef, useState } from 'react';
import {
  KEYS, isStaff, nextId,
  loadBooks, loadUsers, loadTx, loadSessionUsername
} from './store.js';
import Navbar from './components/Navbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import ManageBooks from './components/ManageBooks.jsx';
import Transactions from './components/Transactions.jsx';
import Members from './components/Members.jsx';
import Account from './components/Account.jsx';
import Login from './components/Login.jsx';
import Toast from './components/Toast.jsx';

const today = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [books, setBooks] = useState(loadBooks);
  const [users, setUsers] = useState(loadUsers);
  const [transactions, setTransactions] = useState(loadTx);
  const [sessionUsername, setSessionUsername] = useState(loadSessionUsername);
  const [view, setView] = useState('dashboard');
  const [toastState, setToastState] = useState({ message: '', show: false });
  const toastTimer = useRef(null);

  // Persist to localStorage whenever data changes
  useEffect(() => { localStorage.setItem(KEYS.books, JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem(KEYS.users, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(KEYS.tx, JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => {
    if (sessionUsername) localStorage.setItem(KEYS.session, JSON.stringify({ username: sessionUsername }));
    else localStorage.removeItem(KEYS.session);
  }, [sessionUsername]);

  const user = users.find(u => u.username.toLowerCase() === String(sessionUsername).toLowerCase()) || null;

  const toast = useCallback(message => {
    setToastState({ message, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState(s => ({ ...s, show: false })), 2600);
  }, []);

  // ---- Navigation (with the same guards as the original) ----
  const navigate = target => {
    if ((target === 'books' || target === 'users') && !isStaff(user)) { setView('login'); toast('Staff login required.'); return; }
    if (target === 'transactions' && !user) { setView('login'); toast('Please log in to view transactions.'); return; }
    if (target === 'account' && !user) { setView('login'); return; }
    setView(target);
  };

  // ---- Auth ----
  const login = (username, password) => {
    const u = String(username || '').trim().toLowerCase();
    const p = String(password || '').trim();
    const match = users.find(usr => usr.username.trim().toLowerCase() === u && usr.password === p);
    if (!match) return false;
    setSessionUsername(match.username);
    toast(`Welcome back, ${match.name.split(' ')[0]}.`);
    setView('dashboard');
    return true;
  };

  const logout = () => {
    setSessionUsername(null);
    toast('Logged out. Browsing as guest.');
    setView('dashboard');
  };

  // ---- Books ----
  const saveBook = (id, data) => {
    if (!isStaff(user)) return;
    if (id) {
      setBooks(bs => bs.map(b => (b.id === id ? { ...b, ...data, id } : b)));
      toast('Book updated.');
    } else {
      setBooks(bs => [...bs, { id: nextId('BK', bs), ...data }]);
      toast('Book added.');
    }
  };

  const deleteBook = id => {
    if (!isStaff(user) || !confirm('Remove this title from the catalogue?')) return;
    setBooks(bs => bs.filter(b => b.id !== id));
    toast('Book removed.');
  };

  // ---- Transactions ----
  const recordTransaction = (bookId, type, qty) => {
    if (!isStaff(user)) { toast('Only admin or librarian accounts can record transactions.'); return; }
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    if (type === 'borrow' && qty > book.quantity) {
      toast(`Only ${book.quantity} cop${book.quantity === 1 ? 'y' : 'ies'} available.`);
      return;
    }
    const delta = type === 'restock' ? qty : -qty;
    setBooks(bs => bs.map(b => (b.id === bookId ? { ...b, quantity: b.quantity + delta } : b)));
    setTransactions(tx => [...tx, {
      id: nextId('TX', tx), bookId, bookTitle: book.title, type,
      quantity: qty, date: today(), handledBy: user.name
    }]);
    toast(type === 'restock' ? 'Stock added.' : 'Stock deducted.');
  };

  // ---- Members ----
  const saveUser = (id, data) => {
    if (!isStaff(user)) return;
    if (id) {
      setUsers(us => us.map(u => (u.id === id ? { ...u, ...data, id } : u)));
      toast('Member updated.');
    } else {
      setUsers(us => [...us, { id: nextId('U', us), ...data, joined: today() }]);
      toast('Member added.');
    }
  };

  const deleteUser = id => {
    if (!isStaff(user)) return;
    const target = users.find(u => u.id === id);
    if (target && user && target.username === user.username) {
      toast("You can't delete the account you're logged in as.");
      return;
    }
    if (!confirm('Remove this member from Wisdom Archives?')) return;
    setUsers(us => us.filter(u => u.id !== id));
    toast('Member removed.');
  };

  return (
    <>
      <Navbar view={view} user={user} onNavigate={navigate} onLogout={logout} />

      <main id="app">
        {view === 'dashboard' && <Dashboard books={books} users={users} />}
        {view === 'books' && <ManageBooks user={user} books={books} onSave={saveBook} onDelete={deleteBook} />}
        {view === 'transactions' && <Transactions user={user} books={books} transactions={transactions} onRecord={recordTransaction} />}
        {view === 'users' && <Members user={user} users={users} onSave={saveUser} onDelete={deleteUser} />}
        {view === 'account' && <Account user={user} />}
        {view === 'login' && <Login onLogin={login} />}
      </main>

      <Toast message={toastState.message} show={toastState.show} />

      <footer className="site-footer">
        <p>Enjoy your stay here at Wisdom Archives an abundant abyss of intellect and a safe space·</p>
      </footer>
    </>
  );
}
