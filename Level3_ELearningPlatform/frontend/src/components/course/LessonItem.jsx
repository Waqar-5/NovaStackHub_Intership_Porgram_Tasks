const typeIcons = {
  video: '▶',
  quiz: '?',
  assignment: '✎',
};

export default function LessonItem({ lesson, isActive, onSelect }) {
  return (
    <button
      onClick={() => onSelect(lesson)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-2 ${
        isActive
          ? 'bg-amber/10 border-amber'
          : 'border-transparent hover:bg-ink/5'
      }`}
    >
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
          lesson.completed ? 'bg-moss text-paper' : 'bg-line text-slate'
        }`}
      >
        {lesson.completed ? '✓' : typeIcons[lesson.type]}
      </span>
      <span className="flex-1 min-w-0">
        <p className={`text-sm truncate ${isActive ? 'text-ink font-medium' : 'text-slate'}`}>
          {lesson.title}
        </p>
      </span>
      <span className="text-xs text-slate/60 font-mono flex-shrink-0">{lesson.duration}</span>
    </button>
  );
}
