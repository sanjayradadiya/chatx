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
import { Bot } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser />
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
