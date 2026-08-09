import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Phone, Loader2, KeyRound } from "lucide-react";
import { useLogin } from "../hooks/use-login";
import { AxiosError } from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Nomor HP minimal 10 angka." })
    .max(15, { message: "Nomor HP maksimal 15 angka." })
    .regex(/^[0-9]+$/, { message: "Nomor HP hanya boleh berisi angka." }),
  password: z.string().optional(),
});

export const LoginForm = () => {
  const { login, isLoading } = useLogin();
  const navigate = useNavigate();
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = await login({ phone: values.phone, password: values.password });
      toast.success(data.message || "Login berhasil!");
      navigate("/dashboard");
    } catch (error: any) {
      // Periksa apakah server merespons dengan 428 Precondition Required
      if (error instanceof AxiosError && error.response?.status === 428) {
        setShowPasswordInput(true);
        toast.info("Kata sandi diperlukan untuk akun Admin.");
        return; // Jangan tampilkan toast error
      }
      
      // Jika salah password, reset tampilan ke input HP lagi sesuai request
      if (error instanceof AxiosError && error.response?.status === 401 && showPasswordInput) {
        toast.error("Password salah. Silakan ulangi.");
        setShowPasswordInput(false);
        form.setValue("password", "");
        return;
      }

      toast.error(error.response?.data?.error || error.message || "Terjadi kesalahan saat login.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {!showPasswordInput ? (
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor HP</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="Contoh: 08123456789" 
                      className="pl-10 h-11" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="animate-in fade-in slide-in-from-right-4 duration-300">
                <FormLabel>Kata Sandi Admin ({form.getValues("phone")})</FormLabel>
                <FormControl>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="password"
                      placeholder="Masukkan kata sandi..." 
                      className="pl-10 h-11" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
                <Button 
                  type="button" 
                  variant="link" 
                  className="px-0 text-xs h-auto"
                  onClick={() => {
                    setShowPasswordInput(false);
                    form.setValue("password", "");
                  }}
                >
                  Bukan Admin / Ganti Nomor
                </Button>
              </FormItem>
            )}
          />
        )}
        
        <Button 
          type="submit" 
          className="w-full h-11 text-base font-semibold shadow-md transition-all hover:shadow-lg" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Memproses...
            </>
          ) : (
            showPasswordInput ? "Login sebagai Admin" : "Lanjutkan"
          )}
        </Button>
      </form>
    </Form>
  );
};

