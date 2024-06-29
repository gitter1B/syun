export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center p-8 h-full">
      {children}
    </div>
  );
}
