import { SlateProvider } from "@/contexts";

export default function SlatesRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SlateProvider>
      {children}
    </SlateProvider>
  );
}
