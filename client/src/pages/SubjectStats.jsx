import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

function SubjectStats({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentLessons, setStudentLessons] = useState([]);

  useEffect(() => {
    fetchSubject();
    fetchStats();
  }, [id]);

  const fetchSubject = async () => {
    try {
      const res = await fetch(`${API_URL}/subjects/${id}`);
      const data = await res.json();
      setSubject(data);
    } catch (err) { console.error('Ошибка:', err); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats/subject/${id}`);
      const data = await res.json();
      setStudents(data.students);
    } catch (err) { console.error('Ошибка:', err); }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      const res = await fetch(`${API_URL}/stats/student/${studentId}/subject/${id}`);
      const data = await res.json();
      setStudentLessons(data.lessons);
      setSelectedStudent(studentId);
    } catch (err) { console.error('Ошибка:', err); }
  };

  if (!subject) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;

  const typeLabels = { text: 'Текст', quiz: 'Тест', video: 'Видео', image: 'Картинка' };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-800 transition">← Назад</button>
            <h1 className="text-2xl font-bold text-gray-800">📊 Статистика: {subject.name}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Карточки общего обзора */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Всего студентов</div>
            <div className="text-4xl font-extrabold text-blue-600">{students.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Средний прогресс</div>
            <div className="text-4xl font-extrabold text-green-600">
              {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.percentage, 0) / students.length) : 0}%
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Средний балл за тесты</div>
            <div className="text-4xl font-extrabold text-purple-600">
              {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.avg_score, 0) / students.length) : 0}
            </div>
          </div>
        </div>

        {/* Таблица студентов */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Прогресс студентов</h2>
          </div>
          {students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Пока нет студентов</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Студент</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Прогресс</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Уроки</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ср. балл</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <tr key={student.user_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{student.username}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-32 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${student.percentage >= 80 ? 'bg-green-500' : student.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${student.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-700">{student.percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.completed_lessons} / {student.total_lessons}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${student.avg_score >= 80 ? 'bg-green-100 text-green-700' : student.avg_score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                          {student.avg_score}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => fetchStudentDetails(student.user_id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Подробнее
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Детальная информация по студенту */}
        {selectedStudent && (
          <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Детали: {students.find(s => s.user_id === selectedStudent)?.username}
              </h2>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600 transition">✕ Закрыть</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Курс</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Урок</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Тип</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Балл</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {studentLessons.map((lesson, idx) => (
                    <tr key={`${lesson.course_id}-${lesson.lesson_id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-600">{lesson.course_title}</td>
                      <td className="px-6 py-3 font-medium text-gray-800">{lesson.lesson_title}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{typeLabels[lesson.lesson_type]}</td>
                      <td className="px-6 py-3">
                        {lesson.completed ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">✅ Пройден</span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">⏳ Не пройден</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {lesson.lesson_type === 'quiz' ? (
                          lesson.completed ? (
                            <span className="font-bold text-gray-800">{lesson.score}%</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )
                        ) : (
                          lesson.completed ? (
                            <span className="text-green-600 font-medium">✅</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SubjectStats;
