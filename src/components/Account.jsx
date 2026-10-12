export default function Account({ user }) {
  if (!user) return null;
  return (
    <section className="view">
      <div className="section-heading">
        <h2>My Account</h2>
        <p>Your membership details on file at Wisdom Archives.</p>
      </div>
      <div className="panel-card account-card">
        <div className="a-row"><span>Full name</span><span>{user.name}</span></div>
        <div className="a-row"><span>Membership ID</span><span>{user.membershipId}</span></div>
        <div className="a-row"><span>Role</span><span>{user.role}</span></div>
        <div className="a-row"><span>Username</span><span>{user.username}</span></div>
        <div className="a-row"><span>Member since</span><span>{user.joined}</span></div>
      </div>
    </section>
  );
}
