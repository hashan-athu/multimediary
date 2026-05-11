import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  accentColor: string;
  icon: LucideIcon;
}

export default function StatCard({ 
  label, 
  value, 
  subLabel, 
  accentColor, 
  icon: Icon 
}: StatCardProps) {
  return (
    <Card className="p-5 border-none shadow-sm relative overflow-hidden flex flex-col gap-1 group hover:shadow-md transition-shadow">
      {/* Left Accent Border */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1" 
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="flex items-center justify-between mb-2">
        <div 
          className="p-2.5 rounded-xl transition-colors"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon size={20} style={{ color: accentColor }} />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-[#1C2238] tracking-tight">
          {value}
        </h3>
        <p className="text-xs font-semibold text-[#4F5C72] uppercase tracking-wider">
          {label}
        </p>
      </div>

      {subLabel && (
        <p className="text-[10px] text-[#9AA5B8] font-medium mt-1">
          {subLabel}
        </p>
      )}
    </Card>
  );
}
