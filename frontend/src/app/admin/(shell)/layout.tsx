import AdminShell from "@/components/layout/AdminShell";

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
