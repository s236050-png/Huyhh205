import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/students`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Không thể tải danh sách sinh viên');
      }

      setStudents(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(fetchStudents, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Không thể thêm sinh viên');
      }

      setForm({ studentId: '', name: '', email: '' });
      await fetchStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Không thể xóa sinh viên');
      }

      await fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Quản Lý Sinh Viên</h1>

      {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input 
          placeholder="MSSV" 
          value={form.studentId} 
          onChange={e => setForm({...form, studentId: e.target.value})} 
          required 
        />
        <input 
          placeholder="Họ và Tên" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          required 
        />
        <input 
          placeholder="Email" 
          value={form.email} 
          onChange={e => setForm({...form, email: e.target.value})} 
          required 
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang thêm...' : 'Thêm sinh viên'}
        </button>
      </form>

      <h2>Danh sách sinh viên</h2>
      <ul>
        {students.map(std => (
          <li key={std._id} style={{ marginBottom: '8px' }}>
            {std.studentId} - {std.name} ({std.email}) 
            <button onClick={() => handleDelete(std._id)} style={{ marginLeft: '10px' }}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;