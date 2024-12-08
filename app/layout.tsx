import './globals.css'

export const metadata = {
  title: 'N-Queens Backtracking Simulation',
  description: 'A step-by-step visualization of the N-Queens backtracking algorithm',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-[Helvetica,Arial,sans-serif] dark">{children}</body>
    </html>
  )
}

