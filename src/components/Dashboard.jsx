export default function Dashboard({ books, users }) {
  const totalCopies = books.reduce((s, b) => s + Number(b.quantity), 0);
  const lowStock = books.filter(b => b.quantity < 2).length;

  return (
    <section className="view">
      <div className="hero">
        <p className="hero-eyebrow">Community Library Catalogue</p>
        <h1 className="hero-title">Browse the shelves of<br />Wisdom Archives</h1>
        <p className="hero-sub">Welcome at Wisdom Archives. How may we assisst you today</p>
      </div>

      <div className="stats-row">
        <div className="stat-card"><div className="num">{books.length}</div><div className="label">Titles in catalogue</div></div>
        <div className="stat-card"><div className="num">{totalCopies}</div><div className="label">Total copies held</div></div>
        <div className="stat-card warn"><div className="num">{lowStock}</div><div className="label">Titles low on stock</div></div>
        <div className="stat-card"><div className="num">{users.length}</div><div className="label">Registered members</div></div>
      </div>

      <div className="section-heading">
        <h2>Current Availability</h2>
        <p>Take a look at our established catalogue.</p>
      </div>
      <div className="book-grid">
        {books.map(b => (
          <div key={b.id} className={'book-card' + (b.quantity < 2 ? ' low-stock' : '')}>
            <span className="genre-tag">{b.genre}</span>
            <h3>{b.title}</h3>
            <p className="author">{b.author}</p>
            <div className="meta-row">
              <span>
                {b.quantity < 2 ? <span className="low-badge">Low stock</span> : 'ISBN ' + b.isbn}
              </span>
              <span className="qty">{b.quantity} in stock</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
