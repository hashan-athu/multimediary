"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Film, 
  HardDrive, 
  Users, 
  Library, 
  UserCircle,
  Power,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Movies", href: "/admin/movies", icon: Film },
  { label: "Disks", href: "/admin/disks", icon: HardDrive },
  { label: "People", href: "/admin/people/actors", icon: Users },
  { label: "Library", href: "/admin/library/genres", icon: Library },
];

const ADMIN_ITEMS = [
  { label: "Users", href: "/admin/users", icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useUIStore();

  const handleLogout = async () => {
    try {
      await apiClient.auth.logout();
    } catch {
      // Ignore server errors — always clear local state
    } finally {
      clearAuth();
      document.cookie = "mm_token=; path=/; max-age=0";
      router.push("/login");
    }
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

  const NavLink = ({ item }: { item: typeof NAV_ITEMS[0] }) => {
    const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
    
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group h-12",
          isActive 
            ? "bg-[#2D4A8A] text-white" 
            : "text-[#8892B0] hover:text-white hover:bg-[#2D4A8A]/50"
        )}
      >
        <item.icon 
          size={18} 
          className={cn(
            "shrink-0",
            isActive ? "text-[#4299EB]" : "text-[#8892B0] group-hover:text-white"
          )} 
        />
        <span className={cn(
          "font-medium text-sm transition-opacity duration-300",
          sidebarCollapsed ? "lg:opacity-0 lg:w-0 overflow-hidden" : "opacity-100"
        )}>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#16213E] transition-all duration-300 border-r border-[#E0E8EF]/10",
        sidebarCollapsed ? "w-0 lg:w-[72px] -translate-x-full lg:translate-x-0" : "w-[240px] translate-x-0"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#E0E8EF]/10 overflow-hidden">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#4299EB] flex items-center justify-center font-bold text-white text-lg">
            M
          </div>
          <span className={cn(
            "font-bold text-white text-lg tracking-tight transition-opacity",
            sidebarCollapsed ? "lg:opacity-0" : "opacity-100"
          )}>
            Multimediary
          </span>
        </div>
        <button 
          onClick={() => setSidebarCollapsed(true)}
          className="lg:hidden text-white/50 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav Section */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 no-scrollbar">
        <div>
          <p className={cn(
            "px-3 mb-2 text-[10px] font-bold text-[#8892B0] uppercase tracking-wider transition-opacity",
            sidebarCollapsed ? "lg:opacity-0" : "opacity-100"
          )}>
            Menu
          </p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        {(user?.role === "super_admin" || user?.role === "admin") && (
          <div>
            <p className={cn(
              "px-3 mb-2 text-[10px] font-bold text-[#8892B0] uppercase tracking-wider transition-opacity",
              sidebarCollapsed ? "lg:opacity-0" : "opacity-100"
            )}>
              Admin
            </p>
            <nav className="space-y-1">
              {ADMIN_ITEMS.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* User Strip */}
      <div className="bg-[#0F1629] p-4 flex items-center gap-3 border-t border-[#E0E8EF]/10 overflow-hidden">
        <div className={cn(
          "h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-white font-bold",
          user?.role ? roleColorMap[user.role] : "bg-gray-500"
        )}>
          {getInitials(user?.email || "")}
        </div>
        
        <div className={cn(
          "flex-1 min-w-0 transition-opacity duration-300",
          sidebarCollapsed ? "lg:opacity-0 lg:w-0" : "opacity-100"
        )}>
          <p className="text-sm font-semibold text-white truncate">
            {user?.email?.split("@")[0] || "User"}
          </p>
          <p className="text-[10px] text-[#8892B0] uppercase tracking-widest font-bold truncate">
            {user?.role?.replace("_", " ") || "Guest"}
          </p>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="text-[#8892B0] hover:text-white hover:bg-white/10 shrink-0"
          onClick={handleLogout}
        >
          <Power size={18} />
        </Button>
      </div>

      {/* Collapse Toggle (Desktop only) */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#4299EB] rounded-full hidden lg:flex items-center justify-center text-white border-2 border-[#F4F5F8] z-[60] shadow-sm hover:scale-110 transition-transform"
      >
        {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
