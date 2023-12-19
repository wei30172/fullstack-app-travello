import { Navbar } from "./_components/navbar"

const DashboardLayout = ({ 
  children
}: { 
  children: React.ReactNode
 }) => {
  return (
    <main className="h-full">
      <Navbar />
      {children}
    </main>
  )
 }

 export default DashboardLayout