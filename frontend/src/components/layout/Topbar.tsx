"use client";

import { Menu, ExternalLink } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { NotificationBell } from "@/components/layout/NotificationBell";

const roleColorMap: Record<string, string> = {
  super_admin: "bg-[#9A62FA]",
  admin: "bg-[#4299EB]",
  editor: "bg-[#46BB78]",
  analyst: "bg-[#F5BD32]",
};

const PARENT_SINGULAR: Record<string, string> = {
  movies: "Movie",
  actors: "Actor",
  directors: "Director",
  disks: "Disk",
  users: "User",
  genres: "Genre",
  categories: "Category",
  qualities: "Quality",
  reviewers: "Reviewer",
};

export default function Topbar() {
  const { toggleSidebar } = useUIStore();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length <= 1) return "Dashboard";

    const last = segments[segments.length - 1];
    const parent = segments[segments.length - 2];

    if (/^\d+$/.test(last)) {
      const singular = PARENT_SINGULAR[parent] ?? (parent.charAt(0).toUpperCase() + parent.slice(1));
      return `${singular} Detail`;
    }

    if (last === "new") {
      const singular = PARENT_SINGULAR[parent] ?? parent;
      return `New ${singular}`;
    }

    return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
  };

  const getInitials = (email?: string) =>
    email ? email.substring(0, 2).toUpperCase() : "??";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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

      <div className="flex items-center gap-2">
        <GlobalSearch />

        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E0E8EF] text-[#4F5C72] text-xs font-medium hover:bg-[#EDF1F7] transition-colors whitespace-nowrap"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Visit Site</span>
        </a>

        <NotificationBell />

        <div className="h-8 w-px bg-[#E0E8EF] mx-1" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-[#1C2238] leading-none mb-0.5">
              {user?.email?.split("@")[0] || "Loading..."}
            </p>
            <p className="text-[10px] text-[#9AA5B8] uppercase tracking-wider font-semibold">
              {user?.role?.replace(/_/g, " ") || ""}
            </p>
          </div>
          <Avatar
            className={cn(
              "h-8 w-8",
              user?.role ? roleColorMap[user.role] : "bg-gray-400"
            )}
          >
            <AvatarFallback className="text-white text-[10px] font-bold">
              {getInitials(user?.email)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
