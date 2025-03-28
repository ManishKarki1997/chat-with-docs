import Header from "@/components/header";
import Hero from "@/components/hero";


export default async function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <Header />

      <Hero />
    </div>
  );
}
