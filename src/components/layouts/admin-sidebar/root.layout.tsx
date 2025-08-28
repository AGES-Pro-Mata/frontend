type LayoutProps = {
  children: React.ReactNode
}

export const RootLayout = ({ children }: LayoutProps) => {
  return <div className="flex flex-row min-h-screen bg-gray-100">{children}</div>
}