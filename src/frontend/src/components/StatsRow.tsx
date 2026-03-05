import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Hash, IndianRupee } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass: string;
  iconColorClass: string;
  dataOcid: string;
}

function StatCard({
  icon,
  label,
  value,
  colorClass,
  iconColorClass,
  dataOcid,
}: StatCardProps) {
  return (
    <div
      data-ocid={dataOcid}
      className={`${colorClass} rounded-xl p-4 shadow-card flex items-center gap-3 flex-1 min-w-0`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColorClass}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-body text-muted-foreground font-medium uppercase tracking-wide truncate">
          {label}
        </p>
        <p className="text-base font-display font-bold text-foreground leading-tight mt-0.5 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-xl p-4 shadow-card flex items-center gap-3 flex-1 min-w-0">
      <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}

interface StatsRowProps {
  totalEntries: number | null;
  timeWorked: string | null;
  todayEarnings: number | null;
  isLoading: boolean;
}

export default function StatsRow({
  totalEntries,
  timeWorked,
  todayEarnings,
  isLoading,
}: StatsRowProps) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {["entries", "date", "time", "earnings"].map((k) => (
          <StatCardSkeleton key={k} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        dataOcid="stats.total_entries_card"
        colorClass="stat-card-blue"
        iconColorClass="bg-blue-100 text-blue-600"
        icon={<Hash className="w-5 h-5" />}
        label="Total Entries"
        value={totalEntries !== null ? totalEntries.toString() : "—"}
      />
      <StatCard
        dataOcid="stats.date_card"
        colorClass="stat-card-orange"
        iconColorClass="bg-orange-100 text-orange-600"
        icon={<Calendar className="w-5 h-5" />}
        label="Date:"
        value={dateStr}
      />
      <StatCard
        dataOcid="stats.time_worked_card"
        colorClass="stat-card-green"
        iconColorClass="bg-green-100 text-green-600"
        icon={<Clock className="w-5 h-5" />}
        label="Time Worked:"
        value={timeWorked || "7h 30m"}
      />
      <StatCard
        dataOcid="stats.today_earnings_card"
        colorClass="stat-card-purple"
        iconColorClass="bg-purple-100 text-purple-600"
        icon={<IndianRupee className="w-5 h-5" />}
        label="Today's Earnings:"
        value={
          todayEarnings !== null
            ? `₹${todayEarnings.toLocaleString("en-IN")}`
            : "₹0"
        }
      />
    </div>
  );
}
