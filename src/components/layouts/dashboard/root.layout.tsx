type LayoutProps = {
  children: React.ReactNode
}

export const RootLayout = ({ children }: LayoutProps) => {
  return <div className="flex flex-col min-h-screen">{children}</div>
}
