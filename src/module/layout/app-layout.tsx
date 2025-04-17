import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../dashboard/components/app-sidebar";
import { Outlet } from "react-router";
import { ChatHeader } from "../chatWindow/components/chat-header";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useChatContext } from "@/context/chat-context";

export function AppLayout() {
  const { isInitializing } = useChatContext();
  
  if (isInitializing) {
    return <LoadingScreen message="Loading your chats..." />;
  }
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ChatHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 