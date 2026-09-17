import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const INITIAL_FORM = { studentId: '', name: '', email: '' };

function App() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    const nextStudents = [...students].filter((student) => {
      const haystack = `${student.studentId} ${student.name} ${student.email}`.toLowerCase();
      return !term || haystack.includes(term);
    });

    nextStudents.sort((a, b) => {
      if (sortBy === 'studentId') {
        return a.studentId.localeCompare(b.studentId);
      }
      return a.name.localeCompare(b.name);
    });

    setFilteredStudents(nextStudents);
  }, [students, searchTerm, sortBy]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/students/${editingId}` : `${API_URL}/students`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Không thể lưu sinh viên');
      }

      setForm(INITIAL_FORM);
      setEditingId(null);
      await fetchStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });
    setEditingId(student._id);
    setError('');
  };

  const handleDelete = async (id) => {
    const student = students.find((item) => item._id === id);
    const confirmed = window.confirm(`Bạn có chắc muốn xóa sinh viên ${student?.name || 'này'}?`);

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Không thể xóa sinh viên');
      }

      if (editingId === id) {
        setForm(INITIAL_FORM);
        setEditingId(null);
      }

      await fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setError('');
  };

  return (
    <div className="app-shell">
      <div className="panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Student Management</p>
            <h1>Quản lý sinh viên</h1>
          </div>
        </header>

        {error && <p className="error-box" role="alert">{error}</p>}

        <form className="student-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label>MSSV</label>
            <input
              type="text"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              placeholder="VD: SV001"
              required
            />
          </div>

          <div className="field-group">
            <label>Họ tên</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="VD: Nguyễn Văn A"
              required
            />
          </div>

          <div className="field-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="VD: a@gmail.com"
              required
            />
          </div>

          <div className="actions">
            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isSubmitting ? (editingId ? 'Đang cập nhật...' : 'Đang thêm...') : (editingId ? 'Cập nhật' : 'Thêm sinh viên')}
            </button>

            {editingId && (
              <button type="button" className="secondary-btn" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
        </form>

        <section className="list-card">
          <div className="list-header">
            <h2>Danh sách sinh viên</h2>
            <span>{filteredStudents.length} bản ghi</span>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo MSSV, tên hoặc email"
              />
            </div>

            <div className="sort-box">
              <label>Sắp xếp</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Tên</option>
                <option value="studentId">MSSV</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <p className="empty-state">Đang tải dữ liệu...</p>
          ) : filteredStudents.length === 0 ? (
            <p className="empty-state">{searchTerm ? 'Không tìm thấy sinh viên phù hợp.' : 'Chưa có sinh viên nào.'}</p>
          ) : (
            <ul className="student-list">
              {filteredStudents.map((student) => (
                <li key={student._id} className="student-item">
                  <div className="student-info">
                    <strong>{student.studentId}</strong>
                    <span>{student.name}</span>
                    <small>{student.email}</small>
                  </div>

                  <div className="student-actions">
                    <button type="button" className="edit-btn" onClick={() => handleEdit(student)}>
                      Sửa
                    </button>
                    <button type="button" className="delete-btn" onClick={() => handleDelete(student._id)}>
                      Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;