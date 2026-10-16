// import { useState, useContext } from "react";
// import { AuthContext } from "../contextAPI/Authcontext";
// import Navbar from "../components/Navbar";
// const lessons = [
//   { id: 1, title: "What are Mutual Funds? Ultimate Investing Guide", category: "Getting started", duration: "Beginner", yt: "https://youtu.be/JMV4XuuodPE?si=kTbzF-eePma_Y2AP" },
//   { id: 2, title: "XIRR vs Rolling Returns vs CAGR | How to calculate Mutual Fund Returns?", category: "Returns", duration: "Core concepts", yt: "https://youtu.be/gDM_BFjHPx4?si=BSChbBUsWwzvCPLI" },
//   { id: 3, title: "How to pick the BEST MUTUAL FUNDS? (Step by Step)", category: "Fund research", duration: "Practical", yt: "https://youtu.be/XxqQ59NcCTY?si=prVZij9m3_6rAH-M" },
//   { id: 4, title: "What is Mutual funds | Full Course | Mutual Fund for Beginners in Hindi", category: "Getting started", duration: "Beginner", yt: "https://youtu.be/ziGP1-29Sg4?si=ApHTBdIYojz6DSFh" },
//   { id: 5, title: "Mutual Funds Checklist | Hindi Full Course | Mutual Fund for Beginners in Hindi", category: "Fund research", duration: "Practical", yt: "https://youtu.be/DRYV1oBoLKc?si=b3iQ5JFkP_6zb2vp" },
//   { id: 6, title: "Types of Mutual Funds", category: "Fund basics", duration: "Beginner", yt: "https://youtu.be/7rgne7HEct8?si=wRQb62Zuqllr0LOU" },
//   { id: 7, title: "Types of Mutual Funds - 2", category: "Fund basics", duration: "Beginner", yt: "https://youtu.be/T1sSbTNgeBE?si=muK4MnrxSg3REQjS" },
//   { id: 8, title: "Equity Mutual Funds - 1", category: "Fund basics", duration: "Core concepts", yt: "https://youtu.be/i9RhSOdKvYw?si=cvBWDodBVGap8jjI" },
//   { id: 9, title: "Equity Mutual Funds - 2", category: "Fund basics", duration: "Core concepts", yt: "https://youtu.be/5IaWTIa5NV4?si=HOitq1lWbhPmQczN" },
//   { id: 10, title: "Equity Mutual Funds - 3", category: "Fund basics", duration: "Core concepts", yt: "https://youtu.be/-CIX-xRrCCc?si=TIOsn7xNPJ3j-2aC" },
//   { id: 11, title: "Measuring Mutual Fund Returns - 1", category: "Returns", duration: "Core concepts", yt: "https://youtu.be/vxVvRThHhdU?si=JJQT5N3SckfcVmAZ" },
//   { id: 12, title: "Measuring Mutual Fund Returns - 2", category: "Returns", duration: "Core concepts", yt: "https://youtu.be/2ajlNnHwAm8?si=jtKDkgY7uDBjFkfz" },
//   { id: 13, title: "Mutual Fund Risk - 1", category: "Risk", duration: "Core concepts", yt: "https://youtu.be/tZ4ZFw5sC3Y?si=kWumcVcEAQuCrkDI" },
//   { id: 14, title: "Mutual Fund Risk - 2", category: "Risk", duration: "Core concepts", yt: "https://youtu.be/TxGpiHQWnkA?si=6vkHjft6lv8MYGm2" },
//   { id: 15, title: "How to Analyze Mutual Funds - 1", category: "Fund research", duration: "Practical", yt: "https://youtu.be/Mxsf-l-oUDs?si=sIvixTSziErwuaa1" },
//   { id: 16, title: "Mutual Funds Checklist", category: "Fund research", duration: "Practical", yt: "https://youtu.be/DRYV1oBoLKc?si=f9H-s5oo6hulCXIL" },
//   { id: 17, title: "How to Analyze Mutual Funds - 3", category: "Fund research", duration: "Practical", yt: "https://youtu.be/Q4vyxJqMi-M?si=PCJZMDN1A4d4u1qP" },
//   { id: 18, title: "How to Analyze Mutual Funds - 4", category: "Fund research", duration: "Practical", yt: "https://youtu.be/FZYA0mNhWSw?si=BEFJEulApXIOFBHD" },
//   { id: 19, title: "Equity Research Cohort", category: "Fund research", duration: "Extended", yt: "https://youtu.be/bh6miDtLr4I?si=qt5B86qdI9zopP5Z" },
//   { id: 20, title: "The Complete MUTUAL FUND INVESTMENT Guide", category: "Getting started", duration: "Extended", yt: "https://youtu.be/kz6U0axmPSc?si=b0vaAAF_px3-gVgt" },
// ];

// function Lessons() {
//   const { userId } = useContext(AuthContext);
//   const checkedKey = `checked-${userId || "guest"}`;
//   const [selectedId, setSelectedId] = useState(() => { try { return JSON.parse(localStorage.getItem(checkedKey)) || []; } catch { return []; } });
//   const [activeCategory, setActiveCategory] = useState("All lessons");
//   const categories = ["All lessons", ...new Set(lessons.map((lesson) => lesson.category))];
//   const visibleLessons = lessons.filter((lesson) => activeCategory === "All lessons" || lesson.category === activeCategory);
//   const completedCount = lessons.filter((lesson) => selectedId.includes(lesson.id)).length;
//   const toggleLesson = (id) => setSelectedId((previous) => {
//     const next = previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id];
//     localStorage.setItem(checkedKey, JSON.stringify(next));
//     return next;
//   });

//   return <div className="mfd-page"><Navbar/><main className="page-container page-content">
//     <div className="page-header"><div><span className="eyebrow">Learning centre</span><h1>Build your investing knowledge</h1><p>Shortlist a topic, watch a lesson and mark it complete as you work through the fundamentals.</p></div><div className="lesson-progress-card"><div className="progress-ring"><strong>{Math.round(completedCount / lessons.length * 100)}<small>%</small></strong></div><span><strong>{completedCount} of {lessons.length}</strong><small>lessons completed</small></span></div></div>
//     <section className="learning-banner"><div className="learning-banner-symbol">✳</div><div><strong>Start with the fundamentals. Build from there.</strong><p>This library links to third-party educational videos. MFD does not create or endorse individual investment recommendations.</p></div><span className="tag">Self-paced learning</span></section>
//     <div className="lesson-toolbar"><div className="lesson-filters" aria-label="Filter lessons">{categories.map((category) => <button type="button" key={category} onClick={() => setActiveCategory(category)} className={activeCategory === category ? "selected" : ""}>{category}</button>)}</div><span className="lesson-count">{visibleLessons.length} lessons</span></div>
//     <section className="lesson-list">{visibleLessons.map((lesson) => <article className={`lesson-row ${selectedId.includes(lesson.id) ? "lesson-complete" : ""}`} key={lesson.id}><div className="lesson-number">{String(lesson.id).padStart(2, "0")}</div><div className="lesson-copy"><div className="lesson-meta"><span>{lesson.category}</span><i/> <span>{lesson.duration}</span></div><h2>{lesson.title}</h2><div className="lesson-row-actions"><a href={lesson.yt} target="_blank" rel="noreferrer" className="lesson-watch">Watch lesson <span>↗</span></a><label className="lesson-checkbox"><input type="checkbox" checked={selectedId.includes(lesson.id)} onChange={() => toggleLesson(lesson.id)}/><span>{selectedId.includes(lesson.id) ? "Completed" : "Mark complete"}</span></label></div></div><div className={`lesson-state-mark ${selectedId.includes(lesson.id) ? "complete" : ""}`}>{selectedId.includes(lesson.id) ? "✓" : "→"}</div></article>)}</section>
//     <p className="disclaimer-note">Educational content is provided through external links. Video availability and content may change independently of MFD.</p>
//   </main></div>;
// }
// export default Lessons;

import { useState, useContext } from "react";
import { AuthContext } from "../contextAPI/Authcontext";
import Navbar from "../components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AI_ENDPOINT = "https://pdf-rag-pipeline-9cgm.onrender.com/query";

// Tailwind classes for the AI section. Change the accent here to match your theme.
const aiFocus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";
const aiPrimaryBtn =
  "whitespace-nowrap rounded-[10px] bg-neutral-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200";

const aiSuggestions = [
  "What is the difference between SIP and lump sum?",
  "How do I read an expense ratio?",
  "Explain XIRR in simple words",
  "What risks should a beginner know about?",
];

const lessons = [
  {
    id: 1,
    title: "What are Mutual Funds? Ultimate Investing Guide",
    category: "Getting started",
    duration: "Beginner",
    yt: "https://youtu.be/JMV4XuuodPE?si=kTbzF-eePma_Y2AP",
  },
  {
    id: 2,
    title:
      "XIRR vs Rolling Returns vs CAGR | How to calculate Mutual Fund Returns?",
    category: "Returns",
    duration: "Core concepts",
    yt: "https://youtu.be/gDM_BFjHPx4?si=BSChbBUsWwzvCPLI",
  },
  {
    id: 3,
    title: "How to pick the BEST MUTUAL FUNDS? (Step by Step)",
    category: "Fund research",
    duration: "Practical",
    yt: "https://youtu.be/XxqQ59NcCTY?si=prVZij9m3_6rAH-M",
  },
  {
    id: 4,
    title:
      "What is Mutual funds | Full Course | Mutual Fund for Beginners in Hindi",
    category: "Getting started",
    duration: "Beginner",
    yt: "https://youtu.be/ziGP1-29Sg4?si=ApHTBdIYojz6DSFh",
  },
  {
    id: 5,
    title:
      "Mutual Funds Checklist | Hindi Full Course | Mutual Fund for Beginners in Hindi",
    category: "Fund research",
    duration: "Practical",
    yt: "https://youtu.be/DRYV1oBoLKc?si=b3iQ5JFkP_6zb2vp",
  },
  {
    id: 6,
    title: "Types of Mutual Funds",
    category: "Fund basics",
    duration: "Beginner",
    yt: "https://youtu.be/7rgne7HEct8?si=wRQb62Zuqllr0LOU",
  },
  {
    id: 7,
    title: "Types of Mutual Funds - 2",
    category: "Fund basics",
    duration: "Beginner",
    yt: "https://youtu.be/T1sSbTNgeBE?si=muK4MnrxSg3REQjS",
  },
  {
    id: 8,
    title: "Equity Mutual Funds - 1",
    category: "Fund basics",
    duration: "Core concepts",
    yt: "https://youtu.be/i9RhSOdKvYw?si=cvBWDodBVGap8jjI",
  },
  {
    id: 9,
    title: "Equity Mutual Funds - 2",
    category: "Fund basics",
    duration: "Core concepts",
    yt: "https://youtu.be/5IaWTIa5NV4?si=HOitq1lWbhPmQczN",
  },
  {
    id: 10,
    title: "Equity Mutual Funds - 3",
    category: "Fund basics",
    duration: "Core concepts",
    yt: "https://youtu.be/-CIX-xRrCCc?si=TIOsn7xNPJ3j-2aC",
  },
  {
    id: 11,
    title: "Measuring Mutual Fund Returns - 1",
    category: "Returns",
    duration: "Core concepts",
    yt: "https://youtu.be/vxVvRThHhdU?si=JJQT5N3SckfcVmAZ",
  },
  {
    id: 12,
    title: "Measuring Mutual Fund Returns - 2",
    category: "Returns",
    duration: "Core concepts",
    yt: "https://youtu.be/2ajlNnHwAm8?si=jtKDkgY7uDBjFkfz",
  },
  {
    id: 13,
    title: "Mutual Fund Risk - 1",
    category: "Risk",
    duration: "Core concepts",
    yt: "https://youtu.be/tZ4ZFw5sC3Y?si=kWumcVcEAQuCrkDI",
  },
  {
    id: 14,
    title: "Mutual Fund Risk - 2",
    category: "Risk",
    duration: "Core concepts",
    yt: "https://youtu.be/TxGpiHQWnkA?si=6vkHjft6lv8MYGm2",
  },
  {
    id: 15,
    title: "How to Analyze Mutual Funds - 1",
    category: "Fund research",
    duration: "Practical",
    yt: "https://youtu.be/Mxsf-l-oUDs?si=sIvixTSziErwuaa1",
  },
  {
    id: 16,
    title: "Mutual Funds Checklist",
    category: "Fund research",
    duration: "Practical",
    yt: "https://youtu.be/DRYV1oBoLKc?si=f9H-s5oo6hulCXIL",
  },
  {
    id: 17,
    title: "How to Analyze Mutual Funds - 3",
    category: "Fund research",
    duration: "Practical",
    yt: "https://youtu.be/Q4vyxJqMi-M?si=PCJZMDN1A4d4u1qP",
  },
  {
    id: 18,
    title: "How to Analyze Mutual Funds - 4",
    category: "Fund research",
    duration: "Practical",
    yt: "https://youtu.be/FZYA0mNhWSw?si=BEFJEulApXIOFBHD",
  },
  {
    id: 19,
    title: "Equity Research Cohort",
    category: "Fund research",
    duration: "Extended",
    yt: "https://youtu.be/bh6miDtLr4I?si=qt5B86qdI9zopP5Z",
  },
  {
    id: 20,
    title: "The Complete MUTUAL FUND INVESTMENT Guide",
    category: "Getting started",
    duration: "Extended",
    yt: "https://youtu.be/kz6U0axmPSc?si=b0vaAAF_px3-gVgt",
  },
];

const normalizeAIAnswer = (text = "") =>
  text
    .replace(/^\s*\\\s*$/gm, "") // Remove standalone backslash lines
    .replace(/\\([*_`])/g, "$1") // Unescape Markdown formatting
    .replace(/&#x20;/gi, " ");   // Normalize encoded spaces

function Lessons() {
  const { userId } = useContext(AuthContext);
  const checkedKey = `checked-${userId || "guest"}`;
  const [selectedId, setSelectedId] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(checkedKey)) || [];
    } catch {
      return [];
    }
  });
  const [activeCategory, setActiveCategory] = useState("All lessons");

  // AI Paced Learning state
  const [question, setQuestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSlow, setAiSlow] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiHistory, setAiHistory] = useState([]);

  const categories = [
    "All lessons",
    ...new Set(lessons.map((lesson) => lesson.category)),
  ];
  const visibleLessons = lessons.filter(
    (lesson) =>
      activeCategory === "All lessons" || lesson.category === activeCategory,
  );
  const completedCount = lessons.filter((lesson) =>
    selectedId.includes(lesson.id),
  ).length;
  const toggleLesson = (id) =>
    setSelectedId((previous) => {
      const next = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];
      localStorage.setItem(checkedKey, JSON.stringify(next));
      return next;
    });

  const askAI = async (text) => {
    const query = (text ?? question).trim();
    if (!query || aiLoading) return;

    setAiLoading(true);
    setAiError("");
    setAiSlow(false);

    // The Render free tier can take a while to wake up, so tell the user what's happening.
    const slowTimer = setTimeout(() => setAiSlow(true), 6000);
    const controller = new AbortController();
    const abortTimer = setTimeout(() => controller.abort(), 90000);

    try {
      const response = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });
      if (!response.ok)
        throw new Error(`Request failed with ${response.status}`);
      const data = await response.json();
      setAiHistory((previous) =>
        [
          {
            id: Date.now(),
            query,
            ans: data.ans || "No answer was returned for that question.",
            link: data.link || "",
          },
          ...previous,
        ].slice(0, 5),
      );
      setQuestion("");
    } catch (error) {
      setAiError(
        error.name === "AbortError"
          ? "The AI took too long to respond. Please try again."
          : "Couldn't reach the AI tutor. Check your connection and try again.",
      );
    } finally {
      clearTimeout(slowTimer);
      clearTimeout(abortTimer);
      setAiLoading(false);
      setAiSlow(false);
    }
  };

  const handleAiKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askAI();
    }
  };

  const isUrl = (value) => /^https?:\/\//i.test(value || "");

  return (
    <div className="mfd-page">
      <Navbar />
      <main className="page-container page-content">
        <div className="page-header">
          <div>
            <span className="eyebrow">Learning centre</span>
            <h1>Build your investing knowledge</h1>
            <p>
              Shortlist a topic, watch a lesson and mark it complete as you work
              through the fundamentals.
            </p>
          </div>
          <div className="lesson-progress-card">
            <div className="progress-ring">
              <strong>
                {Math.round((completedCount / lessons.length) * 100)}
                <small>%</small>
              </strong>
            </div>
            <span>
              <strong>
                {completedCount} of {lessons.length}
              </strong>
              <small>lessons completed</small>
            </span>
          </div>
        </div>
        <section className="learning-banner">
          <div className="learning-banner-symbol">✳</div>
          <div>
            <strong>Start with the fundamentals. Build from there.</strong>
            <p>
              This library links to third-party educational videos. MFD does not
              create or endorse individual investment recommendations.
            </p>
          </div>
          <span className="tag">Self-paced learning</span>
        </section>

        <div className="lesson-toolbar">
          <div className="lesson-filters" aria-label="Filter lessons">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? "selected" : ""}
              >
                {category}
              </button>
            ))}
          </div>
          <span className="lesson-count">{visibleLessons.length} lessons</span>
        </div>
        <section className="lesson-list">
          {visibleLessons.map((lesson) => (
            <article
              className={`lesson-row ${selectedId.includes(lesson.id) ? "lesson-complete" : ""}`}
              key={lesson.id}
            >
              <div className="lesson-number">
                {String(lesson.id).padStart(2, "0")}
              </div>
              <div className="lesson-copy">
                <div className="lesson-meta">
                  <span>{lesson.category}</span>
                  <i /> <span>{lesson.duration}</span>
                </div>
                <h2>{lesson.title}</h2>
                <div className="lesson-row-actions">
                  <a
                    href={lesson.yt}
                    target="_blank"
                    rel="noreferrer"
                    className="lesson-watch"
                  >
                    Watch lesson <span>↗</span>
                  </a>
                  <label className="lesson-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedId.includes(lesson.id)}
                      onChange={() => toggleLesson(lesson.id)}
                    />
                    <span>
                      {selectedId.includes(lesson.id)
                        ? "Completed"
                        : "Mark complete"}
                    </span>
                  </label>
                </div>
              </div>
              <div
                className={`lesson-state-mark ${selectedId.includes(lesson.id) ? "complete" : ""}`}
              >
                {selectedId.includes(lesson.id) ? "✓" : "→"}
              </div>
            </article>
          ))}
        </section>

<section className="mfd-ai-panel" aria-labelledby="ai-learning-title">
  <div className="mfd-ai-header">
    <div className="mfd-ai-heading">
      <span className="eyebrow">YOUR LEARNING ASSISTANT</span>
      <h2 id="ai-learning-title">AI Study Assistant</h2>
      <p>
        Understand mutual fund concepts, clarify doubts, and learn
        at your own pace with answers from your study material.
      </p>
    </div>
    <span className="tag mfd-ai-badge">
      <span className="mfd-ai-status-dot" />
      AI tutor
    </span>
  </div>

  <div className="mfd-ai-suggestions" aria-label="Suggested questions">
    <span className="mfd-ai-label">TRY ASKING</span>
    <div className="mfd-ai-suggestion-list">
      {aiSuggestions.map((suggestion) => (
        <button
          type="button"
          key={suggestion}
          disabled={aiLoading}
          onClick={() => {
            setQuestion(suggestion);
            askAI(suggestion);
          }}
          className="mfd-ai-suggestion"
        >
          {suggestion}
          <span aria-hidden="true">↗</span>
        </button>
      ))}
    </div>
  </div>

  <div className="mfd-ai-composer">
    <textarea
      className="mfd-ai-input"
      rows={3}
      value={question}
      onChange={(event) => setQuestion(event.target.value)}
      onKeyDown={handleAiKeyDown}
      placeholder="Ask a question about mutual funds..."
      aria-label="Ask the AI tutor a question"
      disabled={aiLoading}
    />

    <div className="mfd-ai-composer-footer">
      <span className="mfd-ai-hint">
        Press Enter to ask · Shift + Enter for a new line
      </span>
      <button
        type="button"
        className="mfd-ai-submit"
        onClick={() => askAI()}
        disabled={aiLoading || !question.trim()}
      >
        {aiLoading ? (
          <>
            <span className="mfd-ai-spinner" aria-hidden="true" />
            Thinking
          </>
        ) : (
          <>
            Ask AI <span aria-hidden="true">↗</span>
          </>
        )}
      </button>
    </div>
  </div>

  {aiLoading && (
    <div className="mfd-ai-thinking" role="status" aria-live="polite">
      <span className="mfd-ai-spinner" aria-hidden="true" />
      <div>
        <strong>
          {aiSlow ? "Waking up the AI tutor" : "Working through your question"}
        </strong>
        <p>
          {aiSlow
            ? "The server may take a little longer to respond on its first request."
            : "Finding a relevant answer from your study material..."}
        </p>
      </div>
      <span className="mfd-ai-thinking-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </div>
  )}

  {aiError && (
    <p className="mfd-ai-error" role="alert">
      {aiError}
    </p>
  )}

  {aiHistory.length > 0 && (
    <div className="mfd-ai-history" aria-live="polite">
      <div className="mfd-ai-history-header">
        <span className="mfd-ai-label">RECENT CONVERSATION</span>
        <span>{aiHistory.length} responses</span>
      </div>

      {aiHistory.map((item, index) => (
        <article
          key={item.id}
          className={`mfd-ai-answer ${
            index === 0 ? "mfd-ai-answer-latest" : ""
          }`}
        >
          <div className="mfd-ai-question">
            <span className="mfd-ai-q-icon">Q</span>
            <strong>{item.query}</strong>
          </div>

          {/* <div className="mfd-ai-answer-body">
            <span className="mfd-ai-answer-label">ANSWER</span>
            <p>{item.ans}</p>
          </div> */}

          <div className="mfd-ai-answer-body">
  <span className="mfd-ai-answer-label">ANSWER</span>

  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {normalizeAIAnswer(item.ans)}
  </ReactMarkdown>
</div>

          {item.link &&
            (/^https?:\/\//i.test(item.link) ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mfd-ai-source"
              >
                View source <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <p className="mfd-ai-source-text">
                Source: {item.link}
              </p>
            ))}
        </article>
      ))}
    </div>
  )}

  <p className="disclaimer-note mfd-ai-disclaimer">
    AI-generated explanations are for educational purposes only and
    are not investment advice. Verify important information before
    making financial decisions.
  </p>
</section>

        <p className="disclaimer-note">
          Educational content is provided through external links. Video
          availability and content may change independently of MFD.
        </p>
      </main>
    </div>
  );
}
export default Lessons;
