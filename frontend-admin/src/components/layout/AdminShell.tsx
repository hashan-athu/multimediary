"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const pathname = usePathname();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }, [pathname, setSidebarCollapsed]);

  return (
    <div className="min-h-screen bg-[#F4F5F8]">
      {/* Overlay for mobile */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <Sidebar />
      
      <div 
        className={cn(
          "transition-all duration-300 flex flex-col min-h-screen",
          "lg:pl-[240px]",
          sidebarCollapsed && "lg:pl-[72px]"
        )}
      >
        <Topbar />
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
