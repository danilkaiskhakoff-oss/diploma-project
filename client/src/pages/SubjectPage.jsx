import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'https://diploma-project-2mei.onrender.com/api';

function SubjectPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [createdCode, setCreatedCode] = useState(null);

  useEffect(() => {
    fetchSubject();
    fetchCourses();
  }, [id]);

  const fetchSubject = async () => {
    try {
      const res = await fetch(`${API_URL}/subjects/${id}`);
      const data = await res.json();
      setSubject(data);
    } catch (err) { console.error('Ошибка загрузки предмета:', err); }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/courses/subject/${id}`);
      const data = await res.json();
      setCourses(data);
    } catch (err) { console.error('Ошибка загрузки курсов:', err); }
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({ title: '', description: '' });
    setCreatedCode(null);
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({ title: course.title, description: course.description || '' });
    setCreatedCode(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingCourse) {
        res = await fetch(`${API_URL}/courses/${editingCourse.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch(`${API_URL}/courses`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, subject_id: id }),
        });
        const data = await res.json();
        if (res.ok && data.access_code) setCreatedCode(data.access_code);
      }

      if (res.ok) {
        fetchCourses();
        if (!editingCourse) return;
        setShowModal(false);
      }
    } catch (err) { console.error('Ошибка сохранения курса:', err); }
  };

  const handleDelete = async (courseId) => {
    if (!confirm('Удалить курс? Все уроки и прогресс студентов будут потеряны.')) return;
    try {
      const res = await fetch(`${API_URL}/courses/${courseId}`, { method: 'DELETE' });
      if (res.ok) fetchCourses();
    } catch (err) { console.error('Ошибка удаления курса:', err); }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Код скопирован: ' + code);
  };

  if (!subject) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;

  const isTeacher = user?.role === 'teacher';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-800 transition">← Назад</button>
            <h1 className="text-2xl font-bold text-gray-800">{subject.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            {isTeacher && (
              <button onClick={() => navigate(`/subject/${id}/stats`)} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">📊 Статистика</button>
            )}
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition">В кабинет</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Описание предмета</h2>
          <p className="text-gray-600">{subject.description || 'Описание отсутствует'}</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Курсы</h2>
          {isTeacher && (
            <button onClick={openCreateModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">+ Добавить курс</button>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Курсов пока нет</h3>
            {isTeacher ? <p className="text-gray-500">Создайте первый курс для студентов</p> : <p className="text-gray-500">Преподаватель еще не добавил курсы</p>}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                <div onClick={() => navigate(`/course/${course.id}`)} className="p-6 cursor-pointer hover:bg-gray-50 transition">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{course.description || 'Без описания'}</p>
                  <div className="w-full py-2 rounded-lg border border-blue-600 text-blue-600 text-center hover:bg-blue-50 transition font-medium">Открыть курс</div>
                </div>
                
                {isTeacher && (
                  <div className="px-6 pb-4 border-t border-gray-100 pt-3 bg-gray-50 space-y-2">
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200">
                      <span className="text-xs text-gray-500">Код доступа:</span>
                      <span className="font-mono font-bold text-sm text-blue-700">{course.access_code}</span>
                      <button onClick={() => copyCode(course.access_code)} className="text-xs text-blue-600 hover:text-blue-800 ml-2">📋</button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(course)} className="flex-1 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Изменить</button>
                      <button onClick={() => handleDelete(course.id)} className="flex-1 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition">Удалить</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">{editingCourse ? 'Редактировать курс' : 'Новый курс'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Например: Введение в безопасность" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="3" />
              </div>

              {createdCode && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                  <p className="text-sm text-green-700 mb-1">✅ Курс создан! Код доступа:</p>
                  <p className="text-2xl font-mono font-bold text-green-800">{createdCode}</p>
                  <button type="button" onClick={() => copyCode(createdCode)} className="mt-2 text-sm text-green-600 hover:text-green-800 underline">Скопировать код</button>
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                  {createdCode ? 'Закрыть' : 'Отмена'}
                </button>
                {!createdCode && (
                  <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">{editingCourse ? 'Сохранить' : 'Создать'}</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectPage;
