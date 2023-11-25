import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default async function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gray-950 p-5 text-white md:px-[100px]">
      <div className="absolute left-0 top-0 h-full w-full">
        <Image
          src="/bg.jpg"
          className="h-full w-full object-cover"
          alt=""
          layout="fill"
        />
      </div>
      <section className="relative z-10 max-w-2xl">
        <nav>
          <span className="text-5xl tracking-[-3%]">Weitlist</span>
        </nav>
        <div className="mt-16">
          <span className="border border-green-300 px-3 py-1.5 text-base font-bold text-green-300">
            BETA
          </span>
          <h1 className="mb-3 mt-4 font-serif text-[60px] font-bold leading-[60px] md:mt-6 md:text-[100px] md:leading-[90px]">
            Work on your app not on your waitlist
          </h1>
          <p className="font-sans">
            Get a fully functioning waitlist feature in 5 minutes not 5 days.
          </p>
          <form className="mt-3 max-w-xs">
            <Label>Join the waitlist</Label>
            <Input className="mt-2" placeholder="Enter your supa' e-mail" />
            <Button className="mt-4 w-full">Join</Button>
          </form>
        </div>
      </section>
    </main>
  );
}
