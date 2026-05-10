import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { HardDrive, Monitor, CheckCircle } from "lucide-react";

export function RoleBadge({ role }: { role: Role }) {
  const configs = {
    super_admin: { label: "Super Admin", color: "bg-[#9A62FA]/10 text-[#9A62FA] border-[#9A62FA]/20" },
    admin: { label: "Admin", color: "bg-[#4299EB]/10 text-[#4299EB] border-[#4299EB]/20" },
    editor: { label: "Editor", color: "bg-[#46BB78]/10 text-[#46BB78] border-[#46BB78]/20" },
    analyst: { label: "Analyst", color: "bg-[#F5BD32]/10 text-[#F5BD32] border-[#F5BD32]/20" },
  };

  const config = configs[role];

  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
      config.color
    )}>
      {config.label}
    </span>
  );
}

export function DiskBadge({ name }: { name?: string | null }) {
  if (!name) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5BD32]/10 text-[#F5BD32] text-[11px] font-bold border border-[#F5BD32]/20">
        No disk
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4299EB]/10 text-[#4299EB] text-[11px] font-bold border border-[#4299EB]/20">
      <HardDrive size={12} />
      {name}
    </span>
  );
}

export function QualityBadge({ quality }: { quality: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold">
      <Monitor size={10} />
      {quality}
    </span>
  );
}

export function TMDbBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#46BB78]/10 text-[#46BB78] text-[11px] font-bold border border-[#46BB78]/20">
      <CheckCircle size={12} />
      TMDb ✓
    </span>
  );
}
