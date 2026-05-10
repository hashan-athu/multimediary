"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Settings, Edit2, Trash2, Info } from "lucide-react";
import { apiClient, extractApiError } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

type SectionItem = { id: number; name: string; description?: string; website_url?: string };

type SectionConfig = {
  label: string;
  singular: string;
  queryKey: string;
  listFn: () => Promise<{ data: SectionItem[]; count: number }>;
  createFn: (data: Record<string, unknown>) => Promise<SectionItem>;
  updateFn: (id: number, data: Record<string, unknown>) => Promise<SectionItem>;
  deleteFn: (id: number) => Promise<unknown>;
  hasDescription: boolean;
  hasUrl: boolean;
};

async function wrapList<K extends string>(
  fn: () => Promise<Record<K, SectionItem[]>>,
  key: K
): Promise<{ data: SectionItem[]; count: number }> {
  const res = await fn();
  const items = res[key] ?? [];
  return { data: items, count: items.length };
}

const SECTION_MAP: Record<string, SectionConfig> = {
  genres: {
    label: "Genres", singular: "Genre", queryKey: "genres",
    listFn: () => wrapList(() => apiClient.genres.list({ per_page: 100 }), "genres"),
    createFn: (d) => apiClient.genres.create(d),
    updateFn: (id, d) => apiClient.genres.update(id, d),
    deleteFn: (id) => apiClient.genres.delete(id),
    hasDescription: true, hasUrl: false,
  },
  categories: {
    label: "Categories", singular: "Category", queryKey: "categories",
    listFn: () => wrapList(() => apiClient.categories.list({ per_page: 100 }), "categories"),
    createFn: (d) => apiClient.categories.create(d),
    updateFn: (id, d) => apiClient.categories.update(id, d),
    deleteFn: (id) => apiClient.categories.delete(id),
    hasDescription: false, hasUrl: false,
  },
  qualities: {
    label: "Qualities", singular: "Quality", queryKey: "qualities",
    listFn: () => wrapList(() => apiClient.qualities.list({ per_page: 100 }), "qualities"),
    createFn: (d) => apiClient.qualities.create(d),
    updateFn: (id, d) => apiClient.qualities.update(id, d),
    deleteFn: (id) => apiClient.qualities.delete(id),
    hasDescription: false, hasUrl: false,
  },
  "disk-formats": {
    label: "Disk Formats", singular: "Disk Format", queryKey: "disk_formats",
    listFn: () => wrapList(() => apiClient.diskFormats.list({ per_page: 100 }), "disk_formats"),
    createFn: (d) => apiClient.diskFormats.create(d),
    updateFn: (id, d) => apiClient.diskFormats.update(id, d),
    deleteFn: (id) => apiClient.diskFormats.delete(id),
    hasDescription: false, hasUrl: false,
  },
  reviewers: {
    label: "Reviewers", singular: "Reviewer", queryKey: "reviewers",
    listFn: () => wrapList(() => apiClient.reviewers.list({ per_page: 100 }), "reviewers"),
    createFn: (d) => apiClient.reviewers.create(d),
    updateFn: (id, d) => apiClient.reviewers.update(id, d),
    deleteFn: (id) => apiClient.reviewers.delete(id),
    hasDescription: false, hasUrl: true,
  },
};

const SECTIONS = [
  { label: "Genres", href: "/admin/library/genres" },
  { label: "Categories", href: "/admin/library/categories" },
  { label: "Qualities", href: "/admin/library/qualities" },
  { label: "Disk Formats", href: "/admin/library/disk-formats" },
  { label: "Reviewers", href: "/admin/library/reviewers" },
];

export default function LibraryPage() {
  const pathname = usePathname();
  const params = useParams();
  const section = params.section as string;
  const config = SECTION_MAP[section];
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<SectionItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [config?.queryKey],
    queryFn: config?.listFn,
    enabled: !!config,
  });

  if (!config) {
    return (
      <div className="p-8 text-center text-[#4F5C72]">
        Unknown library section: <strong>{section}</strong>
      </div>
    );
  }

  const items = data?.data ?? [];
  const filtered = search
    ? items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : items;

  const startEdit = (item: SectionItem) => {
    setIsCreating(false);
    setSelectedItem(item);
    setFormName(item.name);
    setFormDescription(item.description ?? "");
    setFormUrl(item.website_url ?? "");
  };

  const startCreate = () => {
    setSelectedItem(null);
    setIsCreating(true);
    setFormName("");
    setFormDescription("");
    setFormUrl("");
  };

  const cancelForm = () => {
    setSelectedItem(null);
    setIsCreating(false);
  };

  const buildPayload = () => {
    const p: Record<string, unknown> = { name: formName.trim() };
    if (config.hasDescription) p.description = formDescription.trim();
    if (config.hasUrl) p.website_url = formUrl.trim();
    return p;
  };

  const handleSave = async () => {
    if (!formName.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      if (isCreating) {
        await config.createFn(buildPayload());
        toast.success(`${config.singular} created`);
      } else if (selectedItem) {
        await config.updateFn(selectedItem.id, buildPayload());
        toast.success(`${config.singular} updated`);
      }
      queryClient.invalidateQueries({ queryKey: [config.queryKey] });
      cancelForm();
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: SectionItem) => {
    try {
      await config.deleteFn(item.id);
      toast.success(`"${item.name}" deleted`);
      queryClient.invalidateQueries({ queryKey: [config.queryKey] });
      if (selectedItem?.id === item.id) cancelForm();
    } catch (err) {
      toast.error(extractApiError(err));
    }
  };

  const showForm = isCreating || selectedItem !== null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Library Settings"
        subtitle="Manage taxonomy and metadata types"
      />

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-[#EDF1F7] rounded-xl w-fit">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href}>
            <Button
              variant="ghost"
              className={cn(
                "h-10 px-6 rounded-lg font-bold text-sm transition-all",
                pathname.includes(s.href) ? "bg-white text-[#4299EB] shadow-sm" : "text-[#8892B0]"
              )}
            >
              {s.label}
            </Button>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* List Panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E0E8EF] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E0E8EF] flex items-center justify-between bg-[#F4F5F8]/30 gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B8]" size={14} />
              <Input
                placeholder={`Search ${config.label.toLowerCase()}...`}
                className="pl-9 h-9 bg-white border-[#E0E8EF] text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              className="h-9 bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold text-xs rounded-lg px-4 shrink-0"
              onClick={startCreate}
            >
              <Plus size={14} className="mr-1.5" /> Add {config.singular}
            </Button>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-[#EDF1F7] animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-[#9AA5B8] font-medium text-sm">
              {search ? `No ${config.label.toLowerCase()} matching "${search}"` : `No ${config.label.toLowerCase()} yet`}
            </div>
          ) : (
            <div className="divide-y divide-[#E0E8EF]">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 flex items-center justify-between hover:bg-[#F4F5F8]/50 transition-colors cursor-pointer group",
                    selectedItem?.id === item.id && "bg-[#4299EB]/5 border-l-4 border-l-[#4299EB]"
                  )}
                  onClick={() => startEdit(item)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#EDF1F7] flex items-center justify-center text-[#4F5C72] font-bold text-xs shrink-0">
                      {item.name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#1C2238] text-sm truncate">{item.name}</h4>
                      {item.description && (
                        <p className="text-[11px] text-[#9AA5B8] truncate max-w-[280px]">{item.description}</p>
                      )}
                      {item.website_url && (
                        <p className="text-[11px] text-[#4299EB] truncate max-w-[280px]">{item.website_url}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-lg text-[#4F5C72] hover:bg-white"
                      onClick={(e) => { e.stopPropagation(); startEdit(item); }}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <ConfirmDialog
                      title={`Delete "${item.name}"?`}
                      description={`This will permanently remove this ${config.singular.toLowerCase()}. This cannot be undone.`}
                      confirmLabel="Delete"
                      variant="destructive"
                      onConfirm={() => handleDelete(item)}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg text-[#F25959] hover:bg-[#F25959]/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </ConfirmDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Panel */}
        <div className="lg:col-span-2 space-y-6 sticky top-24">
          {showForm ? (
            <Card className="p-8 border-none shadow-sm bg-white space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#4299EB]/10 flex items-center justify-center text-[#4299EB]">
                  <Settings size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#1C2238]">
                    {isCreating ? `New ${config.singular}` : `Edit ${config.singular}`}
                  </h3>
                  {selectedItem && (
                    <p className="text-xs text-[#4F5C72] font-medium">
                      Updating {selectedItem.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">
                    Name *
                  </label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={`${config.singular} name`}
                    className="h-11 bg-[#EDF1F7] border-none rounded-xl font-medium"
                    onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                  />
                </div>

                {config.hasDescription && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">
                      Description
                    </label>
                    <textarea
                      className="w-full p-4 bg-[#EDF1F7] border-none rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-[#4299EB] min-h-[100px] resize-none"
                      placeholder="Enter description..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                    />
                  </div>
                )}

                {config.hasUrl && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">
                      Website URL
                    </label>
                    <Input
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      placeholder="https://..."
                      className="h-11 bg-[#EDF1F7] border-none rounded-xl font-medium"
                      type="url"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center gap-3">
                <Button
                  className="flex-1 h-11 bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold rounded-xl"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : isCreating ? `Create ${config.singular}` : "Save Changes"}
                </Button>
                <Button
                  variant="ghost"
                  className="h-11 bg-[#EDF1F7] text-[#4F5C72] font-bold rounded-xl px-6"
                  onClick={cancelForm}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>

              {!isCreating && selectedItem && (
                <div className="pt-6 border-t border-[#E0E8EF]">
                  <div className="bg-[#F25959]/5 border border-[#F25959]/10 rounded-xl p-6">
                    <h4 className="text-sm font-bold text-[#F25959] mb-2">Danger Zone</h4>
                    <p className="text-xs text-[#4F5C72] font-medium mb-4">
                      Deleting will fail if this {config.singular.toLowerCase()} is in use.
                    </p>
                    <ConfirmDialog
                      title={`Delete "${selectedItem.name}"?`}
                      description={`This will permanently remove this ${config.singular.toLowerCase()}. This cannot be undone.`}
                      confirmLabel="Delete"
                      variant="destructive"
                      onConfirm={() => handleDelete(selectedItem)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full h-10 border border-[#F25959]/20 text-[#F25959] hover:bg-[#F25959] hover:text-white font-bold rounded-lg transition-all"
                      >
                        Permanently Delete
                      </Button>
                    </ConfirmDialog>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-12 border-dashed border-2 border-[#E0E8EF] bg-transparent flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#EDF1F7] flex items-center justify-center mb-6">
                <Info size={32} className="text-[#9AA5B8]" />
              </div>
              <h3 className="font-bold text-[#1C2238] mb-2">No Item Selected</h3>
              <p className="text-[#4F5C72] text-sm max-w-[200px]">
                Select an item to edit, or click <strong>Add {config.singular}</strong> to create a new one.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
