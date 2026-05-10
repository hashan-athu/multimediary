"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Film, HardDrive, Download, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const response = await apiClient.auth.login(values);

      // Token is in the Authorization header (Bearer <token>) or in the body
      const headerAuth = response.headers["authorization"] || response.headers["Authorization"];
      const token = headerAuth
        ? headerAuth.replace(/^Bearer\s+/i, "")
        : response.data.token;

      const userData = response.data.user;

      if (!token) {
        toast.error("Authentication failed — no token received");
        return;
      }

      setToken(token);
      if (userData) setUser(userData);

      // Write cookie for middleware (readable in Edge runtime)
      document.cookie = `mm_token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      toast.success("Welcome back!");
      router.push("/admin/dashboard");
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error ||
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Invalid credentials";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F5F8]">
      {/* Left Panel - Brand */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#16213E] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4299EB] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#9A62FA] opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-full bg-[#4299EB] flex items-center justify-center font-bold text-white text-xl">
              M
            </div>
            <span className="font-bold text-2xl tracking-tight">Multimediary</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6 max-w-md">
            Your personal media library, organized.
          </h1>
          <p className="text-[#8892B0] text-lg mb-12">
            700+ movies · DVDs &amp; HDDs · TMDb auto-import
          </p>

          <div className="space-y-6">
            {[
              { icon: Film, color: "#4299EB", text: "Movie & TV series catalogue" },
              { icon: HardDrive, color: "#46BB78", text: "Physical disk tracking (DVD, HDD, Blu-ray)" },
              { icon: Download, color: "#9A62FA", text: "TMDb metadata auto-import" },
            ].map(({ icon: Icon, color, text }) => (
              <div key={text} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center" style={{ color }}>
                  <Icon size={20} />
                </div>
                <p className="font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[#8892B0] text-sm font-medium">Multimediary Admin · v1.0</div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F4F5F8]">
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E0E8EF] p-10">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[#EDF1F7] flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#4299EB] flex items-center justify-center font-bold text-white text-2xl">
                  M
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#1C2238] mb-1">Welcome back</h2>
              <p className="text-[#4F5C72] font-medium">Sign in to your admin panel</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#4F5C72] font-bold text-[11px] uppercase tracking-wider">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@multimediary.com"
                          className="bg-[#EDF1F7] border-none h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-[#4299EB]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#4F5C72] font-bold text-[11px] uppercase tracking-wider">
                        Password
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-[#EDF1F7] border-none h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-[#4299EB] pr-10"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA5B8] hover:text-[#4F5C72] transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-[#4299EB]/10 rounded-lg p-4 flex gap-3 border border-[#4299EB]/20">
                  <AlertCircle size={18} className="text-[#4299EB] shrink-0 mt-0.5" />
                  <p className="text-[12px] leading-relaxed text-[#4299EB] font-medium">
                    One active session is enforced — sign out elsewhere before logging in.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold rounded-lg shadow-sm transition-all active:scale-[0.98]"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
