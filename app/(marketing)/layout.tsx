import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";

const MarketingLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full bg-slate-100">
      <Navbar />
      <main className="pt-20 pb-10 bg-slate-100">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MarketingLayout