import { createContext, useContext, ReactNode, useState } from "react";

interface LayoutContextType {
  title: string;
  subtitle: string;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  isChatWindow: boolean;
  setIsChatWindow: (isChatWindow: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  title: "ChatX",
  subtitle: "Your personal AI assistant",
  setTitle: () => {},
  setSubtitle: () => {},
  isChatWindow: false,
  setIsChatWindow: () => {}
});

export const useLayout = () => useContext(LayoutContext);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string>("ChatX");
  const [subtitle, setSubtitle] = useState<string>("Your personal AI assistant");
  const [isChatWindow, setIsChatWindow] = useState<boolean>(false);

  return (
    <LayoutContext.Provider
      value={{
        title,
        subtitle,
        setTitle,
        setSubtitle,
        isChatWindow,
        setIsChatWindow 
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
} 