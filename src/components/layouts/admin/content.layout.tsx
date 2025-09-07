type AdminLayoutContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function AdminLayoutContent({ children }: AdminLayoutContentProps) {
  return (
    <section className="flex-1 h-full rounded-xl bg-white text-card-foreground shadow-sm overflow-hidden">
      <div className="h-full overflow-y-auto overflow-x-hidden p-6 pb-4">
        {children}
      </div>
    </section>
  );
}
AdminLayoutContent.displayName = "AdminLayout.Content";
