"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
  HardDrive, 
  Disc, 
  Database,
  Usb,
  MoreVertical,
  Eye,
  Edit2,
  Trash2
} from "lucide-react";
import { apiClient } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, SortableHeader } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Disk } from "@/types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DisksPage() {
  const { data: disks, isLoading } = useQuery({
    queryKey: ["disks"],
    queryFn: () => apiClient.disks.list(),
  });

  const columns: ColumnDef<Disk>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} title="Disk Name" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            row.original.disk_format.name === "HDD" ? "bg-[#46BB78]/10 text-[#46BB78]" :
            row.original.disk_format.name === "DVD" ? "bg-[#4299EB]/10 text-[#4299EB]" :
            "bg-[#9A62FA]/10 text-[#9A62FA]"
          )}>
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
        const format = row.original.disk_format.name;
        const colors = {
          DVD: "bg-[#4299EB]/10 text-[#4299EB] border-[#4299EB]/20",
          HDD: "bg-[#46BB78]/10 text-[#46BB78] border-[#46BB78]/20",
          "Blu-ray": "bg-[#9A62FA]/10 text-[#9A62FA] border-[#9A62FA]/20",
          USB: "bg-[#F5BD32]/10 text-[#F5BD32] border-[#F5BD32]/20",
        };
        return (
          <span className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-bold border",
            colors[format as keyof typeof colors] || "bg-[#EDF1F7] text-[#4F5C72]"
          )}>
            {format}
          </span>
        );
      },
    },
    {
      accessorKey: "storage_type",
      header: "Storage Type",
    },
    {
      accessorKey: "movie_count",
      header: "Movies",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1C2238]">{row.original.movie_count}</span>
          <span className="text-[10px] font-bold text-[#9AA5B8] uppercase">titles</span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#9AA5B8]">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl border-[#E0E8EF] shadow-xl">
              <DropdownMenuItem className="gap-2 cursor-pointer py-2 font-medium">
                <Link href={`/admin/disks/${row.original.id}`}>
                  <Eye size={14} className="text-[#4299EB]" /> View Titles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer py-2 font-medium">
                <Edit2 size={14} className="text-[#46BB78]" /> Edit Disk
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={row.original.movie_count > 0}
                className="gap-2 cursor-pointer py-2 font-medium text-[#F25959]"
              >
                <Trash2 size={14} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Disks"
        subtitle="Manage your physical storage media"
        actions={
          <Button className="bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold h-10 px-6 rounded-lg shadow-sm">
            <Plus size={18} className="mr-2" /> Add Disk
          </Button>
        }
      />

      {/* Mini Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Disks", value: Array.isArray(disks) ? disks.length : 0, color: "#1C2238" },
          { label: "HDD Storage", value: Array.isArray(disks) ? disks.filter(d => d.disk_format.name === "HDD").length : 0, color: "#46BB78" },
          { label: "DVD Cases", value: Array.isArray(disks) ? disks.filter(d => d.disk_format.name === "DVD").length : 0, color: "#4299EB" },
          { label: "Blu-ray Disks", value: Array.isArray(disks) ? disks.filter(d => d.disk_format.name === "Blu-ray").length : 0, color: "#9A62FA" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-[#E0E8EF] shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: stat.color }} />
            <p className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-[#1C2238]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#E0E8EF] shadow-sm mb-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B8]" size={16} />
          <Input 
            placeholder="Search disks by name..." 
            className="pl-10 bg-[#EDF1F7] border-none h-10 rounded-lg text-sm"
          />
        </div>
      </div>

      <DataTable columns={columns} data={disks || []} isLoading={isLoading} />
    </div>
  );
}
