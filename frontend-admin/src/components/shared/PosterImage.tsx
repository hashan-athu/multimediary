"use client";

import { Film } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface PosterImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export default function PosterImage({ src, alt, className }: PosterImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div 
        className={cn(
          "bg-[#C8D0DC] flex items-center justify-center rounded-lg overflow-hidden", 
          className
        )}
      >
        <Film size={32} className="text-[#9AA5B8]" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-[#C8D0DC]", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 hover:scale-110"
        onError={() => setError(true)}
      />
    </div>
  );
}
