import { Zap, Activity, BarChart3 } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="relative mb-8 pb-6 border-b border-border">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Top badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
            <Activity className="w-3 h-3 text-accent animate-pulse" />
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              Live Analytics
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              2016-2024 Data
            </span>
          </div>
        </div>

        {/* Main title */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground tracking-wide">
              India's EV Adoption
              <span className="text-primary"> & ICE-to-EV</span>
              <span className="text-secondary"> Transition</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Comprehensive analysis of electric vehicle adoption patterns, infrastructure development, 
              and policy impact across Indian states. Data-driven insights for stakeholders.
            </p>
          </div>
        </div>

        {/* Quick metrics */}
        <div className="flex flex-wrap gap-6 mt-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">18 States Analyzed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-muted-foreground">120K+ Data Points</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-sm text-muted-foreground">XGBoost Predictions</span>
          </div>
        </div>
      </div>
    </header>
  );
}
