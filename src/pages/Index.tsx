import { Battery, Gauge, TrendingUp, Fuel } from 'lucide-react';
import { useEVData } from '@/hooks/useEVData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { EVTrendsChart } from '@/components/dashboard/EVTrendsChart';
import { PenetrationChart } from '@/components/dashboard/PenetrationChart';
import { StateComparisonChart } from '@/components/dashboard/StateComparisonChart';
import { SegmentChart } from '@/components/dashboard/SegmentChart';
import { InfrastructureChart } from '@/components/dashboard/InfrastructureChart';
import { PolicyImpactChart } from '@/components/dashboard/PolicyImpactChart';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { LoadingState } from '@/components/dashboard/LoadingState';

const Index = () => {
  const {
    yearlyStats,
    stateStats,
    segmentStats,
    kpis,
    policyImpact,
    latestInfrastructure,
    loading,
    error,
  } = useEVData();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-destructive mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent" />
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <DashboardHeader />

        {/* KPI Cards */}
        <section className="mb-8">
          <h2 className="text-lg font-bold font-display text-foreground mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-accent" />
            Executive Pulse — 2024 Snapshot
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="National EV Penetration"
              value={`${kpis.nationalPenetration.toFixed(1)}%`}
              delta={`${kpis.penetrationChange >= 0 ? '+' : ''}${kpis.penetrationChange.toFixed(2)}% YoY`}
              status={kpis.penetrationChange > 0.5 ? 'good' : kpis.penetrationChange < 0 ? 'bad' : 'neutral'}
              insight={kpis.nationalPenetration > 15 ? 'Crossed mainstream threshold' : 'Approaching the chasm'}
              icon={<Battery className="w-5 h-5 text-accent" />}
            />
            <KPICard
              title="Displacement Ratio"
              value={kpis.displacementRatio.toFixed(1)}
              delta={`${kpis.displacementChange >= 0 ? '+' : ''}${kpis.displacementChange.toFixed(1)} vs prev`}
              status={kpis.displacementChange < 0 ? 'good' : 'bad'}
              insight={kpis.displacementRatio > 10 ? 'High ICE resistance' : 'Moderate transition'}
              icon={<Fuel className="w-5 h-5 text-secondary" />}
            />
            <KPICard
              title="Adoption Velocity"
              value={`${kpis.adoptionVelocity >= 0 ? '+' : ''}${kpis.adoptionVelocity.toFixed(2)}%`}
              delta={`${kpis.velocityChange >= 0 ? 'Up' : 'Down'} from ${Math.abs(kpis.velocityChange).toFixed(2)}%`}
              status={kpis.adoptionVelocity > 0 ? 'good' : 'bad'}
              insight={kpis.adoptionVelocity > 0 ? 'Positive momentum' : 'Momentum stalled'}
              icon={<TrendingUp className="w-5 h-5 text-primary" />}
            />
            <KPICard
              title="Charging Stations"
              value={kpis.totalChargingStations.toLocaleString()}
              delta="Across 18 states"
              status="neutral"
              insight="Infrastructure expanding"
              icon={<Battery className="w-5 h-5 text-secondary" />}
            />
          </div>
        </section>

        {/* Main Charts Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Wide charts */}
            <div className="lg:col-span-2">
              <EVTrendsChart data={yearlyStats} />
            </div>
            <div className="lg:col-span-1">
              <PenetrationChart data={yearlyStats} />
            </div>
          </div>
        </section>

        {/* State and Segment Analysis */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StateComparisonChart data={stateStats} />
            </div>
            <div className="lg:col-span-1">
              <SegmentChart data={segmentStats} />
            </div>
          </div>
        </section>

        {/* Infrastructure, Policy, and Insights */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <InfrastructureChart data={latestInfrastructure} />
            <PolicyImpactChart data={policyImpact} />
            <InsightsPanel 
              kpis={kpis}
              stateStats={stateStats}
              segmentStats={segmentStats}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Data Source: Indian Vehicle Registration Database (2016-2024) | 
            Analysis powered by XGBoost predictive modeling
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Built with React, Recharts, and Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
