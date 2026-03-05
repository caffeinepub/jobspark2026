import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, CheckCircle2, ExternalLink } from "lucide-react";

interface SidebarProps {
  todayEarnings: number;
  totalWithdrawn: number;
  isLoading: boolean;
}

export default function Sidebar({
  todayEarnings,
  totalWithdrawn,
  isLoading,
}: SidebarProps) {
  return (
    <aside className="flex flex-col gap-4">
      {/* Earnings Summary Card */}
      <div
        data-ocid="sidebar.earnings_summary_card"
        className="bg-card rounded-2xl shadow-card border border-border p-5"
      >
        <h3 className="text-sm font-display font-bold text-foreground mb-4 uppercase tracking-wide">
          Earnings Summary
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border/60">
            <span className="text-sm font-body text-muted-foreground">
              Today's Earnings
            </span>
            {isLoading ? (
              <Skeleton className="h-5 w-16" />
            ) : (
              <span className="text-sm font-display font-bold text-primary">
                ₹{todayEarnings.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border/60">
            <span className="text-sm font-body text-muted-foreground">
              Total Withdrawn
            </span>
            {isLoading ? (
              <Skeleton className="h-5 w-16" />
            ) : (
              <span className="text-sm font-display font-bold text-foreground">
                ₹{totalWithdrawn.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-body text-muted-foreground">
              Status
            </span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-sm font-display font-bold text-success">
                Paid ✓
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Card */}
      <div
        data-ocid="sidebar.platform_card"
        className="bg-card rounded-2xl shadow-card border border-border p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 hero-gradient rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <Briefcase className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-foreground leading-tight">
              JobSpark2026
            </h3>
            <p className="text-xs font-body text-muted-foreground">
              Online Work Platform
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm font-body">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Founder:</span>
            <span className="font-semibold text-foreground">Vedika Khanna</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Website:</span>
            <a
              href="https://jobspark2026.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline font-medium text-xs"
            >
              jobspark2026.com
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Platform Information */}
      <div className="bg-muted/40 rounded-2xl border border-border p-4">
        <h4 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Platform Information
        </h4>
        <div className="space-y-1.5 text-xs font-body">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">
                JobSpark2026.org
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <span className="text-muted-foreground">
              Founder:{" "}
              <span className="font-semibold text-foreground">
                Vedika Khanna
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <a
              href="https://jobspark2026.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              jobspark2026.com
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
