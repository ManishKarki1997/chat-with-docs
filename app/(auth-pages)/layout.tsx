import Header from "@/components/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className="w-screen min-h-screen flex flex-col gap-12 items-center justify-center">
    <div className="max-w-7xl mx-auto">
      <Header />

      <div className="flex-1 flex flex-col min-h-[80vh] items-center justify-center">
        {children}
      </div>
    </div>
  );
}
