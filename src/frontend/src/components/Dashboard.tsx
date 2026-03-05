import {
  useGetCallerUserProfile,
  useGetEntriesCount,
  useGetTodayEarnings,
  useGetTotalEarnings,
  useGetTotalWithdrawn,
} from "../hooks/useQueries";
import HeroCard from "./HeroCard";
import Sidebar from "./Sidebar";
import StatsRow from "./StatsRow";
import TopNav from "./TopNav";
import WorkEntriesTable from "./WorkEntriesTable";

export default function Dashboard() {
  const profileQuery = useGetCallerUserProfile();
  const entriesCountQuery = useGetEntriesCount();
  const todayEarningsQuery = useGetTodayEarnings();
  const totalEarningsQuery = useGetTotalEarnings();
  const totalWithdrawnQuery = useGetTotalWithdrawn();

  const userName = profileQuery.data?.name || "Your Name";
  const timeWorked = profileQuery.data?.timeWorked || "7h 30m";

  const totalEntries =
    entriesCountQuery.data !== undefined
      ? Number(entriesCountQuery.data)
      : null;

  const todayEarnings =
    todayEarningsQuery.data !== undefined
      ? Number(todayEarningsQuery.data)
      : null;

  const totalEarnings =
    totalEarningsQuery.data !== undefined
      ? Number(totalEarningsQuery.data)
      : 9230;

  const totalWithdrawn =
    totalWithdrawnQuery.data !== undefined
      ? Number(totalWithdrawnQuery.data)
      : 6750;

  // Balance shown in hero = total earnings
  const totalBalance = totalEarnings ?? 6680;

  const statsLoading =
    entriesCountQuery.isLoading ||
    todayEarningsQuery.isLoading ||
    profileQuery.isLoading;

  const sidebarLoading =
    todayEarningsQuery.isLoading || totalWithdrawnQuery.isLoading;

  return (
    <div className="min-h-screen bg-background">
      <TopNav userName={userName} />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Hero Card */}
        <HeroCard totalBalance={totalBalance} />

        {/* Stats Row */}
        <StatsRow
          totalEntries={totalEntries}
          timeWorked={timeWorked}
          todayEarnings={todayEarnings}
          isLoading={statsLoading}
        />

        {/* Main content: table + sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5 items-start">
          <WorkEntriesTable
            totalEarnings={totalEarnings}
            totalWithdrawn={totalWithdrawn}
          />
          <Sidebar
            todayEarnings={todayEarnings ?? 320}
            totalWithdrawn={totalWithdrawn ?? 2450}
            isLoading={sidebarLoading}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col items-center gap-2">
          <p className="text-sm font-body text-muted-foreground text-center">
            💰 Work Completed via{" "}
            <span className="font-semibold text-foreground">JobSpark2026</span>{" "}
            Online Work Platform.
          </p>
          <p className="text-xs font-body text-muted-foreground">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Built with ♥ using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
