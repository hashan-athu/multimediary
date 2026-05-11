export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-deep text-text-vibrant">
      {children}
    </div>
  );
}
