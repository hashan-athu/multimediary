"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
  Settings, 
  Edit2, 
  Trash2,
  AlertTriangle,
  Info
} from "lucide-react";
import { apiClient } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export default function LibraryPage() {
  const pathname = usePathname();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const sections = [
    { label: "Genres", href: "/admin/library/genres" },
    { label: "Categories", href: "/admin/library/categories" },
    { label: "Qualities", href: "/admin/library/qualities" },
    { label: "Disk Formats", href: "/admin/library/disk-formats" },
    { label: "Reviewers", href: "/admin/library/reviewers" },
  ];

  const currentSection = sections.find(s => pathname.includes(s.href))?.label || "Genres";

  // Mock data for illustration since the API structure varies per section
  const items = [
    { id: 1, name: "Action", count: 154, description: "Fast-paced movies" },
    { id: 2, name: "Comedy", count: 89, description: "Funny movies" },
    { id: 3, name: "Drama", count: 210, description: "Serious movies" },
    { id: 4, name: "Sci-Fi", count: 67, description: "Futuristic movies" },
  ];

  const handleUpdateField = (field: string, value: string) => {
    setSelectedItem((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Library Settings"
        subtitle="Manage taxonomy and metadata types"
      />

      {/* Sub-nav Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-[#EDF1F7] rounded-xl w-fit">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Button 
              variant="ghost" 
              className={cn(
                "h-10 px-6 rounded-lg font-bold text-sm transition-all",
                pathname.includes(section.href) ? "bg-white text-[#4299EB] shadow-sm" : "text-[#8892B0]"
              )}
            >
              {section.label}
            </Button>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left List Panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E0E8EF] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E0E8EF] flex items-center justify-between bg-[#F4F5F8]/30">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B8]" size={14} />
              <Input 
                placeholder={`Search ${currentSection.toLowerCase()}...`} 
                className="pl-9 h-9 bg-white border-[#E0E8EF] text-xs"
              />
            </div>
            <Button className="h-9 bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold text-xs rounded-lg px-4">
              <Plus size={14} className="mr-1.5" /> Add {currentSection.slice(0, -1)}
            </Button>
          </div>

          <div className="divide-y divide-[#E0E8EF]">
            {items.map((item) => (
              <div 
                key={item.id} 
                className={cn(
                  "p-4 flex items-center justify-between hover:bg-[#F4F5F8]/50 transition-colors cursor-pointer group",
                  selectedItem?.id === item.id && "bg-[#4299EB]/5 border-l-4 border-l-[#4299EB]"
                )}
                onClick={() => { setSelectedItem(item); setIsEditing(true); }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#EDF1F7] flex items-center justify-center text-[#4F5C72] font-bold text-xs">
                    {item.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1C2238] text-sm">{item.name}</h4>
                    <p className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider">{item.count} movies use this</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-[#4F5C72] hover:bg-white">
                    <Edit2 size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-[#F25959] hover:bg-[#F25959]/10">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-2 space-y-6 sticky top-24">
          {selectedItem ? (
            <Card className="p-8 border-none shadow-sm bg-white space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#4299EB]/10 flex items-center justify-center text-[#4299EB]">
                  <Settings size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#1C2238]">Edit {currentSection.slice(0, -1)}</h3>
                  <p className="text-xs text-[#4F5C72] font-medium">Update properties for {selectedItem.name}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Name*</label>
                  <Input 
                    value={selectedItem.name} 
                    onChange={(e) => handleUpdateField("name", e.target.value)}
                    className="h-11 bg-[#EDF1F7] border-none rounded-xl font-medium"
                  />
                </div>

                {currentSection === "Genres" && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Description</label>
                    <textarea 
                      className="w-full p-4 bg-[#EDF1F7] border-none rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-[#4299EB] min-h-[100px]"
                      placeholder="Enter description..."
                      value={selectedItem.description || ""}
                      onChange={(e) => handleUpdateField("description", e.target.value)}
                    />
                  </div>
                )}
              </div>

              {selectedItem.count > 0 && (
                <div className="bg-[#F5BD32]/10 border border-[#F5BD32]/20 rounded-xl p-4 flex gap-3">
                  <AlertTriangle size={18} className="text-[#F5BD32] shrink-0 mt-0.5" />
                  <p className="text-[11px] font-medium text-[#F5BD32] leading-relaxed">
                    This {currentSection.slice(0, -1).toLowerCase()} is used by {selectedItem.count} movies. 
                    Remove it from all movies before you can delete it.
                  </p>
                </div>
              )}

              <div className="pt-4 flex items-center gap-3">
                <Button className="flex-1 h-11 bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold rounded-xl">
                  Save Changes
                </Button>
                <Button 
                  variant="ghost" 
                  className="h-11 bg-[#EDF1F7] text-[#4F5C72] font-bold rounded-xl px-6"
                  onClick={() => setSelectedItem(null)}
                >
                  Cancel
                </Button>
              </div>

              <div className="pt-6 border-t border-[#E0E8EF]">
                <div className="bg-[#F25959]/5 border border-[#F25959]/10 rounded-xl p-6">
                  <h4 className="text-sm font-bold text-[#F25959] mb-2">Danger Zone</h4>
                  <p className="text-xs text-[#4F5C72] font-medium mb-4">Once deleted, this item cannot be recovered.</p>
                  <Button 
                    variant="ghost" 
                    disabled={selectedItem.count > 0}
                    className="w-full h-10 border border-[#F25959]/20 text-[#F25959] hover:bg-[#F25959] hover:text-white font-bold rounded-lg transition-all"
                  >
                    Permanently Delete
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 border-dashed border-2 border-[#E0E8EF] bg-transparent flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#EDF1F7] flex items-center justify-center mb-6">
                <Info size={32} className="text-[#9AA5B8]" />
              </div>
              <h3 className="font-bold text-[#1C2238] mb-2">No Item Selected</h3>
              <p className="text-[#4F5C72] text-sm max-w-[200px]">Select an item from the list to edit or click the add button to create a new one.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
