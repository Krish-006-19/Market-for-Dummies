import { createContext, useState } from "react";

export const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [symbol, setSymbol] = useState(null); 

  return (
    <StockContext.Provider value={{ symbol, setSymbol }}>
      {children}
    </StockContext.Provider>
  );
};