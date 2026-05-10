"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Search, HardDrive, MoreVertical, Edit2, Trash2,
} from "lucide-react";
import { apiClient, extractApiError } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, SortableHeader } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Disk, DiskFormat } from "@/types";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

const FORMAT_COLORS: Record<string, string> = {
  DVD: "bg-[#4299EB]/10 text-[#4299EB] border-[#4299EB]/20",
  HDD: "bg-[#46BB78]/10 text-[#46BB78] border-[#46BB78]/20",
  "Blu-ray": "bg-[#9A62FA]/10 text-[#9A62FA] border-[#9A62FA]/20",
  USB: "bg-[#F5BD32]/10 text-[#F5BD32] border-[#F5BD32]/20",
};

const FORMAT_ICON_COLORS: Record<string, string> = {
  HDD: "bg-[#46BB78]/10 text-[#46BB78]",
  DVD: "bg-[#4299EB]/10 text-[#4299EB]",
  "Blu-ray": "bg-[#9A62FA]/10 text-[#9A62FA]",
  USB: "bg-[#F5BD32]/10 text-[#F5BD32]",
};

type DiskFormProps = {
  initial?: Disk | null;
  diskFormats: DiskFormat[];
  onClose: () => void;
  onSaved: () => void;
};

function DiskForm({ initial, diskFormats, onClose, onSaved }: DiskFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [storageType, setStorageType] = useState(initial?.storage_type ?? "");
  const [diskFormatId, setDiskFormatId] = useState<number>(
    initial?.disk_format?.id ?? diskFormats[0]?.id ?? 0
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) { toast.error("Disk name is required"); return; }
    if (!diskFormatId) { toast.error("Please select a format"); return; }
    setSaving(true);
    const payload = { name: name.trim(), storage_type: storageType.trim(), disk_format_id: diskFormatId };
    try {
      if (initial) {
        await apiClient.disks.update(initial.id, payload);
        toast.success("Disk updated");
      } else {
        await apiClient.disks.create(payload);
        toast.success("Disk created");
      }
      onSaved();
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Disk Name *</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='e.g. "Main HDD", "Living Room DVD Box"'
          className="h-10 bg-[#EDF1F7] border-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Format *</label>
        <select
          value={diskFormatId}
          onChange={(e) => setDiskFormatId(Number(e.target.value))}
          className="w-full h-10 px-3 bg-[#EDF1F7] border-none rounded-md text-sm font-medium text-[#1C2238] outline-none focus:ring-2 focus:ring-[#4299EB]"
        >
          <option value={0} disabled>— Select format —</option>
          {diskFormats.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Storage Type</label>
        <Input
          value={storageType}
          onChange={(e) => setStorageType(e.target.value)}
          placeholder='e.g. "2TB HDD", "100 disc binder"'
          className="h-10 bg-[#EDF1F7] border-none"
        />
      </div>

      <DialogFooter className="pt-2 gap-2">
        <Button variant="ghost" className="bg-[#EDF1F7] text-[#4F5C72] font-bold" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button className="bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold" onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : initial ? "Save Changes" : "Create Disk"}
        </Button>
      </DialogFooter>
    </div>
  );
}

export default function DisksPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Disk | null>(null);
  const [diskToDelete, setDiskToDelete] = useState<Disk | null>(null);

  const { data: diskData, isLoading } = useQuery({
    queryKey: ["disks"],
    queryFn: () => apiClient.disks.list(),
  });

  const { data: formatData } = useQuery({
    queryKey: ["disk_formats"],
    queryFn: () => apiClient.diskFormats.list(),
  });

  const disks = diskData?.disks ?? [];
  const diskFormats = formatData?.disk_formats ?? [];

  const filtered = search
    ? disks.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    : disks;

  const openCreate = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (disk: Disk) => { setEditing(disk); setDialogOpen(true); };

  const handleDelete = async (disk: Disk) => {
    try {
      await apiClient.disks.delete(disk.id);
      toast.success(`"${disk.name}" deleted`);
      queryClient.invalidateQueries({ queryKey: ["disks"] });
    } catch (err) {
      toast.error(extractApiError(err));
    }
  };

  const handleSaved = () => {
    setDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["disks"] });
  };

  const columns: ColumnDef<Disk>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} title="Disk Name" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", FORMAT_ICON_COLORS[row.original.disk_format?.name] ?? "bg-[#EDF1F7] text-[#4F5C72]")}>
            <HardDrive size={18} />
          </div>
          <span className="font-bold">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "disk_format.name",
      header: "Format",
      cell: ({ row }) => {
        const fmt = row.original.disk_format?.name ?? "—";
        return (
          <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border", FORMAT_COLORS[fmt] ?? "bg-[#EDF1F7] text-[#4F5C72] border-transparent")}>
            {fmt}
          </span>
        );
      },
    },
    {
      accessorKey: "storage_type",
      header: "Storage Type",
      cell: ({ row }) => (
        <span className="text-[#4F5C72] font-medium">{row.original.storage_type || "—"}</span>
      ),
    },
    {
      accessorKey: "movie_count",
      header: "Movies",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1C2238]">{row.original.movie_count ?? 0}</span>
          <span className="text-[10px] font-bold text-[#9AA5B8] uppercase">titles</span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-[#9AA5B8] hover:bg-accent">
              <MoreVertical size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl border-[#E0E8EF] shadow-xl">
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-2 font-medium"
                onClick={() => openEdit(row.original)}
              >
                <Edit2 size={14} className="text-[#46BB78]" /> Edit Disk
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={(row.original.movie_count ?? 0) > 0}
                className="gap-2 cursor-pointer py-2 font-medium text-[#F25959]"
                onClick={() => setDiskToDelete(row.original)}
              >
                <Trash2 size={14} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const statsByFormat = diskFormats.map((f) => ({
    label: f.name,
    count: disks.filter((d) => d.disk_format?.name === f.name).length,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Disks"
        subtitle="Manage your physical storage media"
        actions={
          <Button
            className="bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold h-10 px-6 rounded-lg shadow-sm"
            onClick={openCreate}
          >
            <Plus size={18} className="mr-2" /> Add Disk
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E0E8EF] shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1C2238]" />
          <p className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider mb-1">Total Disks</p>
          <p className="text-xl font-bold text-[#1C2238]">{disks.length}</p>
        </div>
        {statsByFormat.slice(0, 3).map((s, i) => {
          const colors = ["#46BB78", "#4299EB", "#9A62FA"];
          return (
            <div key={s.label} className="bg-white p-4 rounded-xl border border-[#E0E8EF] shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: colors[i] }} />
              <p className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-xl font-bold text-[#1C2238]">{s.count}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#E0E8EF] shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B8]" size={16} />
          <Input
            placeholder="Search disks by name..."
            className="pl-10 bg-[#EDF1F7] border-none h-10 rounded-lg text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={isLoading} />

      <ConfirmDialog
        title={diskToDelete ? `Delete "${diskToDelete.name}"?` : "Delete disk?"}
        description={
          diskToDelete && (diskToDelete.movie_count ?? 0) > 0
            ? `This disk has ${diskToDelete.movie_count} movies. Remove all movies first before deleting.`
            : "This disk will be permanently removed. This cannot be undone."
        }
        confirmLabel="Delete Disk"
        variant="destructive"
        open={diskToDelete !== null}
        onOpenChange={(open) => { if (!open) setDiskToDelete(null); }}
        onConfirm={() => { if (diskToDelete) handleDelete(diskToDelete); }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl p-8 border-none shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-[#1C2238] font-bold text-lg">
              {editing ? "Edit Disk" : "Add New Disk"}
            </DialogTitle>
          </DialogHeader>
          <DiskForm
            initial={editing}
            diskFormats={diskFormats}
            onClose={() => setDialogOpen(false)}
            onSaved={handleSaved}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
