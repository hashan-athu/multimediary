"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getCookieToken } from "@/lib/adminApi";
import { apiClient } from "@/lib/adminApi";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const pathname = usePathname();
  const { token, user, setToken, setUser } = useAuthStore();

  // Restore session after page refresh if cookie exists but Zustand is empty
  useEffect(() => {
    const cookieToken = getCookieToken();
    if (!cookieToken) return;

    if (!token) setToken(cookieToken);

    if (!user) {
      // Fetch user list and match by JWT subject (user id)
      apiClient.users.list().then(({ users }) => {
        if (users.length > 0 && !useAuthStore.getState().user) {
          // The most recently active user matching this session
          // Use the dashboard call (all roles have access) to confirm auth works,
          // then pull the current user from the list. We decode sub from JWT.
          try {
            const parts = cookieToken.split(".");
            const payload = JSON.parse(atob(parts[1]));
            // Devise-JWT puts user id in sub as a string
            const userId = parseInt(payload.sub, 10);
            const match = users.find((u) => u.id === userId);
            if (match) setUser(match);
          } catch {
            // JWT decode failed — silently ignore
          }
        }
      }).catch(() => {
        // If this fails (e.g. 401), the response interceptor handles the redirect
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }, [pathname, setSidebarCollapsed]);

  return (
    <div className="min-h-screen bg-[#F4F5F8]">
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
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
