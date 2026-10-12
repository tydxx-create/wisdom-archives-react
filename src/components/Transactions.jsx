import { useState } from 'react';
import { isStaff } from '../store.js';

export default function Transactions({ user, books, transactions, onRecord }) {
  const allowed = isStaff(user);
  const [bookId, setBookId] = useState('');
  const [type, setType] = useState('restock');
  const [qty, setQty] = useState('1');

  const selectedBook = bookId || books[0]?.id || '';
  const rows = [...transactions].reverse();

  const submit = e => {
    e.preventDefault();
    onRecord(selectedBook, type, Number(qty));
  };

  return (
    <section className="view">
      <div className="section-heading">
        <h2>Transactions</h2>
        <p>
          {allowed
            ? 'Move stock in and out as books are borrowed and returned.'
            : 'Read-only history of stock movements at Wisdom Archives.'}
        </p>
      </div>

      {allowed && (
        <form className="panel-card form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="txBook">Book</label>
            <select id="txBook" required value={selectedBook} onChange={e => setBookId(e.target.value)}>
              {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="txType">Action</label>
            <select id="txType" required value={type} onChange={e => setType(e.target.value)}>
              <option value="restock">Add stock (new arrival)</option>
              <option value="borrow">Deduct stock (borrowed)</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="txQty">Quantity</label>
            <input id="txQty" type="number" min="1" required value={qty} onChange={e => setQty(e.target.value)} />
          </div>
          <div className="field form-actions">
            <button type="submit" className="btn btn-primary">Record Transaction</button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Date</th><th>Book</th><th>Action</th><th>Qty</th><th>Handled By</th></tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan="5" style={{ color: '#8a87ad' }}>No transactions recorded yet.</td></tr>
            ) : rows.map(t => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.bookTitle}</td>
                <td><span className={'tx-type ' + t.type}>{t.type === 'restock' ? 'Stock added' : 'Borrowed'}</span></td>
                <td>{t.quantity}</td>
                <td>{t.handledBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
