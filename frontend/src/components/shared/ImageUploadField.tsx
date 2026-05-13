"use client";

import { useState, useRef } from "react";
import { Upload, Link, X, ImageIcon } from "lucide-react";
import { api } from "@/lib/adminApi";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: "square" | "poster" | "backdrop";
}

export function ImageUploadField({
  value,
  onChange,
  label = "Image",
  aspectRatio = "square",
}: ImageUploadFieldProps) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const previewClass =
    aspectRatio === "poster" ? "w-20 h-30" : aspectRatio === "backdrop" ? "w-32 h-18" : "w-20 h-20";
  const previewStyle =
    aspectRatio === "poster"
      ? { width: 80, height: 120 }
      : aspectRatio === "backdrop"
        ? { width: 128, height: 72 }
        : { width: 80, height: 80 };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10 MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP and GIF are allowed");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post<{ url: string }>("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(response.data.url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed — try a URL instead");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">{label}</label>

      <div className="flex gap-1 p-1 bg-[#EDF1F7] rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            mode === "url" ? "bg-white text-[#1C2238] shadow-sm" : "text-[#9AA5B8] hover:text-[#4F5C72]"
          }`}
        >
          <Link className="h-3 w-3" /> URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            mode === "upload" ? "bg-white text-[#1C2238] shadow-sm" : "text-[#9AA5B8] hover:text-[#4F5C72]"
          }`}
        >
          <Upload className="h-3 w-3" /> Upload
        </button>
      </div>

      <div className="flex gap-3 items-start">
        <div
          className={`${previewClass} flex-shrink-0 rounded-lg bg-[#EDF1F7] overflow-hidden flex items-center justify-center border border-[#E0E8EF] relative`}
          style={previewStyle}
        >
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 hover:bg-black/80 transition-colors"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </>
          ) : (
            <ImageIcon className="h-6 w-6 text-[#C8D0DC]" />
          )}
        </div>

        <div className="flex-1">
          {mode === "url" ? (
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2.5 rounded-lg bg-[#EDF1F7] text-sm text-[#1C2238] placeholder:text-[#9AA5B8] outline-none focus:ring-2 focus:ring-[#4299EB]"
            />
          ) : (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed border-[#E0E8EF] hover:border-[#4299EB] hover:bg-[#EEF4FF] transition-colors text-sm text-[#9AA5B8] hover:text-[#4299EB] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Click to choose file"}
              </button>
              <p className="text-xs text-[#9AA5B8] mt-1">JPEG, PNG, WebP or GIF · Max 10 MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
