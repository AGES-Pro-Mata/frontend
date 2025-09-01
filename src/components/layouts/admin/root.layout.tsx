import { Children } from "react";

type AdminLayoutRootProps = {
  children: React.ReactNode;
};

export function AdminLayoutRoot({ children }: AdminLayoutRootProps) {
  const childrenArray = Children.toArray(children) as React.ReactElement[];

  const headerChildren: React.ReactElement[] = [];
  const bodyChildren: React.ReactElement[] = [];

  childrenArray.forEach((child) => {
    const displayName = (child.type as any)?.displayName;
    if (displayName === "AdminLayout.Header") {
      headerChildren.push(child);
    } else if (
      displayName === "AdminLayout.Sidebar" ||
      displayName === "AdminLayout.Content"
    ) {
      bodyChildren.push(child);
    } else {
      // Fallback: anything else goes to body as well
      bodyChildren.push(child);
    }
  });

  return (
    <div className="h-svh w-full bg-soft-white overflow-hidden flex flex-col">
      {headerChildren}

      <div className="flex gap-[18px] px-[18px] pb-[18px] pt-[18px] flex-1 overflow-hidden">
        {bodyChildren}
      </div>
    </div>
  );
}
