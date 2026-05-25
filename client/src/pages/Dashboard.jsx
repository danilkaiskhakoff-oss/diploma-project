import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollCode, setEnrollCode] = useState('');
  const [enrollError, setEnrollError] = useState('');
  const [newSubject, setNewSubject] = useState({ name: '', description: '', theme_color: '#3b82f6' });

  useEffect(() => {
    fetchSubjects();
    if (user.role === 'student') fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/courses/user/${user.id}`);
      const data = await res.json();
      setMyCourses(data);
    } catch (err) { console.error('Ошибка загрузки курсов:', err); }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    setEnrollError('');
    try {
      const res = await fetch(`${API_URL}/courses/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, access_code: enrollCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEnrollError(data.message);
        return;
      }
      setShowEnrollModal(false);
      setEnrollCode('');
      fetchMyCourses();
      navigate(`/course/${data.course.id}`);
    } catch (err) {
      setEnrollError('Ошибка подключения к серверу');
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${API_URL}/subjects`);
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      console.error('Ошибка загрузки предметов:', err);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSubject, teacher_id: user.id }),
      });
      if (res.ok) {
        setShowCreateModal(false);
        setNewSubject({ name: '', description: '', theme_color: '#3b82f6' });
        fetchSubjects();
      }
    } catch (err) {
      console.error('Ошибка создания предмета:', err);
    }
  };

  if (user.role === 'teacher') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">👨‍🏫 Кабинет преподавателя</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user.username}</span>
              <button onClick={() => { onLogout(); navigate('/auth'); }} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                Выйти
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">Мои предметы</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              + Создать предмет
            </button>
          </div>

          {subjects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">У вас пока нет предметов</h3>
              <p className="text-gray-500 mb-6">Создайте первый предмет, чтобы начать обучение студентов</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Создать предмет
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border border-gray-100 cursor-pointer"
                  onClick={() => navigate(`/subject/${subject.id}`)}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-4" style={{ backgroundColor: subject.theme_color }}>
                    {subject.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{subject.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{subject.description || 'Нет описания'}</p>
                  <div className="text-sm text-blue-600 font-medium">Управление курсами →</div>
                </div>
              ))}
            </div>
          )}
        </main>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Новый предмет</h3>
              <form onSubmit={handleCreateSubject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                  <input
                    type="text"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Например: Кибербезопасность"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                  <textarea
                    value={newSubject.description}
                    onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows="3"
                    placeholder="Краткое описание предмета"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Цвет темы</label>
                  <input
                    type="color"
                    value={newSubject.theme_color}
                    onChange={(e) => setNewSubject({ ...newSubject, theme_color: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                    Отмена
                  </button>
                  <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Создать
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">🎓 Кабинет студента</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.username}</span>
            <button onClick={() => { onLogout(); navigate('/auth'); }} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition">Выйти</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Мои курсы</h2>
          <button onClick={() => { setShowEnrollModal(true); setEnrollError(''); setEnrollCode(''); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">🔑 Записаться по коду</button>
        </div>

        {myCourses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Вы пока не записаны ни на один курс</h3>
            <p className="text-gray-500 mb-6">Попросите у преподавателя код доступа и введите его ниже</p>
            <button onClick={() => { setShowEnrollModal(true); setEnrollError(''); setEnrollCode(''); }} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">🔑 Ввести код доступа</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course) => (
              <div key={course.id} onClick={() => navigate(`/course/${course.id}`)} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border border-gray-100 cursor-pointer">
                <div className="text-xs text-gray-400 mb-1">{course.subject_name}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{course.description || 'Без описания'}</p>
                <div className="w-full py-2 rounded-lg border border-blue-600 text-blue-600 text-center hover:bg-blue-50 transition font-medium">Перейти к курсу</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">🔑 Записаться на курс</h3>
            <form onSubmit={handleEnroll} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Код доступа</label>
                <input
                  type="text"
                  value={enrollCode}
                  onChange={(e) => setEnrollCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                  placeholder="EDU-XXXXXX"
                  required
                />
              </div>
              {enrollError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{enrollError}</div>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowEnrollModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">Отмена</button>
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Записаться</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
