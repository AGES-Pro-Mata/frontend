type AdminLayoutSidebarProps = {
  children: React.ReactNode;
  className?: string;
};

export function AdminLayoutSidebar({ children }: AdminLayoutSidebarProps) {
  return (
    <aside className="w-[280px] shrink-0 rounded-xl bg-white text-card-foreground shadow-sm h-full">
      <div className="p-3 h-full overflow-hidden">{children}</div>
    </aside>
  );
}
AdminLayoutSidebar.displayName = "AdminLayout.Sidebar";