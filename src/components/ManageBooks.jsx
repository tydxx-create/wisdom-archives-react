import { useRef, useState } from 'react';
import { isStaff } from '../store.js';

const EMPTY = { title: '', author: '', genre: '', isbn: '', quantity: '' };

export default function ManageBooks({ user, books, onSave, onDelete }) {
  const allowed = isStaff(user);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState('');
  const formRef = useRef(null);

  const set = field => e => setForm({ ...form, [field]: e.target.value });
  const reset = () => { setForm(EMPTY); setEditId(''); };

  const startEdit = b => {
    setEditId(b.id);
    setForm({ title: b.title, author: b.author, genre: b.genre, isbn: b.isbn, quantity: String(b.quantity) });
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const submit = e => {
    e.preventDefault();
    onSave(editId, {
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      isbn: form.isbn.trim(),
      quantity: Number(form.quantity)
    });
    reset();
  };

  return (
    <section className="view">
      <div className="section-heading">
        <h2>Manage Books</h2>
        <p>Add new titles, edit details, or remove books no longer in our hands.</p>
      </div>

      {allowed && (
        <form className="panel-card form-grid" ref={formRef} onSubmit={submit}>
          <div className="field">
            <label htmlFor="bookTitle">Title</label>
            <input id="bookTitle" type="text" required placeholder="e.g. The Idiot" value={form.title} onChange={set('title')} />
          </div>
          <div className="field">
            <label htmlFor="bookAuthor">Author</label>
            <input id="bookAuthor" type="text" required placeholder="e.g. Fyodor Dostoevsky" value={form.author} onChange={set('author')} />
          </div>
          <div className="field">
            <label htmlFor="bookGenre">Genre</label>
            <input id="bookGenre" type="text" required placeholder="e.g. Classic Literature" value={form.genre} onChange={set('genre')} />
          </div>
          <div className="field">
            <label htmlFor="bookIsbn">ISBN</label>
            <input id="bookIsbn" type="text" required placeholder="978-0-000-00000-0" value={form.isbn} onChange={set('isbn')} />
          </div>
          <div className="field">
            <label htmlFor="bookQty">Initial Quantity</label>
            <input id="bookQty" type="number" min="0" required placeholder="0" value={form.quantity} onChange={set('quantity')} />
          </div>
          <div className="field form-actions">
            <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Add Book'}</button>
            {editId && <button type="button" className="btn btn-ghost" onClick={reset}>Cancel Edit</button>}
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Qty</th><th></th></tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id}>
                <td>{b.title}</td><td>{b.author}</td><td>{b.genre}</td><td>{b.isbn}</td><td>{b.quantity}</td>
                <td>
                  {allowed && (
                    <div className="row-actions">
                      <button className="btn btn-sm btn-ghost" onClick={() => startEdit(b)}>Update</button>
                      <button className="btn btn-sm btn-danger" onClick={() => onDelete(b.id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
