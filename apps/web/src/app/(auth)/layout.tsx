export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(72,176,188,0.14),transparent_55%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
