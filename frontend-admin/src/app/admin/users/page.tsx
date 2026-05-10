"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  UserPlus, Search, Shield, Calendar, MoreVertical, Trash2, ShieldCheck,
} from "lucide-react";
import { apiClient, extractApiError } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, SortableHeader } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { User, Role } from "@/types";
import { RoleBadge } from "@/components/shared/Badges";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

const ROLES: Role[] = ["super_admin", "admin", "editor", "analyst"];
const ROLE_COLORS: Record<Role, string> = {
  super_admin: "bg-[#9A62FA]",
  admin: "bg-[#4299EB]",
  editor: "bg-[#46BB78]",
  analyst: "bg-[#F5BD32]",
};

function InviteUserDialog({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) { toast.error("Email and password are required"); return; }
    setSaving(true);
    try {
      await apiClient.users.create({ email: email.trim(), password, role });
      toast.success(`User ${email} invited`);
      onSaved();
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-8 border-none shadow-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-[#1C2238] font-bold text-lg">Invite New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Email *</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="h-10 bg-[#EDF1F7] border-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Password *</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="h-10 bg-[#EDF1F7] border-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full h-10 px-3 bg-[#EDF1F7] border-none rounded-md text-sm font-medium text-[#1C2238] outline-none focus:ring-2 focus:ring-[#4299EB]"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="ghost" className="bg-[#EDF1F7] text-[#4F5C72] font-bold" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button className="bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold" onClick={handleSubmit} disabled={saving}>
            {saving ? "Inviting..." : "Invite User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ChangeRoleDialog({ user, open, onClose, onSaved }: { user: User | null; open: boolean; onClose: () => void; onSaved: () => void }) {
  const [role, setRole] = useState<Role>(user?.role ?? "editor");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await apiClient.users.update(user.id, { role });
      toast.success(`Role updated to ${role.replace(/_/g, " ")}`);
      onSaved();
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl p-8 border-none shadow-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-[#1C2238] font-bold text-lg">Change Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm text-[#4F5C72] font-medium mb-4">
            Updating role for <strong>{user?.email}</strong>
          </p>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full h-10 px-3 bg-[#EDF1F7] border-none rounded-md text-sm font-medium text-[#1C2238] outline-none focus:ring-2 focus:ring-[#4299EB]"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="ghost" className="bg-[#EDF1F7] text-[#4F5C72] font-bold" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button className="bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersPage() {
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  const isSuperAdmin = currentUser?.role === "super_admin";

  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [changeRoleTarget, setChangeRoleTarget] = useState<User | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.users.list(),
  });

  const users = data?.users ?? [];
  const filtered = search
    ? users.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()))
    : users;

  const handleDelete = async (user: User) => {
    try {
      await apiClient.users.delete(user.id);
      toast.success(`User ${user.email} removed`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (err) {
      toast.error(extractApiError(err));
    }
  };

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    setInviteOpen(false);
    setChangeRoleTarget(null);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "email",
      header: ({ column }) => <SortableHeader column={column} title="User" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className={cn("h-9 w-9", ROLE_COLORS[row.original.role as Role] ?? "bg-gray-400")}>
            <AvatarFallback className="text-white font-bold text-xs uppercase">
              {row.original.email?.substring(0, 2) ?? "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-[#1C2238]">{row.original.email?.split("@")[0] ?? "User"}</span>
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
      header: "Joined",
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
        if (isSelf || !isSuperAdmin) return null;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-[#9AA5B8] hover:bg-accent">
                <MoreVertical size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#E0E8EF] shadow-xl">
                <DropdownMenuItem
                  className="gap-2 cursor-pointer py-2 font-medium"
                  onSelect={() => setChangeRoleTarget(row.original)}
                >
                  <Shield size={14} className="text-[#4299EB]" /> Change Role
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <ConfirmDialog
                  title={`Remove ${row.original.email}?`}
                  description="This user will lose all access. This cannot be undone."
                  confirmLabel="Remove User"
                  variant="destructive"
                  onConfirm={() => handleDelete(row.original)}
                >
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="gap-2 cursor-pointer py-2 font-medium text-[#F25959]"
                  >
                    <Trash2 size={14} /> Remove User
                  </DropdownMenuItem>
                </ConfirmDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const roleCounts = ROLES.reduce((acc, r) => {
    acc[r] = users.filter((u) => u.role === r).length;
    return acc;
  }, {} as Record<Role, number>);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="User Management"
        subtitle="Manage administrative access and roles"
        actions={
          isSuperAdmin && (
            <Button
              className="bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold h-10 px-6 rounded-lg shadow-sm"
              onClick={() => setInviteOpen(true)}
            >
              <UserPlus size={18} className="mr-2" /> Invite User
            </Button>
          )
        }
      />

      <div className="bg-[#4299EB]/5 border border-[#4299EB]/10 rounded-xl p-4 flex items-center gap-3">
        <ShieldCheck size={20} className="text-[#4299EB]" />
        <p className="text-sm font-medium text-[#4299EB]">
          <span className="font-bold">Super Admin only:</span> Only super admins can invite users, change roles, or remove users.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Super Admins", role: "super_admin" as Role, color: "#9A62FA" },
          { label: "Admins", role: "admin" as Role, color: "#4299EB" },
          { label: "Editors", role: "editor" as Role, color: "#46BB78" },
          { label: "Analysts", role: "analyst" as Role, color: "#F5BD32" },
        ].map((s) => (
          <div key={s.role} className="bg-white p-4 rounded-xl border border-[#E0E8EF] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider mb-0.5">{s.label}</p>
              <p className="text-xl font-bold text-[#1C2238]">{roleCounts[s.role] ?? 0}</p>
            </div>
            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: s.color }} />
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#E0E8EF] shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B8]" size={16} />
          <Input
            placeholder="Search users by email..."
            className="pl-10 bg-[#EDF1F7] border-none h-10 rounded-lg text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={isLoading} />

      <InviteUserDialog open={inviteOpen} onClose={() => setInviteOpen(false)} onSaved={handleSaved} />
      <ChangeRoleDialog
        user={changeRoleTarget}
        open={changeRoleTarget !== null}
        onClose={() => setChangeRoleTarget(null)}
        onSaved={handleSaved}
      />
    </div>
  );
}
