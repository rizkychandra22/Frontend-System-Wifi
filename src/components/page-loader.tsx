import { Skeleton } from "@/components/ui/skeleton";

interface PageLoaderProps {
  className?: string;
  variant?: "web" | "dashboard";
}

/**
 * Skeleton Loader for Public Web Landing Layout (Header + Content + Footer)
 */
function WebLayoutSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`min-h-screen bg-background flex flex-col font-sans animate-in fade-in-50 duration-300 ${className}`}>
      {/* 1. Header Navbar Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo Skeleton */}
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>

          {/* Desktop Nav Links Skeleton */}
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>

          {/* Portal Button Skeleton */}
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </header>

      {/* 2. Main Content Skeleton (Hero Section + Feature Cards) */}
      <main className="flex-1 py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6 space-y-16">
          {/* Hero Banner Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-6">
              <Skeleton className="h-6 w-36 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-10 md:h-14 w-full rounded-lg" />
                <Skeleton className="h-10 md:h-14 w-3/4 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-4/6 rounded" />
              </div>
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-11 w-36 rounded-xl" />
                <Skeleton className="h-11 w-32 rounded-xl" />
              </div>
            </div>

            {/* Right Graphics Preview */}
            <div className="flex justify-center">
              <Skeleton className="h-[280px] sm:h-[340px] w-full max-w-[480px] rounded-2xl" />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
                <Skeleton className="h-9 w-full rounded-xl pt-2" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 3. Footer Skeleton */}
      <footer className="bg-foreground text-background border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-12 grid md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <Skeleton className="h-6 w-40 rounded bg-white/10" />
            <Skeleton className="h-4 w-72 rounded bg-white/10" />
            <Skeleton className="h-4 w-60 rounded bg-white/10" />
          </div>
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-28 rounded bg-white/10 mb-2" />
            <Skeleton className="h-3 w-20 rounded bg-white/10" />
            <Skeleton className="h-3 w-24 rounded bg-white/10" />
            <Skeleton className="h-3 w-20 rounded bg-white/10" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-36 rounded bg-white/10" />
            <Skeleton className="h-3 w-48 rounded bg-white/10" />
            <Skeleton className="h-8 w-28 rounded bg-white/10" />
          </div>
        </div>
        <div className="border-t border-white/5 py-6">
          <div className="container mx-auto px-4 md:px-6 flex justify-between">
            <Skeleton className="h-3 w-48 rounded bg-white/10" />
            <Skeleton className="h-3 w-36 rounded bg-white/10" />
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Skeleton Loader for Dashboard / App Layout (Sidebar + Header + Content Grid + Table)
 */
function DashboardLayoutSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`min-h-screen bg-background flex w-full animate-in fade-in-50 duration-300 ${className}`}>
      {/* 1. Sidebar Skeleton */}
      <div className="hidden md:flex w-64 border-r border-border bg-sidebar flex-col p-4 space-y-6 shrink-0">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-5 w-32 rounded" />
        </div>
        <div className="space-y-2 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-sidebar-border flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
      </div>

      {/* 2. Main Area (Header + Content) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg md:hidden" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Title & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-56 rounded-lg" />
              <Skeleton className="h-4 w-72 max-w-full rounded" />
            </div>
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-28 rounded-md" />
                <Skeleton className="h-3 w-36 rounded" />
              </div>
            ))}
          </div>

          {/* Table Box */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex justify-between items-center pb-2">
              <Skeleton className="h-9 w-64 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
            <div className="grid grid-cols-5 gap-4 pb-3 border-b border-border">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-16 ml-auto rounded" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 items-center py-2.5 border-b border-border/40 last:border-0">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-7 w-14 ml-auto rounded-lg" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export function PageLoader({ className = "", variant = "web" }: PageLoaderProps) {
  if (variant === "dashboard") {
    return <DashboardLayoutSkeleton className={className} />;
  }
  return <WebLayoutSkeleton className={className} />;
}

export default PageLoader;
