export default function SalesLayout({
  children,
  // modal,
  dialog,
}: {
  children: React.ReactNode;
  dialog: React.ReactNode;
}) {
  return (
    <div>
      {children}
      {dialog}
    </div>
  );
}
