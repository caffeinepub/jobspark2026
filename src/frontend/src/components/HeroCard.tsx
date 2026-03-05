import { Button } from "@/components/ui/button";
import { Briefcase, Menu } from "lucide-react";
import SlotCounter from "./SlotCounter";

interface HeroCardProps {
  totalBalance: number;
}

export default function HeroCard({ totalBalance }: HeroCardProps) {
  const formattedBalance = `₹${totalBalance.toLocaleString("en-IN")}`;

  return (
    <div
      data-ocid="header.balance_card"
      className="hero-gradient rounded-2xl shadow-hero p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden relative"
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-10"
        style={{ background: "oklch(0.8 0.1 200)" }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full opacity-5"
        style={{ background: "oklch(0.9 0.15 60)" }}
        aria-hidden
      />

      {/* Left: Title */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Briefcase className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-white font-display font-bold text-xl md:text-2xl tracking-tight">
            JobSpark2026 Work Dashboard
          </h1>
        </div>
        <p className="text-white/70 text-sm font-body ml-9">
          Founder:{" "}
          <span className="text-white/90 font-semibold">Vedika Khanna</span>
        </p>
      </div>

      {/* Right: Balance chip + menu */}
      <div className="relative z-10 flex items-center gap-3 flex-shrink-0">
        <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl px-5 py-3 flex flex-col items-center min-w-[140px]">
          <span className="text-white/70 text-xs font-body uppercase tracking-wider mb-0.5">
            Total Balance
          </span>
          <SlotCounter
            value={formattedBalance}
            className="text-white text-2xl font-display font-bold"
          />
        </div>
        <Button
          data-ocid="header.menu_button"
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 hover:text-white rounded-xl h-10 w-10"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
