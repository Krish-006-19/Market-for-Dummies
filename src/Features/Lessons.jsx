import { useState, useContext } from "react";
import { AuthContext } from "../contextAPI/Authcontext";
import Navbar from "../components/Navbar";
const lessons = [
  { id: 1, title: "What are Mutual Funds? Ultimate Investing Guide", category: "Getting started", duration: "Beginner", yt: "https://youtu.be/JMV4XuuodPE?si=kTbzF-eePma_Y2AP" },
  { id: 2, title: "XIRR vs Rolling Returns vs CAGR | How to calculate Mutual Fund Returns?", category: "Returns", duration: "Core concepts", yt: "https://youtu.be/gDM_BFjHPx4?si=BSChbBUsWwzvCPLI" },
  { id: 3, title: "How to pick the BEST MUTUAL FUNDS? (Step by Step)", category: "Fund research", duration: "Practical", yt: "https://youtu.be/XxqQ59NcCTY?si=prVZij9m3_6rAH-M" },
  { id: 4, title: "What is Mutual funds | Full Course | Mutual Fund for Beginners in Hindi", category: "Getting started", duration: "Beginner", yt: "https://youtu.be/ziGP1-29Sg4?si=ApHTBdIYojz6DSFh" },
  { id: 5, title: "Mutual Funds Checklist | Hindi Full Course | Mutual Fund for Beginners in Hindi", category: "Fund research", duration: "Practical", yt: "https://youtu.be/DRYV1oBoLKc?si=b3iQ5JFkP_6zb2vp" },
  { id: 6, title: "Types of Mutual Funds", category: "Fund basics", duration: "Beginner", yt: "https://youtu.be/7rgne7HEct8?si=wRQb62Zuqllr0LOU" },
  { id: 7, title: "Types of Mutual Funds - 2", category: "Fund basics", duration: "Beginner", yt: "https://youtu.be/T1sSbTNgeBE?si=muK4MnrxSg3REQjS" },
  { id: 8, title: "Equity Mutual Funds - 1", category: "Fund basics", duration: "Core concepts", yt: "https://youtu.be/i9RhSOdKvYw?si=cvBWDodBVGap8jjI" },
  { id: 9, title: "Equity Mutual Funds - 2", category: "Fund basics", duration: "Core concepts", yt: "https://youtu.be/5IaWTIa5NV4?si=HOitq1lWbhPmQczN" },
  { id: 10, title: "Equity Mutual Funds - 3", category: "Fund basics", duration: "Core concepts", yt: "https://youtu.be/-CIX-xRrCCc?si=TIOsn7xNPJ3j-2aC" },
  { id: 11, title: "Measuring Mutual Fund Returns - 1", category: "Returns", duration: "Core concepts", yt: "https://youtu.be/vxVvRThHhdU?si=JJQT5N3SckfcVmAZ" },
  { id: 12, title: "Measuring Mutual Fund Returns - 2", category: "Returns", duration: "Core concepts", yt: "https://youtu.be/2ajlNnHwAm8?si=jtKDkgY7uDBjFkfz" },
  { id: 13, title: "Mutual Fund Risk - 1", category: "Risk", duration: "Core concepts", yt: "https://youtu.be/tZ4ZFw5sC3Y?si=kWumcVcEAQuCrkDI" },
  { id: 14, title: "Mutual Fund Risk - 2", category: "Risk", duration: "Core concepts", yt: "https://youtu.be/TxGpiHQWnkA?si=6vkHjft6lv8MYGm2" },
  { id: 15, title: "How to Analyze Mutual Funds - 1", category: "Fund research", duration: "Practical", yt: "https://youtu.be/Mxsf-l-oUDs?si=sIvixTSziErwuaa1" },
  { id: 16, title: "Mutual Funds Checklist", category: "Fund research", duration: "Practical", yt: "https://youtu.be/DRYV1oBoLKc?si=f9H-s5oo6hulCXIL" },
  { id: 17, title: "How to Analyze Mutual Funds - 3", category: "Fund research", duration: "Practical", yt: "https://youtu.be/Q4vyxJqMi-M?si=PCJZMDN1A4d4u1qP" },
  { id: 18, title: "How to Analyze Mutual Funds - 4", category: "Fund research", duration: "Practical", yt: "https://youtu.be/FZYA0mNhWSw?si=BEFJEulApXIOFBHD" },
  { id: 19, title: "Equity Research Cohort", category: "Fund research", duration: "Extended", yt: "https://youtu.be/bh6miDtLr4I?si=qt5B86qdI9zopP5Z" },
  { id: 20, title: "The Complete MUTUAL FUND INVESTMENT Guide", category: "Getting started", duration: "Extended", yt: "https://youtu.be/kz6U0axmPSc?si=b0vaAAF_px3-gVgt" },
];

function Lessons() {
  const { userId } = useContext(AuthContext);
  const checkedKey = `checked-${userId || "guest"}`;
  const [selectedId, setSelectedId] = useState(() => { try { return JSON.parse(localStorage.getItem(checkedKey)) || []; } catch { return []; } });
  const [activeCategory, setActiveCategory] = useState("All lessons");
  const categories = ["All lessons", ...new Set(lessons.map((lesson) => lesson.category))];
  const visibleLessons = lessons.filter((lesson) => activeCategory === "All lessons" || lesson.category === activeCategory);
  const completedCount = lessons.filter((lesson) => selectedId.includes(lesson.id)).length;
  const toggleLesson = (id) => setSelectedId((previous) => {
    const next = previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id];
    localStorage.setItem(checkedKey, JSON.stringify(next));
    return next;
  });

  return <div className="mfd-page"><Navbar/><main className="page-container page-content">
    <div className="page-header"><div><span className="eyebrow">Learning centre</span><h1>Build your investing knowledge</h1><p>Shortlist a topic, watch a lesson and mark it complete as you work through the fundamentals.</p></div><div className="lesson-progress-card"><div className="progress-ring"><strong>{Math.round(completedCount / lessons.length * 100)}<small>%</small></strong></div><span><strong>{completedCount} of {lessons.length}</strong><small>lessons completed</small></span></div></div>
    <section className="learning-banner"><div className="learning-banner-symbol">✳</div><div><strong>Start with the fundamentals. Build from there.</strong><p>This library links to third-party educational videos. MFD does not create or endorse individual investment recommendations.</p></div><span className="tag">Self-paced learning</span></section>
    <div className="lesson-toolbar"><div className="lesson-filters" aria-label="Filter lessons">{categories.map((category) => <button type="button" key={category} onClick={() => setActiveCategory(category)} className={activeCategory === category ? "selected" : ""}>{category}</button>)}</div><span className="lesson-count">{visibleLessons.length} lessons</span></div>
    <section className="lesson-list">{visibleLessons.map((lesson) => <article className={`lesson-row ${selectedId.includes(lesson.id) ? "lesson-complete" : ""}`} key={lesson.id}><div className="lesson-number">{String(lesson.id).padStart(2, "0")}</div><div className="lesson-copy"><div className="lesson-meta"><span>{lesson.category}</span><i/> <span>{lesson.duration}</span></div><h2>{lesson.title}</h2><div className="lesson-row-actions"><a href={lesson.yt} target="_blank" rel="noreferrer" className="lesson-watch">Watch lesson <span>↗</span></a><label className="lesson-checkbox"><input type="checkbox" checked={selectedId.includes(lesson.id)} onChange={() => toggleLesson(lesson.id)}/><span>{selectedId.includes(lesson.id) ? "Completed" : "Mark complete"}</span></label></div></div><div className={`lesson-state-mark ${selectedId.includes(lesson.id) ? "complete" : ""}`}>{selectedId.includes(lesson.id) ? "✓" : "→"}</div></article>)}</section>
    <p className="disclaimer-note">Educational content is provided through external links. Video availability and content may change independently of MFD.</p>
  </main></div>;
}
export default Lessons;
