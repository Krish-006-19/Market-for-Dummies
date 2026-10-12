import { createContext, useState, useEffect } from "react";

export const CursorContext = createContext();

export const CursorProvider = ({ children }) => {
  const [cursorPos, setCursorPos] = useState({ x: 250, y: 250 });

  useEffect(() => {
    const moveHandler = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", moveHandler);

    return () => window.removeEventListener("mousemove", moveHandler);
  }, []);

  return (
    <CursorContext.Provider value={{ cursorPos }}>
      {children}
    </CursorContext.Provider>
  );
};