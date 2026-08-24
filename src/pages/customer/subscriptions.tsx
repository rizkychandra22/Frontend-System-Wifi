import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth-utils";
import { customerApi } from "@/lib/api/customer";
import { wifiPackageApi, type WifiPackage } from "@/lib/api/wifi_package";
import { type Subscription } from "@/lib/api/subscription";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";
import { CustomerSubscriptions } from "@/features/subscriptions/components/customer-subscriptions";
import { AxiosError } from "axios";

export function CustomerSubscriptionsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [availablePackages, setAvailablePackages] = useState<WifiPackage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUser();
        if (!user) {
          setError("Silakan login kembali");
          return;
        }

        const [subData, packagesData] = await Promise.all([
          customerApi.getCustomerSubscription(user.id).catch(() => null),
          wifiPackageApi.getWifiPackages().catch(() => [])
        ]);

        setSubscription(subData);
        setAvailablePackages(packagesData);
      } catch (err) {
        setError(parseErrorMessage(err as AxiosError<ApiErrorResponse>));
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Langganan Paket WiFi</h2>
          <p className="text-muted-foreground text-sm">
            Kelola layanan WiFi Anda dan jelajahi berbagai pilihan paket menarik yang kami sediakan.
          </p>
        </div>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <CustomerSubscriptions subscription={subscription} availablePackages={availablePackages} />
      )}
    </div>
  );
}
