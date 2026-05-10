"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";

export default function Topbar() {
  const { toggleSidebar } = useUIStore();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length <= 1) return "Dashboard";
    const last = segments[segments.length - 1];
    return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
  };

  const roleColorMap = {
    super_admin: "bg-[#9A62FA]",
    admin: "bg-[#4299EB]",
    editor: "bg-[#46BB78]",
    analyst: "bg-[#F5BD32]",
  };

  const getInitials = (email?: string) => {
    return email ? email.substring(0, 2).toUpperCase() : "??";
  };

  return (
    <header className="h-16 bg-white border-b border-[#E0E8EF] flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-[#4F5C72]" 
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>
        <h1 className="text-lg font-bold text-[#1C2238] tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B8]" size={16} />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-[#EDF1F7] border-none focus-visible:ring-2 focus-visible:ring-[#4299EB] h-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-[#4F5C72] relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#F25959] rounded-full border-2 border-white"></span>
          </Button>
          
          <div className="h-8 w-px bg-[#E0E8EF] mx-1"></div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#1C2238] leading-none mb-0.5">
                {user?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-[10px] text-[#9AA5B8] uppercase tracking-wider font-semibold">
                {user?.role?.replace("_", " ") || "Guest"}
              </p>
            </div>
            <Avatar className={cn("h-8 w-8", user?.role ? roleColorMap[user.role] : "bg-gray-500")}>
              <AvatarFallback className="text-white text-[10px] font-bold">
                {user ? getInitials(user.email) : "?"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}

// Utility import for cn
import { cn } from "@/lib/utils";
