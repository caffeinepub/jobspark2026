import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase, Sparkles } from "lucide-react";

interface TopNavProps {
  userName: string;
}

export default function TopNav({ userName }: TopNavProps) {
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-xs">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          data-ocid="nav.logo_link"
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Briefcase className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            JobSpark<span className="text-primary">2026</span>
          </span>
        </a>

        {/* Greeting + Avatar */}
        <div data-ocid="nav.greeting" className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-body text-muted-foreground hidden sm:inline">
            Hello,{" "}
            <span className="font-semibold text-foreground">{userName}</span>
          </span>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {initials || "JS"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
