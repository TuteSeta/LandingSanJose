import Plantel from "../../components/plantel/plantel.jsx";
import NavBar from "../../components/ui/NavBar.jsx";
import NAV_ITEMS from "../../components/ui/navItems.js";

export default function Home() {
  return (
    <div className="min-h-dvh bg-[#F9FAFB] text-[#27303F]">
      <NavBar items={NAV_ITEMS} />
      <Plantel />
    </div>
  );
}
