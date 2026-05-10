"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  UserPlus, 
  Search, 
  Shield, 
  Mail, 
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { apiClient } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, SortableHeader } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { User, Role } from "@/types";
import { RoleBadge } from "@/components/shared/Badges";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export default function UsersPage() {
  const { user: currentUser } = useAuthStore();
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.users.list(),
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "email",
      header: ({ column }) => <SortableHeader column={column} title="User" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className={cn("h-9 w-9", 
            row.original.role === "super_admin" ? "bg-[#9A62FA]" : 
            row.original.role === "admin" ? "bg-[#4299EB]" : 
            "bg-[#46BB78]"
          )}>
            <AvatarFallback className="text-white font-bold text-xs uppercase">
              {row.original.email?.substring(0, 2) || "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-[#1C2238]">{row.original.email?.split("@")[0] || "User"}</span>
            <span className="text-[11px] text-[#9AA5B8] font-medium">{row.original.email}</span>
          </div>
          {row.original.id === currentUser?.id && (
            <span className="ml-2 px-1.5 py-0.5 rounded bg-[#EDF1F7] text-[#4F5C72] text-[9px] font-bold uppercase tracking-widest">
              You
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <RoleBadge role={row.original.role as Role} />,
    },
    {
      accessorKey: "created_at",
      header: "Joined Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-[#4F5C72] font-medium">
          <Calendar size={14} className="text-[#9AA5B8]" />
          {new Date(row.original.created_at).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isSelf = row.original.id === currentUser?.id;
        const isSuperAdmin = currentUser?.role === "super_admin";
        
        if (isSelf) return null;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#9AA5B8]">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#E0E8EF] shadow-xl">
                {isSuperAdmin && (
                  <>
                    <DropdownMenuItem className="gap-2 cursor-pointer py-2 font-medium">
                      <Shield size={14} className="text-[#4299EB]" /> Change Role
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer py-2 font-medium text-[#F25959]">
                      <Trash2 size={14} /> Remove User
                    </DropdownMenuItem>
                  </>
                )}
                {!isSuperAdmin && (
                  <DropdownMenuItem disabled className="text-[11px] text-[#9AA5B8] italic">
                    Insufficient permissions
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="User Management"
        subtitle="Manage administrative access and roles"
        actions={
          currentUser?.role === "super_admin" && (
            <Button className="bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold h-10 px-6 rounded-lg shadow-sm">
              <UserPlus size={18} className="mr-2" /> Invite User
            </Button>
          )
        }
      />

      {/* Access Notice */}
      <div className="bg-[#4299EB]/5 border border-[#4299EB]/10 rounded-xl p-4 flex items-center gap-3">
        <ShieldCheck size={20} className="text-[#4299EB]" />
        <p className="text-sm font-medium text-[#4299EB]">
          <span className="font-bold">Super Admin only:</span> Admins can view but cannot modify roles or remove users.
        </p>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Super Admins", value: Array.isArray(users) ? users.filter(u => u.role === "super_admin").length : 0, color: "#9A62FA" },
          { label: "Admins", value: Array.isArray(users) ? users.filter(u => u.role === "admin").length : 0, color: "#4299EB" },
          { label: "Editors", value: Array.isArray(users) ? users.filter(u => u.role === "editor").length : 0, color: "#46BB78" },
          { label: "Analysts", value: Array.isArray(users) ? users.filter(u => u.role === "analyst").length : 0, color: "#F5BD32" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-[#E0E8EF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider mb-0.5">{stat.label}</p>
              <p className="text-xl font-bold text-[#1C2238]">{stat.value}</p>
            </div>
            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: stat.color }} />
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#E0E8EF] shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B8]" size={16} />
          <Input 
            placeholder="Search users by name or email..." 
            className="pl-10 bg-[#EDF1F7] border-none h-10 rounded-lg text-sm"
          />
        </div>
      </div>

      <DataTable columns={columns} data={users || []} isLoading={isLoading} />
    </div>
  );
}
