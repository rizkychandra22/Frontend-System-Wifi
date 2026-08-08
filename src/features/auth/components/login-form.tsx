import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Phone, Loader2 } from "lucide-react";
import { useLogin } from "../hooks/use-login";

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
});

export const LoginForm = () => {
  const { login, isLoading } = useLogin();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = await login(values.phone);
      toast.success(data.message || "Login berhasil!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat login.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            "Masuk"
          )}
        </Button>
      </form>
    </Form>
  );
};
