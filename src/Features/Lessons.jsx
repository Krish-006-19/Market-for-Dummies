import { useState,useContext } from "react";
import { CursorContext } from "../contextAPI/Cursorcontext";
import { AuthContext } from "../contextAPI/Authcontext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
const lessons = [
  {
    id: 1,
    title: "What are Mutual Funds? Ultimate Investing Guide",
    yt: "https://youtu.be/JMV4XuuodPE?si=kTbzF-eePma_Y2AP",
  },
  {
    id: 2,
    title: "XIRR vs Rolling Returns vs CAGR | How to calculate Mutual Fund Returns?",
    yt: "https://youtu.be/gDM_BFjHPx4?si=BSChbBUsWwzvCPLI",
  },
  {
    id: 3,
    title: "How to pick the BEST MUTUAL FUNDS? (Step by Step)",
    yt: "https://youtu.be/XxqQ59NcCTY?si=prVZij9m3_6rAH-M",
  },
  {
    id:4,
    title: 'What is Mutual funds | Full Course | Mutual Fund for Beginners in Hindi',
    yt: 'https://youtu.be/ziGP1-29Sg4?si=ApHTBdIYojz6DSFh'
  },
  {
    id:5,
    title:'Mutual Funds Checklist | Hindi Full Course | Mutual Fund for Beginners in Hindi',
    yt: 'https://youtu.be/DRYV1oBoLKc?si=b3iQ5JFkP_6zb2vp'
  },
  {
    id:6,
    title:'Types of Mutual Funds',
    yt:'https://youtu.be/7rgne7HEct8?si=wRQb62Zuqllr0LOU'
  },
  {
    id:7,
    title:'Types of Mutual Funds - 2',
    yt:'https://youtu.be/T1sSbTNgeBE?si=muK4MnrxSg3REQjS'
  },
  {
    id:8,
    title:'Equity Mutual Funds - 1',
    yt:'https://youtu.be/i9RhSOdKvYw?si=cvBWDodBVGap8jjI'
  },
  {
    id:9,
    title:'Equity Mutual Funds - 2',
    yt:'https://youtu.be/5IaWTIa5NV4?si=HOitq1lWbhPmQczN'
  },
  {
    id:10,
    title:'Equity Mutual Funds - 3',
    yt:'https://youtu.be/-CIX-xRrCCc?si=TIOsn7xNPJ3j-2aC'
  },
  {
    id:11,
    title:'Measuring Mutual Fund Returns - 1',
    yt:'https://youtu.be/vxVvRThHhdU?si=JJQT5N3SckfcVmAZ'
  },
  {
    id:12,
    title:'Measuring Mutual Fund Returns - 2',
    yt:'https://youtu.be/2ajlNnHwAm8?si=jtKDkgY7uDBjFkfz'
  },
  {
    id:13,
    title:'Mutual Fund Risk - 1',
    yt:'https://youtu.be/tZ4ZFw5sC3Y?si=kWumcVcEAQuCrkDI'
  },
  {
    id:14,
    title:'Mutual Fund Risk - 2',
    yt:'https://youtu.be/TxGpiHQWnkA?si=6vkHjft6lv8MYGm2'
  },
  {
    id:15,
    title:'How to Analyze Mutual Funds - 1',
    yt:'https://youtu.be/Mxsf-l-oUDs?si=sIvixTSziErwuaa1'
  },
  {
    id:16,
    title:'Mutual Funds Checklist',
    yt:'https://youtu.be/DRYV1oBoLKc?si=f9H-s5oo6hulCXIL'
  },
  {
    id:17,
    title:'How to Analyze Mutual Funds - 3',
    yt:'https://youtu.be/Q4vyxJqMi-M?si=PCJZMDN1A4d4u1qP'
  },
  {
    id:18,
    title:'How to Analyze Mutual Funds - 4',
    yt:'https://youtu.be/FZYA0mNhWSw?si=BEFJEulApXIOFBHD'
  },
  {
    id:19,
    title:'Equity Research Cohort',
    yt:'https://youtu.be/bh6miDtLr4I?si=qt5B86qdI9zopP5Z'
  },
  {
    id:20,
    title:'The Complete MUTUAL FUND INVESTMENT Guide',
    yt:'https://youtu.be/kz6U0axmPSc?si=b0vaAAF_px3-gVgt'
  }
];

function Lessons() {
  const { userId } = useContext(AuthContext)
  // Scoped by userId so completed-lesson checkmarks don't leak between
  // different accounts signed in on the same browser.
  const checkedKey = `checked-${userId || "guest"}`

  // const [selectedId, setSelectedId] = useState([])
  const [selectedId, setSelectedId] = useState(JSON.parse(localStorage.getItem(checkedKey))||[])

  const { cursorPos } = useContext(CursorContext)

  return (
    <div className="relative spg min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-gray-100 font-sans">
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-full z-0"
        style={{
          background: `radial-gradient(200px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(59,130,246,0.25), transparent 80%)`,
        }}
      ></div>

      <Navbar />
      <section className="text-center py-10 sm:py-12 px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
          Trading Lessons Sheet
        </h1>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
          Step-by-step lessons. Mark as complete,
          watch videos, and enjoy!
        </p>
      </section>

      {/* Lessons Table */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/30 dark:bg-slate-800/40 backdrop-blur-lg">
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Lesson</th>
                <th className="p-4">Complete</th>
                <th className="p-4">Video</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr
                  key={lesson.id}
                  className="border-b border-white/20 dark:border-slate-700/30 bg-white/20 dark:bg-slate-800/30 backdrop-blur-md hover:shadow-[0_0_15px_3px_rgba(239,68,68,0.4)] transition"
                >
                  <td className="p-4 font-semibold">{lesson.id}</td>
                  <td className="p-4 max-w-[200px] sm:max-w-xs">{lesson.title}</td>
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      onChange={()=>setSelectedId(prev=>{
                        if(prev.includes(lesson.id)){
                          let filt = selectedId.filter(id=>id !== lesson.id)
                          localStorage.setItem(checkedKey,JSON.stringify(filt))
                          return filt
                        } else {
                          let filt = [...prev,lesson.id]
                          localStorage.setItem(checkedKey,JSON.stringify(filt))
                          return filt
                        }
                      })}
                      checked={selectedId.includes(lesson.id)}
                      className="w-5 h-5 rounded-full accent-green-500 cursor-pointer"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <a
                      href={lesson.yt}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white shadow-md hover:scale-105 transition inline-block"
                    >
                      Watch
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Lessons;
