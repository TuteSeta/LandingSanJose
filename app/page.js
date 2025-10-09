import Image from "next/image";
import Contacto from "./components/contacto";
import Plantel from "./components/plantel";

export default function Home() {
  return (
    <div className="">
      <Plantel/>
      <Contacto/>
      
    </div>
  );
}
