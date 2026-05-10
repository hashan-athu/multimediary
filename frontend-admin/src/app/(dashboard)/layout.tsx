'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Film, LayoutDashboard, Clapperboard, Users, LogOut, Disc } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-zinc-950 text-zinc-50 overflow-hidden">
        <Sidebar className="border-r border-zinc-800 bg-zinc-950">
          <SidebarHeader className="p-4 border-b border-zinc-800">
            <div className="flex items-center gap-2 px-2">
              <div className="bg-teal-600/20 p-2 rounded-lg">
                <Film className="w-5 h-5 text-teal-400" />
              </div>
              <span className="font-bold text-lg text-zinc-100 tracking-tight">Multimediary</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-zinc-500">Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton render={<Link href="/" className="hover:text-teal-400 transition-colors" />}>
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton render={<Link href="/movies" className="hover:text-teal-400 transition-colors" />}>
                      <Clapperboard />
                      <span>Movies</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton render={<Link href="/directors" className="hover:text-teal-400 transition-colors" />}>
                      <Users />
                      <span>Directors</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton render={<Link href="/genres" className="hover:text-teal-400 transition-colors" />}>
                      <Disc />
                      <span>Genres</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-zinc-800 p-4">
            <div className="flex flex-col gap-4">
              <div className="px-2 text-sm">
                <div className="text-zinc-400">Signed in as</div>
                <div className="font-medium text-zinc-200 truncate">{user.email}</div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-950/30"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur flex items-center px-6 justify-between shrink-0 z-10">
            <h2 className="text-lg font-medium text-zinc-200">Admin Portal</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 capitalize">
                {user.role || 'Admin'}
              </span>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-6 relative z-0">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
