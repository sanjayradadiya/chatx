import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../dashboard/components/app-sidebar";
import { Outlet } from "react-router";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useChatContext } from "@/context/chat-context";
import { Header } from "./header";
import { LayoutProvider } from "@/context/layout-context";
export function AppLayout() {
  const { isInitializing } = useChatContext();

  if (isInitializing) {
    return <LoadingScreen message="Loading your chats..." />;
  }

  return (
    <LayoutProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-4rem)]">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </LayoutProvider>
  );
} 