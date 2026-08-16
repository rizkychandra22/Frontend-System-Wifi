import { LoginForm } from "@/features/auth/components/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth-utils";

export const LoginPage = () => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-cyan-400/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="flex flex-col items-center justify-center -mt-50 -mb-30">
          <img src={logo} alt="NetVerse Pro" className="w-100 md:w-100 h-auto object-contain drop-shadow-md" />
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl ring-1 ring-slate-200 dark:ring-slate-800">
          <CardHeader className="space-y-1 pb-6 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">Selamat Datang</CardTitle>
            <CardDescription className="text-base">
              Masukkan nomor HP yang terdaftar untuk melanjutkan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </div>
  );
};
