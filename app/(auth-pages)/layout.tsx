export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen min-h-screen flex flex-col gap-12 items-center justify-center">{children}</div>
  );
}
