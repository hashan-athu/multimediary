"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, HardDrive } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import { DashboardStats } from "@/types";

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get("/admin/dashboard").then((r) => r.data as DashboardStats),
    staleTime: 60_000,
  });

  const withoutDisk = data?.stats?.movies?.without_disk ?? 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-[#4F5C72] hover:bg-[#EDF1F7] transition-colors"
      >
        <Bell size={18} />
        {withoutDisk > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F25959] rounded-full border-2 border-white" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#E0E8EF] rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E0E8EF]">
              <p className="text-sm font-bold text-[#1C2238]">Notifications</p>
            </div>

            {withoutDisk === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-[#9AA5B8] font-medium">All movies are assigned to disks</p>
              </div>
            ) : (
              <div className="p-3">
                <Link
                  href="/admin/movies"
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#EDF1F7] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FFF0F0] flex items-center justify-center flex-shrink-0">
                    <HardDrive size={14} className="text-[#F25959]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1C2238]">
                      {withoutDisk} movie{withoutDisk !== 1 ? "s" : ""} without a disk
                    </p>
                    <p className="text-xs text-[#9AA5B8] mt-0.5">
                      Click to view movies and assign them to disks
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
