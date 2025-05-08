import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useChatContext } from "@/context/chat-context";
import { MessageSquare, FileDown } from "lucide-react";
import { Link } from "react-router";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/context/layout-context";

export function Header() {
    const { handlePrint } = useChatContext();
    const { title, subtitle, isChatWindow } = useLayout();

    return (
        <header className="sticky top-0 flex h-16 items-center gap-2 border-b bg-background px-4 z-10">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex w-full items-center justify-between">
                <Link to="#" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                        <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-sm font-medium">{title}</h2>
                        <p className="text-xs text-muted-foreground">
                            {subtitle}
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-1">
                    {isChatWindow && (
                        <Button variant="ghost" size="icon" onClick={handlePrint}>
                            <FileDown className="h-4 w-4" />
                            <span className="sr-only">Print</span>
                        </Button>
                    )}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
} 