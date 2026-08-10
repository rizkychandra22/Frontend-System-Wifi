import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useTodayAttendance, useClockIn, useClockOut, useRequestIzin } from "@/features/attendance/hooks/use-attendance";
import { MapPin, Clock, CalendarX2 } from "lucide-react";

export function AttendanceRecord() {
  const { todayAttendance: record } = useTodayAttendance();
  const { mutateAsync: clockIn } = useClockIn();
  const { mutateAsync: clockOut } = useClockOut();
  const { mutateAsync: requestIzin } = useRequestIzin();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [izinNotes, setIzinNotes] = useState("");
  const [showIzinForm, setShowIzinForm] = useState(false);

  const getLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolokasi tidak didukung oleh browser Anda"));
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
      });
    });
  };

  const handleClockIn = async () => {
    try {
      setIsActionLoading(true);
      const pos = await getLocation();
      await clockIn({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (error: any) {
      toast.error(error.message || "Gagal absen masuk. Pastikan akses lokasi diizinkan.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setIsActionLoading(true);
      const pos = await getLocation();
      await clockOut({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (error: any) {
      toast.error(error.message || "Gagal absen keluar. Pastikan akses lokasi diizinkan.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleIzin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!izinNotes.trim()) {
      toast.error("Keterangan izin harus diisi");
      return;
    }
    try {
      setIsActionLoading(true);
      await requestIzin(izinNotes);
      setShowIzinForm(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (record && record.status === "Libur") {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <CalendarX2 className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-xl font-bold mb-2">Hari Ini Libur</h2>
          <p className="text-muted-foreground">
            Tidak ada aktivitas absensi untuk hari ini karena tidak ada karyawan yang absen masuk hingga jam 08:30.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (record && record.status === "Izin") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status: Izin</CardTitle>
          <CardDescription>Anda mengajukan izin hari ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-1">Keterangan:</p>
            <p className="text-sm text-muted-foreground">{record.notes}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Card Absen Masuk */}
      <Card className={record ? "opacity-75" : "border-primary"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Absen Masuk
          </CardTitle>
          <CardDescription>Batas waktu 08:30 WIB</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {record ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <span className="text-sm text-muted-foreground">Waktu Masuk</span>
                <span className="font-semibold">{record.clock_in ? new Date(record.clock_in).toLocaleTimeString("id-ID") : "-"}</span>
              </div>
              <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <span className="text-sm text-muted-foreground">Grade</span>
                <span className="font-semibold text-primary">{record.grade}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Button 
                className="w-full text-base h-12 shadow-blue" 
                onClick={handleClockIn}
                disabled={isActionLoading}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {isActionLoading ? "Memproses..." : "Catat Absen Masuk"}
              </Button>
              
              {!showIzinForm ? (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowIzinForm(true)}
                >
                  Ajukan Izin
                </Button>
              ) : (
                <form onSubmit={handleIzin} className="space-y-3 bg-muted p-4 rounded-lg">
                  <textarea 
                    className="w-full p-3 rounded-md border text-sm focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Tulis alasan izin..."
                    rows={3}
                    value={izinNotes}
                    onChange={(e) => setIzinNotes(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="flex-1" disabled={isActionLoading}>
                      Kirim Izin
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowIzinForm(false)}>
                      Batal
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card Absen Keluar */}
      <Card className={(!record || record.status === "Selesai") ? "opacity-75" : "border-primary"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Absen Keluar
          </CardTitle>
          <CardDescription>Mulai 16:00 s/d 18:00 WIB</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {record?.clock_out ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <span className="text-sm text-muted-foreground">Waktu Keluar</span>
                <span className="font-semibold">{new Date(record.clock_out).toLocaleTimeString("id-ID")}</span>
              </div>
              <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="font-semibold text-primary">{record.status}</span>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline"
              className={`w-full text-base h-12 ${record ? 'border-primary text-primary hover:bg-primary/5' : ''}`}
              onClick={handleClockOut}
              disabled={!record || isActionLoading}
            >
              <MapPin className="w-4 h-4 mr-2" />
              {isActionLoading ? "Memproses..." : "Catat Absen Keluar"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
