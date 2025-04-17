import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { ChatList } from "./chat-list";
import { useAuthProvider } from "@/context/auth-provider";
import { Bot } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { session } = useAuthProvider();
  
  const user = {
    name: session?.user.user_metadata?.fullname || "User",
    email: session?.user.email || "",
    avatar: "/avatars/user.jpg",
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        <ChatList />
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="px-3 py-1">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-5 w-5" />
            <h2 className="text-sm font-semibold">ChatX AI Assistant</h2>
          </div>
          <Separator className="my-2" />
        </div>
        <p className="text-xs text-center text-muted-foreground">
          © {new Date().getFullYear()} ChatX AI
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
