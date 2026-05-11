"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, MapPin, Film, Edit2, Trash2, X } from "lucide-react";
import { apiClient, extractApiError } from "@/lib/adminApi";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Actor, Director } from "@/types";
import { ImageUploadField } from "@/components/shared/ImageUploadField";

type PersonItem = Actor | Director;

function isActor(p: PersonItem | null | undefined): p is Actor {
  return p != null && "gender" in p;
}

type PersonFormProps = {
  isActor: boolean;
  initial?: PersonItem | null;
  onClose: () => void;
  onSaved: () => void;
};

function PersonForm({ isActor: actorMode, initial, onClose, onSaved }: PersonFormProps) {
  const [firstName, setFirstName] = useState(initial?.first_name ?? "");
  const [lastName, setLastName] = useState(initial?.last_name ?? "");
  const [dob, setDob] = useState(initial?.date_of_birth ?? "");
  const [nationality, setNationality] = useState(initial?.nationality ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [gender, setGender] = useState(isActor(initial) ? initial.gender ?? "" : "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }
    setSaving(true);
    const payload: Record<string, unknown> = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      date_of_birth: dob || null,
      nationality: nationality.trim() || null,
      image_url: imageUrl.trim() || null,
    };
    if (actorMode) payload.gender = gender || null;

    try {
      if (initial) {
        if (actorMode) await apiClient.actors.update(initial.id, payload);
        else await apiClient.directors.update(initial.id, payload);
        toast.success("Updated successfully");
      } else {
        if (actorMode) await apiClient.actors.create(payload);
        else await apiClient.directors.create(payload);
        toast.success("Created successfully");
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">First Name *</label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-10 bg-[#EDF1F7] border-none"
            placeholder="First name"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Last Name *</label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-10 bg-[#EDF1F7] border-none"
            placeholder="Last name"
          />
        </div>
      </div>

      {actorMode && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full h-10 px-3 bg-[#EDF1F7] border-none rounded-md text-sm font-medium text-[#1C2238] outline-none focus:ring-2 focus:ring-[#4299EB]"
          >
            <option value="">— Select gender —</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Date of Birth</label>
          <Input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="h-10 bg-[#EDF1F7] border-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Nationality</label>
          <Input
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="h-10 bg-[#EDF1F7] border-none"
            placeholder="e.g. American"
          />
        </div>
      </div>

      <ImageUploadField
        label="Profile Photo"
        value={imageUrl}
        onChange={setImageUrl}
        aspectRatio="square"
      />

      <DialogFooter className="pt-2 gap-2">
        <Button variant="ghost" className="bg-[#EDF1F7] text-[#4F5C72] font-bold" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button className="bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold" onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : initial ? "Save Changes" : "Create"}
        </Button>
      </DialogFooter>
    </div>
  );
}

export default function PeoplePage() {
  const pathname = usePathname();
  const isActors = pathname.includes("actors");
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PersonItem | null>(null);

  const { data: actorData, isLoading: actorsLoading } = useQuery({
    queryKey: ["actors", search],
    queryFn: () => apiClient.actors.list({ "q[first_name_or_last_name_cont]": search || undefined }),
    enabled: isActors,
  });

  const { data: directorData, isLoading: directorsLoading } = useQuery({
    queryKey: ["directors", search],
    queryFn: () => apiClient.directors.list({ "q[first_name_or_last_name_cont]": search || undefined }),
    enabled: !isActors,
  });

  const people: PersonItem[] = isActors ? (actorData?.actors ?? []) : (directorData?.directors ?? []);
  const isLoading = isActors ? actorsLoading : directorsLoading;

  const openCreate = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (p: PersonItem) => { setEditing(p); setDialogOpen(true); };

  const handleDelete = async (person: PersonItem) => {
    try {
      if (isActors) await apiClient.actors.delete(person.id);
      else await apiClient.directors.delete(person.id);
      toast.success(`"${person.full_name}" deleted`);
      queryClient.invalidateQueries({ queryKey: [isActors ? "actors" : "directors"] });
    } catch (err) {
      toast.error(extractApiError(err));
    }
  };

  const handleSaved = () => {
    setDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: [isActors ? "actors" : "directors"] });
  };

  const label = isActors ? "Actor" : "Director";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="People"
        subtitle={`Manage ${isActors ? "actors" : "directors"} in your library`}
        actions={
          <Button
            className="bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold h-10 px-6 rounded-lg shadow-sm"
            onClick={openCreate}
          >
            <Plus size={18} className="mr-2" /> Add {label}
          </Button>
        }
      />

      {/* Sub-nav Tabs */}
      <div className="flex gap-2 p-1 bg-[#EDF1F7] rounded-xl w-fit">
        <Link href="/admin/people/actors">
          <Button
            variant="ghost"
            className={cn(
              "h-10 px-8 rounded-lg font-bold text-sm transition-all",
              isActors ? "bg-white text-[#4299EB] shadow-sm" : "text-[#8892B0]"
            )}
          >
            Actors
          </Button>
        </Link>
        <Link href="/admin/people/directors">
          <Button
            variant="ghost"
            className={cn(
              "h-10 px-8 rounded-lg font-bold text-sm transition-all",
              !isActors ? "bg-white text-[#4299EB] shadow-sm" : "text-[#8892B0]"
            )}
          >
            Directors
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider">Total</span>
            <span className="text-lg font-bold text-[#1C2238]">{people.length}</span>
          </div>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B8]" size={16} />
          <Input
            placeholder={`Search ${isActors ? "actors" : "directors"}...`}
            className="pl-10 bg-white border border-[#E0E8EF] h-11 rounded-xl text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-[#E0E8EF] shadow-sm flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#EDF1F7] animate-pulse" />
              <div className="h-4 w-3/4 bg-[#EDF1F7] animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-[#EDF1F7] animate-pulse rounded" />
            </div>
          ))}
        </div>
      ) : people.length === 0 ? (
        <div className="py-20 text-center text-[#9AA5B8] font-medium">
          {search ? `No ${isActors ? "actors" : "directors"} matching "${search}"` : `No ${isActors ? "actors" : "directors"} yet`}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {people.map((person) => (
            <div
              key={person.id}
              className="group bg-white p-6 rounded-2xl border border-[#E0E8EF] shadow-sm hover:shadow-md transition-all hover:border-[#4299EB] relative flex flex-col items-center text-center"
            >
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 rounded-full bg-[#EDF1F7] text-[#46BB78] hover:bg-[#46BB78] hover:text-white"
                  onClick={() => openEdit(person)}
                >
                  <Edit2 size={12} />
                </Button>
                <ConfirmDialog
                  title={`Delete "${person.full_name}"?`}
                  description="This will remove the person from your library. This cannot be undone."
                  confirmLabel="Delete"
                  variant="destructive"
                  onConfirm={() => handleDelete(person)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 rounded-full bg-[#EDF1F7] text-[#F25959] hover:bg-[#F25959] hover:text-white"
                  >
                    <Trash2 size={12} />
                  </Button>
                </ConfirmDialog>
              </div>

              <Avatar className="w-20 h-20 mb-4 border-4 border-[#F4F5F8] shadow-sm">
                <AvatarImage src={person.image_url} />
                <AvatarFallback className="bg-[#4299EB]/10 text-[#4299EB] font-bold text-xl">
                  {person.first_name?.[0] ?? ""}{person.last_name?.[0] ?? ""}
                </AvatarFallback>
              </Avatar>

              <h4 className="font-bold text-[#1C2238] text-sm line-clamp-1 mb-1">{person.full_name}</h4>
              <div className="flex items-center gap-1.5 text-[10px] text-[#9AA5B8] font-bold uppercase tracking-wider">
                <MapPin size={10} /> {person.nationality ?? "Unknown"}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl p-8 border-none shadow-2xl">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-[#1C2238] font-bold text-lg">
              {editing ? `Edit ${label}` : `New ${label}`}
            </DialogTitle>
          </DialogHeader>
          <PersonForm
            isActor={isActors}
            initial={editing}
            onClose={() => setDialogOpen(false)}
            onSaved={handleSaved}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
