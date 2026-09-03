import { AppShell } from "@/components/app/shell";
import { SubscriptionHydrator } from "@/components/app/subscription-hydrator";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SubscriptionHydrator />
      <AppShell>{children}</AppShell>
    </>
  );
}
