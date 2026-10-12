import { useRef, useState } from 'react';
import { isStaff } from '../store.js';

const EMPTY = { name: '', membershipId: '', role: 'member', username: '', password: '' };

export default function Members({ user, users, onSave, onDelete }) {
  const allowed = isStaff(user);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState('');
  const formRef = useRef(null);

  const set = field => e => setForm({ ...form, [field]: e.target.value });
  const reset = () => { setForm(EMPTY); setEditId(''); };

  const startEdit = u => {
    setEditId(u.id);
    setForm({ name: u.name, membershipId: u.membershipId, role: u.role, username: u.username, password: u.password });
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const submit = e => {
    e.preventDefault();
    onSave(editId, {
      name: form.name.trim(),
      membershipId: form.membershipId.trim(),
      role: form.role,
      username: form.username.trim(),
      password: form.password.trim()
    });
    reset();
  };

  return (
    <section className="view">
      <div className="section-heading">
        <h2>Members Staff</h2>
        <p>Only admins and librarians may add, update, or remove accounts.</p>
      </div>

      {allowed && (
        <form className="panel-card form-grid" ref={formRef} onSubmit={submit}>
          <div className="field">
            <label htmlFor="userName">Full Name</label>
            <input id="userName" type="text" required value={form.name} onChange={set('name')} />
          </div>
          <div className="field">
            <label htmlFor="userMembership">Membership ID</label>
            <input id="userMembership" type="text" required value={form.membershipId} onChange={set('membershipId')} />
          </div>
          <div className="field">
            <label htmlFor="userRole">Role</label>
            <select id="userRole" required value={form.role} onChange={set('role')}>
              <option value="member">Member</option>
              <option value="librarian">Librarian</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="userUsername">Username</label>
            <input id="userUsername" type="text" required value={form.username} onChange={set('username')} />
          </div>
          <div className="field">
            <label htmlFor="userPassword">Password</label>
            <input id="userPassword" type="text" required value={form.password} onChange={set('password')} />
          </div>
          <div className="field form-actions">
            <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Add Member'}</button>
            {editId && <button type="button" className="btn btn-ghost" onClick={reset}>Cancel Edit</button>}
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Username</th><th>Joined</th><th></th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.membershipId}</td>
                <td><span className={'role-pill ' + u.role}>{u.role}</span></td>
                <td>{u.username}</td>
                <td>{u.joined}</td>
                <td>
                  {allowed && (
                    <div className="row-actions">
                      <button className="btn btn-sm btn-ghost" onClick={() => startEdit(u)}>Update</button>
                      <button className="btn btn-sm btn-danger" onClick={() => onDelete(u.id)}>Delete</button>
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
