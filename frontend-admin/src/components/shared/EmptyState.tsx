import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-[#EDF1F7] flex items-center justify-center mb-6">
        <Icon size={40} className="text-[#9AA5B8]" />
      </div>
      <h3 className="text-xl font-bold text-[#1C2238] mb-2">{title}</h3>
      <p className="text-[#4F5C72] max-w-sm mb-8">{description}</p>
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-[#4299EB] hover:bg-[#3182CE] text-white font-semibold rounded-lg px-6"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
