import { Navbar } from './_components/navbar'
import { Footer } from './_components/footer'

const MarketingLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="h-full bg-blue-50">
      <Navbar />
      <main className="pt-20 pb-10">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MarketingLayout