import DashboardLayout from "../layouts/DashboardLayout";
import {
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Activity,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  accent: string;
}

interface ActivityItem {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  avatar: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const STATS: StatCardProps[] = [
  {
    label: "Total Contacts",
    value: "2,847",
    change: "+12.5%",
    positive: true,
    icon: <Users size={20} />,
    accent: "teal",
  },
  {
    label: "Active Deals",
    value: "148",
    change: "+8.2%",
    positive: true,
    icon: <Briefcase size={20} />,
    accent: "violet",
  },
  {
    label: "Revenue (MTD)",
    value: "$94,200",
    change: "+22.1%",
    positive: true,
    icon: <TrendingUp size={20} />,
    accent: "amber",
  },
  {
    label: "Tasks Closed",
    value: "312",
    change: "-3.4%",
    positive: false,
    icon: <CheckCircle2 size={20} />,
    accent: "rose",
  },
];

const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    user: "Sara Ahmed",
    action: "closed deal with",
    target: "NovaTech Ltd.",
    time: "2 min ago",
    avatar: "SA",
  },
  {
    id: 2,
    user: "Omar Farooq",
    action: "added contact",
    target: "Michael Torres",
    time: "18 min ago",
    avatar: "OF",
  },
  {
    id: 3,
    user: "Layla Hassan",
    action: "updated project",
    target: "Q3 Campaign",
    time: "45 min ago",
    avatar: "LH",
  },
  {
    id: 4,
    user: "Rami Khalil",
    action: "uploaded document to",
    target: "Legal Archive",
    time: "1 hr ago",
    avatar: "RK",
  },
  {
    id: 5,
    user: "Dina Mansour",
    action: "sent proposal to",
    target: "AlphaCore Inc.",
    time: "3 hr ago",
    avatar: "DM",
  },
];

const PIPELINE: { label: string; count: number; value: string; color: string }[] = [
  { label: "Prospecting",    count: 34, value: "$128K",  color: "bg-blue-500"   },
  { label: "Qualification",  count: 27, value: "$94K",   color: "bg-violet-500" },
  { label: "Proposal",       count: 18, value: "$210K",  color: "bg-amber-500"  },
  { label: "Negotiation",    count: 11, value: "$340K",  color: "bg-orange-500" },
  { label: "Closed Won",     count: 58, value: "$780K",  color: "bg-teal-500"   },
];

// ─── Accent colour maps ───────────────────────────────────────────────────────

const accentMap: Record<string, string> = {
  teal:   "bg-teal-500/15 text-teal-400",
  violet: "bg-violet-500/15 text-violet-400",
  amber:  "bg-amber-500/15 text-amber-400",
  rose:   "bg-rose-500/15 text-rose-400",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ label, value, change, positive, icon, accent }: StatCardProps) => (
  <div className="bg-[#15171e] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 hover:border-white/10 transition-all duration-200">
    <div className="flex items-center justify-between">
      <span className="text-gray-500 text-sm font-medium">{label}</span>
      <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${accentMap[accent]}`}>
        {icon}
      </span>
    </div>
    <div>
      <p className="text-white text-3xl font-bold tracking-tight">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        {positive ? (
          <ArrowUpRight size={14} className="text-teal-400" />
        ) : (
          <ArrowDownRight size={14} className="text-rose-400" />
        )}
        <span className={`text-xs font-semibold ${positive ? "text-teal-400" : "text-rose-400"}`}>
          {change}
        </span>
        <span className="text-gray-600 text-xs ml-1">vs last month</span>
      </div>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const Dashboard = () => {
  return (
    <DashboardLayout pageTitle="Dashboard">

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Middle row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">

        {/* Pipeline */}
        <div className="xl:col-span-2 bg-[#15171e] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Sales Pipeline</h2>
            <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg">This Quarter</span>
          </div>
          <div className="space-y-3">
            {PIPELINE.map((stage) => {
              const pct = Math.round((stage.count / 148) * 100);
              return (
                <div key={stage.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                      <span className="text-gray-300 text-sm">{stage.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 text-xs">{stage.count} deals</span>
                      <span className="text-white text-sm font-semibold w-16 text-right">{stage.value}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-[#15171e] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-white font-semibold">Quick Stats</h2>
            <Activity size={15} className="text-gray-500" />
          </div>
          {[
            { label: "Win Rate",       value: "68%",  bar: 68,  color: "bg-teal-500" },
            { label: "Avg Deal Size",  value: "$5.8K",bar: 55,  color: "bg-violet-500"},
            { label: "Response Time",  value: "2.4h", bar: 40,  color: "bg-amber-500" },
            { label: "Customer Sat.",  value: "4.7★", bar: 94,  color: "bg-blue-500" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400 text-xs">{item.label}</span>
                <span className="text-white text-xs font-semibold">{item.value}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full">
                <div
                  className={`h-full ${item.color} rounded-full`}
                  style={{ width: `${item.bar}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="bg-[#15171e] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Recent Activity</h2>
          <button className="text-xs text-teal-400 hover:text-teal-300 transition-colors">
            View all →
          </button>
        </div>
        <ul className="space-y-4">
          {RECENT_ACTIVITY.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500/30 to-cyan-600/30 border border-teal-500/20 flex items-center justify-center text-teal-300 text-xs font-bold shrink-0">
                {item.avatar}
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 text-sm">
                  <span className="text-white font-medium">{item.user}</span>{" "}
                  {item.action}{" "}
                  <span className="text-teal-400 font-medium">{item.target}</span>
                </p>
              </div>
              {/* Time */}
              <div className="flex items-center gap-1 text-gray-600 text-xs shrink-0">
                <Clock size={11} />
                {item.time}
              </div>
            </li>
          ))}
        </ul>
      </div>

    </DashboardLayout>
  );
};

export default Dashboard;