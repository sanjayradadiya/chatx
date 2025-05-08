import { useEffect } from "react";
import { useLayout } from "@/context/layout-context";

/**
 * Custom hook for setting the page title and optional subtitle
 * 
 * @param title The page title to display in the header
 * @param subtitle Optional subtitle to display (defaults to "Your personal AI assistant")
 */
export function usePageTitle(title: string, subtitle?: string, isChatWindow?: boolean) {
    const { setTitle, setSubtitle, setIsChatWindow } = useLayout();

    useEffect(() => {
        // Set the title
        setTitle(title);

        // Set subtitle if provided
        if (subtitle) {
            setSubtitle(subtitle);
        }

        if (isChatWindow) {
            setIsChatWindow(true);
        }

        // Clean up by restoring default title when component unmounts
        return () => {
            setTitle("ChatX");
            setSubtitle("Your personal AI assistant");
            setIsChatWindow(false);
        };
    }, [title, subtitle, setTitle, setSubtitle, setIsChatWindow]);
} 