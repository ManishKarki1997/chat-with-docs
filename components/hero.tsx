import Image from "next/image";
import HeroImage from '../assets/hero.png'

export default async function Hero() {


  return (
    <div className="flex flex-col items-center justify-center pt-4  gap-8 min-h-[500px]">

      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold">Chat With Docs</h2>
        <p className="text-lg">
          Chat with your documents and get answers instantly.
        </p>
      </div>

      <Image
        objectFit="cover"
        className="w-full"
        src={HeroImage} alt="App Hero Image" />

      <div className="flex items-center gap-2">
        <p>Made by <a className="text-purple-500" href="https://github.com/ManishKarki1997" target="_blank" rel="noreferrer">@blackfeather247</a></p>
      </div>
    </div>
  );
}
