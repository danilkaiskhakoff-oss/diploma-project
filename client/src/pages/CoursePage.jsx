import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'https://diploma-project-2mei.onrender.com/api';

function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isUpdatingRef.current = false;
  }, [value]);

  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <button type="button" onClick={() => execCmd('bold')} className="p-1.5 hover:bg-gray-200 rounded text-sm font-bold" title="Жирный">B</button>
        <button type="button" onClick={() => execCmd('italic')} className="p-1.5 hover:bg-gray-200 rounded text-sm italic" title="Курсив">I</button>
        <button type="button" onClick={() => execCmd('underline')} className="p-1.5 hover:bg-gray-200 rounded text-sm underline" title="Подчеркнутый">U</button>
        <button type="button" onClick={() => execCmd('strikeThrough')} className="p-1.5 hover:bg-gray-200 rounded text-sm line-through" title="Зачеркнутый">S</button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button type="button" onClick={() => execCmd('formatBlock', 'h2')} className="p-1.5 hover:bg-gray-200 rounded text-sm font-bold" title="Заголовок">H2</button>
        <button type="button" onClick={() => execCmd('formatBlock', 'h3')} className="p-1.5 hover:bg-gray-200 rounded text-sm font-semibold" title="Подзаголовок">H3</button>
        <button type="button" onClick={() => execCmd('formatBlock', 'p')} className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Параграф">P</button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button type="button" onClick={() => execCmd('insertUnorderedList')} className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Маркированный список">• Список</button>
        <button type="button" onClick={() => execCmd('insertOrderedList')} className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Нумерованный список">1. Список</button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button type="button" onClick={() => execCmd('justifyLeft')} className="p-1.5 hover:bg-gray-200 rounded text-sm" title="По левому краю">⫷</button>
        <button type="button" onClick={() => execCmd('justifyCenter')} className="p-1.5 hover:bg-gray-200 rounded text-sm" title="По центру">☰</button>
        <button type="button" onClick={() => execCmd('justifyRight')} className="p-1.5 hover:bg-gray-200 rounded text-sm" title="По правому краю">⫸</button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button type="button" onClick={() => { const url = prompt('Введите URL:'); if (url) execCmd('createLink', url); }} className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Ссылка">🔗</button>
        <button type="button" onClick={() => execCmd('removeFormat')} className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Очистить форматирование">✕</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto outline-none text-gray-800 editor-content"
        data-placeholder={placeholder}
      />
      <style>{`
        [contentEditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        .editor-content h2 { font-size: 1.5rem; font-weight: bold; margin: 0.75rem 0 0.5rem; }
        .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.5rem 0; }
        .editor-content p { margin: 0.25rem 0; line-height: 1.6; }
        .editor-content ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .editor-content ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .editor-content li { margin: 0.25rem 0; line-height: 1.5; }
        .editor-content a { color: #2563eb; text-decoration: underline; }
        .editor-content blockquote { border-left: 3px solid #d1d5db; padding-left: 1rem; color: #6b7280; margin: 0.5rem 0; }
      `}</style>
    </div>
  );
}

function getVideoEmbedUrl(url) {
  if (!url) return null;
  const rutubeMatch = url.match(/rutube\.ru\/video\/([a-f0-9]+)\/?/);
  if (rutubeMatch) return `https://rutube.ru/play/embed/${rutubeMatch[1]}/`;
  if (url.includes('vk.com/video_ext.php')) return url;
  if (url.includes('/embed/') || url.includes('/play/embed/')) return url;
  return null;
}

function CoursePage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({ lessons: [], total: 0, completed: 0, percentage: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [newLesson, setNewLesson] = useState({ title: '', type: 'text', content: '', mediaUrl: '', questions: [] });
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(true);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollCode, setEnrollCode] = useState('');
  const [enrollError, setEnrollError] = useState('');
  
  // Состояния для домашних заданий
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [homeworkContent, setHomeworkContent] = useState('');
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });

  useEffect(() => {
    fetchCourse();
    fetchLessons();
    if (user?.role === 'student') {
      fetchProgress();
      checkEnrollment();
    }
  }, [id]);

  const checkEnrollment = async () => {
    try {
      const res = await fetch(`${API_URL}/courses/${id}/enrolled/${user.id}`);
      const data = await res.json();
      setIsEnrolled(data.enrolled);
    } catch (err) { console.error('Ошибка проверки записи:', err); }
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
      if (!res.ok) { setEnrollError(data.message); return; }
      setShowEnrollModal(false);
      setEnrollCode('');
      setIsEnrolled(true);
      fetchProgress();
    } catch (err) { setEnrollError('Ошибка подключения'); }
  };

  useEffect(() => {
    if (lessons.length > 0 && user?.role === 'student' && progress.lessons.length > 0) {
      const firstUncompleted = lessons.find(l => !isLessonCompleted(l.id));
      if (firstUncompleted && !selectedLesson) {
        setSelectedLesson(firstUncompleted);
      }
    }
  }, [lessons, progress]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`${API_URL}/courses/${id}`);
      const data = await res.json();
      setCourse(data);
    } catch (err) { console.error('Ошибка загрузки курса:', err); }
  };

  const fetchLessons = async () => {
    try {
      const res = await fetch(`${API_URL}/lessons/course/${id}`);
      const data = await res.json();
      setLessons(data);
    } catch (err) { console.error('Ошибка загрузки уроков:', err); }
  };

  const fetchProgress = async () => {
    try {
      const res = await fetch(`${API_URL}/progress/course/${id}/user/${user.id}`);
      const data = await res.json();
      setProgress(data);
    } catch (err) { console.error('Ошибка загрузки прогресса:', err); }
  };

  const markComplete = async (lessonId, score = 0) => {
    try {
      const res = await fetch(`${API_URL}/progress/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, lesson_id: lessonId, score }),
      });
      if (res.ok) {
        fetchProgress();
        const lessonIdx = lessons.findIndex(l => l.id === lessonId);
        if (lessonIdx < lessons.length - 1) {
          setSelectedLesson(lessons[lessonIdx + 1]);
        }
      }
    } catch (err) { console.error('Ошибка сохранения прогресса:', err); }
  };

  const isLessonCompleted = (lessonId) => progress.lessons?.find(l => l.lesson_id === lessonId)?.completed;

  const getLessonStatus = (lesson, idx) => {
    if (isLessonCompleted(lesson.id)) return 'completed';
    if (idx === 0) return 'available';
    const prevLesson = lessons[idx - 1];
    if (prevLesson && isLessonCompleted(prevLesson.id)) return 'available';
    return 'locked';
  };

  const openCreateModal = () => {
    setEditingLesson(null);
    setNewLesson({ title: '', type: 'text', content: '', mediaUrl: '', questions: [] });
    setShowModal(true);
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    let parsedContent = { text: '', url: '' };
    let questions = [];
    try {
      if (lesson.type === 'quiz') questions = JSON.parse(lesson.content);
      else if (lesson.type === 'video' || lesson.type === 'image') parsedContent = JSON.parse(lesson.content);
    } catch (e) {
      if (lesson.type === 'text') parsedContent.text = lesson.content;
    }
    setNewLesson({
      title: lesson.title, type: lesson.type,
      content: parsedContent.text || lesson.content,
      mediaUrl: parsedContent.url || '', questions,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let contentToSend = newLesson.content;
      if (newLesson.type === 'quiz') contentToSend = JSON.stringify(newLesson.questions);
      else if (newLesson.type === 'video' || newLesson.type === 'image') contentToSend = JSON.stringify({ text: newLesson.content, url: newLesson.mediaUrl });

      let res;
      if (editingLesson) {
        res = await fetch(`${API_URL}/lessons/${editingLesson.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newLesson, content: contentToSend }),
        });
      } else {
        res = await fetch(`${API_URL}/lessons`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newLesson, content: contentToSend, course_id: id }),
        });
      }
      if (res.ok) { setShowModal(false); fetchLessons(); }
    } catch (err) { console.error('Ошибка сохранения урока:', err); }
  };

  const handleDelete = async (lessonId) => {
    if (!confirm('Удалить этот урок?')) return;
    try {
      const res = await fetch(`${API_URL}/lessons/${lessonId}`, { method: 'DELETE' });
      if (res.ok) { fetchLessons(); if (selectedLesson?.id === lessonId) setSelectedLesson(null); }
    } catch (err) { console.error('Ошибка удаления урока:', err); }
  };

  // Обработчики домашних заданий
  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/homework`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id: selectedLesson.id, title: 'Домашнее задание', description: homeworkContent }),
      });
      setShowHomeworkForm(false);
      fetchHomework(selectedLesson.id);
    } catch (err) { console.error('Ошибка сохранения ДЗ:', err); }
  };

  const handleSubmitHomework = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/homework/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignment_id: assignment.id, student_id: user.id, content: homeworkContent }),
      });
      fetchHomework(selectedLesson.id);
    } catch (err) { console.error('Ошибка отправки ДЗ:', err); }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/homework/grade/${gradingSubmission.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gradeData),
      });
      setGradingSubmission(null);
      fetchHomework(selectedLesson.id);
    } catch (err) { console.error('Ошибка оценки:', err); }
  };

  const addQuestion = () => {
    setNewLesson({ ...newLesson, questions: [...newLesson.questions, { question: '', options: ['', '', '', ''], correctIndex: 0 }] });
  };

  const updateQuestion = (qIdx, field, value) => {
    const updated = [...newLesson.questions];
    updated[qIdx][field] = value;
    setNewLesson({ ...newLesson, questions: updated });
  };

  const updateOption = (qIdx, optIdx, value) => {
    const updated = [...newLesson.questions];
    updated[qIdx].options[optIdx] = value;
    setNewLesson({ ...newLesson, questions: updated });
  };

  const selectLesson = (lesson) => {
    if (user?.role === 'student') {
      const idx = lessons.findIndex(l => l.id === lesson.id);
      if (getLessonStatus(lesson, idx) === 'locked') return;
    }
    setSelectedLesson(lesson);
    setQuizAnswers({});
    setQuizResults({});
    
    // Загружаем данные о домашнем задании при выборе урока
    fetchHomework(lesson.id);
  };

  const fetchHomework = async (lessonId) => {
    try {
      const res = await fetch(`${API_URL}/homework/lesson/${lessonId}`);
      const data = await res.json();
      setAssignment(data);
      setShowHomeworkForm(false);
      setGradingSubmission(null);
      setGradeData({ grade: '', feedback: '' });

      if (data) {
        if (isTeacher) {
          const resSub = await fetch(`${API_URL}/homework/submissions/${data.id}`);
          setSubmissions(await resSub.json());
        } else if (isStudent) {
          const resMy = await fetch(`${API_URL}/homework/my-submission/${data.id}/${user.id}`);
          const mySub = await resMy.json();
          setSubmission(mySub);
          if (mySub) setHomeworkContent(mySub.content);
        }
      }
    } catch (err) { console.error('Ошибка загрузки ДЗ:', err); }
  };

  const checkQuizAnswer = (qIdx, optIdx) => {
    const questions = JSON.parse(selectedLesson.content);
    const isCorrect = questions[qIdx].correctIndex === optIdx;
    const newResults = { ...quizResults, [qIdx]: isCorrect };
    setQuizResults(newResults);

    const allAnswered = Object.keys(newResults).length === questions.length;
    if (allAnswered) {
      const correctCount = Object.values(newResults).filter(v => v).length;
      const score = Math.round((correctCount / questions.length) * 100);
      markComplete(selectedLesson.id, score);
    }
  };

  if (!course) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  if (isStudent && !isEnrolled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow border border-gray-100 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Курс "{course.title}"</h2>
          <p className="text-gray-500 mb-6">Для доступа к курсу введите код, который дал преподаватель</p>
          <form onSubmit={handleEnroll} className="space-y-4">
            <input
              type="text"
              value={enrollCode}
              onChange={(e) => setEnrollCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              placeholder="EDU-XXXXXX"
              required
            />
            {enrollError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{enrollError}</div>}
            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Записаться</button>
          </form>
          <button onClick={() => navigate(-1)} className="mt-4 text-gray-400 hover:text-gray-600 text-sm">← Вернуться назад</button>
        </div>
      </div>
    );
  }

  const lessonType = selectedLesson?.type;
  const isQuiz = lessonType === 'quiz';
  const isVideo = lessonType === 'video';
  const isImage = lessonType === 'image';

  let quizQuestions = [];
  if (isQuiz) { try { quizQuestions = JSON.parse(selectedLesson.content); } catch (e) { quizQuestions = []; } }

  let mediaData = { text: '', url: '' };
  if (isVideo || isImage) { try { mediaData = JSON.parse(selectedLesson.content); } catch (e) { mediaData = { text: selectedLesson.content, url: '' }; } }

  const embedUrl = isVideo ? getVideoEmbedUrl(mediaData.url) : null;
  const typeLabels = { text: 'Текст', quiz: 'Тест', video: 'Видео', image: 'Картинка' };

  const selectedLessonIdx = selectedLesson ? lessons.findIndex(l => l.id === selectedLesson.id) : -1;
  const selectedLessonStatus = selectedLesson && selectedLessonIdx >= 0 ? getLessonStatus(selectedLesson, selectedLessonIdx) : null;
  const allQuizAnswered = isQuiz && Object.keys(quizResults).length === quizQuestions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 transition">← Назад</button>
              <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
            </div>
          </div>
          {isStudent && (
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500" style={{ width: `${progress.percentage}%` }}></div>
              </div>
              <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{progress.percentage}% пройдено</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        <div className="w-1/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Уроки</h2>
            {isTeacher && <button onClick={openCreateModal} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">+ Добавить</button>}
          </div>
          <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
            {lessons.length === 0 ? <div className="p-6 text-center text-gray-500">Уроков пока нет</div> : (
              <ul>
                {lessons.map((lesson, idx) => {
                  const status = isStudent ? getLessonStatus(lesson, idx) : 'available';
                  const completed = status === 'completed';
                  const locked = status === 'locked';
                  return (
                    <li key={lesson.id} className={`border-b last:border-b-0 ${selectedLesson?.id === lesson.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''} ${locked ? 'opacity-50' : ''}`}>
                      <div
                        onClick={() => !locked && selectLesson(lesson)}
                        className={`p-4 ${locked ? 'cursor-not-allowed' : 'cursor-pointer'} transition hover:bg-gray-50 flex justify-between items-center`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {completed ? '✅' : locked ? '🔒' : idx === 0 || isLessonCompleted(lessons[idx - 1]?.id) ? '🔓' : '🔒'}
                          </span>
                          <div>
                            <div className="font-medium text-gray-800">{idx + 1}. {lesson.title}</div>
                            <div className="text-xs text-gray-400 mt-1">{typeLabels[lesson.type] || 'Текст'}</div>
                          </div>
                        </div>
                      </div>
                      {isTeacher && (
                        <div className="px-4 pb-3 flex gap-2 bg-gray-50 pt-1">
                          <button onClick={() => openEditModal(lesson)} className="flex-1 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Изменить</button>
                          <button onClick={() => handleDelete(lesson.id)} className="flex-1 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition">Удалить</button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="w-2/3">
          {selectedLesson ? (
            <div className="bg-white p-8 rounded-2xl shadow border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedLesson.title}</h2>
                {isStudent && selectedLessonStatus === 'locked' && (
                  <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">🔒 Заблокировано</span>
                )}
                {isStudent && selectedLessonStatus === 'completed' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">✅ Пройден</span>
                )}
              </div>

              {isStudent && selectedLessonStatus === 'locked' ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔒</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Урок заблокирован</h3>
                  <p className="text-gray-500">Пройдите предыдущий урок, чтобы открыть этот</p>
                </div>
              ) : (
                <>
                  {lessonType === 'text' && <div className="prose max-w-none text-gray-700 mb-6 editor-content ql-editor" dangerouslySetInnerHTML={{ __html: selectedLesson.content }}></div>}
                  {isVideo && (
                    <div className="space-y-4 mb-6">
                      {mediaData.text && <p className="text-gray-700 whitespace-pre-wrap">{mediaData.text}</p>}
                      {embedUrl ? (
                        <div className="aspect-video rounded-xl overflow-hidden bg-black">
                          <iframe className="w-full h-full" src={embedUrl} frameBorder="0" allow="autoplay; encrypted-media; fullscreen; picture-in-picture;" allowFullScreen></iframe>
                        </div>
                      ) : <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">Неверная ссылка. Используйте Rutube или Embed URL.</div>}
                    </div>
                  )}
                  {isImage && (
                    <div className="space-y-4 mb-6">
                      {mediaData.text && <p className="text-gray-700 whitespace-pre-wrap">{mediaData.text}</p>}
                      {mediaData.url ? <img src={mediaData.url} alt={selectedLesson.title} className="w-full rounded-xl shadow" /> : <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">Ссылка не указана</div>}
                    </div>
                  )}
                  {isQuiz && (
                    <div className="space-y-8 mb-6">
                      {quizQuestions.map((q, qIdx) => (
                        <div key={qIdx} className="p-4 bg-gray-50 rounded-xl">
                          <p className="font-bold text-gray-800 mb-3">{qIdx + 1}. {q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => {
                              if (!opt) return null;
                              let btnClass = 'w-full text-left p-3 rounded-lg border transition ';
                              if (quizResults[qIdx] !== undefined) {
                                if (optIdx === q.correctIndex) btnClass += 'bg-green-100 border-green-500 text-green-800';
                                else if (quizResults[qIdx] === false && quizAnswers[qIdx] === optIdx) btnClass += 'bg-red-100 border-red-500 text-red-800';
                                else btnClass += 'bg-white border-gray-200 text-gray-400';
                              } else btnClass += 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50';
                              return (
                                <button key={optIdx} disabled={quizResults[qIdx] !== undefined} onClick={() => { setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx }); checkQuizAnswer(qIdx, optIdx); }} className={btnClass}>{opt}</button>
                              );
                            })}
                          </div>
                          {quizResults[qIdx] !== undefined && <p className={`mt-2 font-medium ${quizResults[qIdx] ? 'text-green-600' : 'text-red-600'}`}>{quizResults[qIdx] ? '✅ Правильно!' : '❌ Неправильно'}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* === БЛОК ДОМАШНЕГО ЗАДАНИЯ === */}
                  {assignment && selectedLessonStatus !== 'locked' && (
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">📝 Домашнее задание</h3>
                        {isTeacher && !showHomeworkForm && (
                          <button onClick={() => { setShowHomeworkForm(true); setHomeworkContent(assignment.description); }} className="text-sm text-blue-600 hover:underline">Изменить задание</button>
                        )}
                      </div>

                      {/* Режим преподавателя: Создание/Редактирование задания */}
                      {isTeacher && showHomeworkForm && (
                        <form onSubmit={handleSaveAssignment} className="space-y-4 bg-blue-50 p-4 rounded-xl">
                          <textarea
                            value={homeworkContent}
                            onChange={(e) => setHomeworkContent(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            rows="4"
                            placeholder="Опишите задание для студентов..."
                            required
                          />
                          <div className="flex gap-2">
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Сохранить</button>
                            <button type="button" onClick={() => setShowHomeworkForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">Отмена</button>
                          </div>
                        </form>
                      )}

                      {/* Режим преподавателя: Список решений студентов */}
                      {isTeacher && !showHomeworkForm && (
                        <div className="space-y-3">
                          {submissions.length === 0 ? (
                            <p className="text-gray-500 italic">Студенты еще не сдали задание</p>
                          ) : (
                            submissions.map((sub) => (
                              <div key={sub.id} className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-bold text-gray-800">{sub.username}</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${sub.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {sub.status === 'graded' ? `Оценка: ${sub.grade}` : 'На проверке'}
                                  </span>
                                </div>
                                <p className="text-gray-700 mb-3 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{sub.content}</p>
                                <div className="text-xs text-gray-400">Сдано: {new Date(sub.submitted_at).toLocaleString()}</div>
                                
                                {sub.status !== 'graded' && (
                                  <button onClick={() => setGradingSubmission(sub)} className="mt-2 text-sm text-blue-600 hover:underline">Проверить и оценить</button>
                                )}
                                {sub.status === 'graded' && sub.feedback && (
                                  <div className="mt-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">💬 Ваш комментарий: {sub.feedback}</div>
                                )}

                                {gradingSubmission?.id === sub.id && (
                                  <form onSubmit={handleGradeSubmission} className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                    <div className="flex gap-3">
                                      <input
                                        type="number"
                                        min="0" max="100"
                                        value={gradeData.grade}
                                        onChange={(e) => setGradeData({...gradeData, grade: e.target.value})}
                                        className="w-20 px-3 py-2 border rounded-lg"
                                        placeholder="Оценка"
                                        required
                                      />
                                      <input
                                        type="text"
                                        value={gradeData.feedback}
                                        onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})}
                                        className="flex-1 px-3 py-2 border rounded-lg"
                                        placeholder="Комментарий..."
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Выставить оценку</button>
                                      <button type="button" onClick={() => setGradingSubmission(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">Отмена</button>
                                    </div>
                                  </form>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {/* Режим студента: Просмотр и отправка */}
                      {isStudent && !showHomeworkForm && (
                        <div>
                          <p className="text-gray-700 mb-4 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">{assignment.description}</p>
                          
                          {!submission ? (
                            <form onSubmit={handleSubmitHomework} className="space-y-3">
                              <textarea
                                value={homeworkContent}
                                onChange={(e) => setHomeworkContent(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                rows="4"
                                placeholder="Ваш ответ..."
                                required
                              />
                              <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Отправить на проверку</button>
                            </form>
                          ) : (
                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Ваш ответ:</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${submission.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {submission.status === 'graded' ? `Оценка: ${submission.grade}` : '⏳ На проверке'}
                                </span>
                              </div>
                              <p className="text-gray-800 whitespace-pre-wrap">{submission.content}</p>
                              {submission.status === 'graded' && submission.feedback && (
                                <div className="p-3 bg-blue-100 border border-blue-200 rounded-lg text-blue-800">
                                  💬 <strong>Комментарий преподавателя:</strong> {submission.feedback}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Кнопка для учителя создать задание, если его нет */}
                  {isTeacher && !assignment && (
                    <div className="mt-8 pt-8 border-t border-gray-200">
                       <button onClick={() => { setShowHomeworkForm(true); setHomeworkContent(''); }} className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-blue-500 hover:text-blue-600 transition font-medium">
                         + Добавить домашнее задание к этому уроку
                       </button>
                    </div>
                  )}

                  {isStudent && selectedLessonStatus === 'available' && !isQuiz && (
                    <button
                      onClick={() => markComplete(selectedLesson.id)}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition shadow-lg"
                    >
                      ✅ Завершить урок
                    </button>
                  )}

                  {isStudent && selectedLessonStatus === 'available' && isQuiz && allQuizAnswered && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                      <p className="text-green-800 font-bold text-lg">🎉 Тест завершен!</p>
                      <p className="text-green-600 mt-1">Следующий урок разблокирован</p>
                    </div>
                  )}

                  {isStudent && selectedLessonStatus === 'completed' && (
                    <div className="w-full py-3 bg-green-100 text-green-800 font-bold rounded-xl text-center border border-green-300">
                      ✅ Урок пройден!
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl shadow border border-gray-100 text-center">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Выберите урок</h3>
              <p className="text-gray-500">Нажмите на урок в списке слева</p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingLesson ? 'Редактировать урок' : 'Новый урок'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                <input type="text" value={newLesson.title} onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип урока</label>
                <select value={newLesson.type} onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value, content: '', mediaUrl: '', questions: [] })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="text">📝 Текст / Задание</option>
                  <option value="video">🎬 Видео (Rutube / VK)</option>
                  <option value="image">🖼️ Изображение</option>
                  <option value="quiz">❓ Тест</option>
                </select>
              </div>
              {newLesson.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Содержание</label>
                  <RichTextEditor
                    value={newLesson.content}
                    onChange={(content) => setNewLesson({ ...newLesson, content })}
                    placeholder="Введите текст урока..."
                  />
                </div>
              )}
              {(newLesson.type === 'video' || newLesson.type === 'image') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{newLesson.type === 'video' ? 'Ссылка на видео' : 'Ссылка на изображение'}</label>
                    <input type="url" value={newLesson.mediaUrl} onChange={(e) => setNewLesson({ ...newLesson, mediaUrl: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={newLesson.type === 'video' ? 'https://rutube.ru/video/...' : 'https://...'} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                    <textarea value={newLesson.content} onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="3" placeholder="Дополнительный текст..." />
                  </div>
                </div>
              )}
              {newLesson.type === 'quiz' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Вопросы</label>
                    <button type="button" onClick={addQuestion} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Добавить вопрос</button>
                  </div>
                  {newLesson.questions.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 bg-gray-50 rounded-xl mb-3 space-y-3">
                      <input type="text" value={q.question} onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder={`Вопрос ${qIdx + 1}`} required />
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input type="radio" name={`correct-${qIdx}`} checked={q.correctIndex === optIdx} onChange={() => updateQuestion(qIdx, 'correctIndex', optIdx)} className="accent-green-600" />
                            <input type="text" value={opt} onChange={(e) => updateOption(qIdx, optIdx, e.target.value)} className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm outline-none focus:border-blue-400" placeholder={`Вариант ${optIdx + 1}`} />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">Отметьте правильный ответ</p>
                    </div>
                  ))}
                  {newLesson.questions.length === 0 && <p className="text-center text-gray-400 py-4">Нажмите «+ Добавить вопрос»</p>}
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">Отмена</button>
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">{editingLesson ? 'Сохранить' : 'Создать'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoursePage;
