import {
  LogOut,
  User,
  CreditCard
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuthProvider } from "@/context/auth-provider"
import { Link } from "react-router"
import { useCallback, useMemo } from "react"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { logout, currentUser } = useAuthProvider();
  
  const userProfile = useMemo(() => {
    return {
      avatarUrl: currentUser?.user_metadata.avatar_url,
      full_name: currentUser?.user_metadata.full_name,
      email: currentUser?.email,
    };
  }, [currentUser]);
  
  const getInitials = useCallback(() => {
    const name = userProfile.full_name || "";
    return name.charAt(0) + (name.split(" ")[1]?.charAt(0) || "");
  }, [userProfile]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userProfile.avatarUrl} alt={userProfile.full_name || "User"} />
                <AvatarFallback className="rounded-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userProfile.full_name}</span>
                <span className="truncate text-xs">{userProfile.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userProfile.avatarUrl} alt={userProfile.full_name || "User"} />
                  <AvatarFallback className="rounded-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userProfile.full_name}</span>
                  <span className="truncate text-xs">{userProfile.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>           
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/subscription">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscription
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
