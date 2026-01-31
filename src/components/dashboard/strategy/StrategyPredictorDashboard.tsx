import { Target, TrendingUp, Zap, BarChart3, Map, Activity } from 'lucide-react';
import { useEVData } from '@/hooks/useEVData';
import { useStrategyPredictor } from '@/hooks/useStrategyPredictor';
import { StrategyKPICard } from './StrategyKPICard';
import { ScenarioSlider } from './ScenarioSlider';
import { StrategyComparisonChart } from './StrategyComparisonChart';
import { WaterfallChart } from './WaterfallChart';
import { StackedAreaChart } from './StackedAreaChart';
import { BubblePlot } from './BubblePlot';
import { SlopeGraph } from './SlopeGraph';
import { FeatureImportanceChart } from './FeatureImportanceChart';
import { RadarChart } from './RadarChart';
import { IndiaMapChart } from './IndiaMapChart';

export function StrategyPredictorDashboard() {
  const {
    stateStats,
    yearlyStats,
    infrastructureData,
    policyData,
    loading,
  } = useEVData();

  const {
    focusIntensity,
    setFocusIntensity,
    stateProjections,
    strategyProjections,
    strategyKPIs,
    waterfallData,
    featureImportance,
    radarData,
    bubblePlotData,
    slopeGraphData,
    stackedAreaData,
  } = useStrategyPredictor(stateStats, yearlyStats, infrastructureData, policyData);

  if (loading || !stateStats.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground flex items-center gap-3">
            <Target className="w-7 h-7 text-accent" />
            EV Strategy Growth Predictor
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Compare Current vs Focused Strategy — 24-Month Projection for Top 10 States
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">XGBoost Model</span>
        </div>
      </div>

      {/* Scenario Slider */}
      <ScenarioSlider value={focusIntensity} onChange={setFocusIntensity} />

      {/* Strategy KPIs */}
      <section>
        <h3 className="text-lg font-bold font-display text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-secondary" />
          Strategy Comparison KPIs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StrategyKPICard
            title="Projected Units (24m)"
            current={`${(strategyKPIs.currentProjected24m / 1000000).toFixed(2)}M`}
            focused={`${(strategyKPIs.focusedProjected24m / 1000000).toFixed(2)}M`}
            delta={`+${(strategyKPIs.growthAlpha / 1000000).toFixed(2)}M Growth Alpha`}
            deltaType="positive"
            icon={<TrendingUp className="w-5 h-5" />}
            subtitle="Total EV registrations by end of 24 months"
          />
          <StrategyKPICard
            title="Market Penetration 2028"
            current={`${strategyKPIs.marketPenetration2028Current.toFixed(1)}%`}
            focused={`${strategyKPIs.marketPenetration2028Focused.toFixed(1)}%`}
            delta={`+${(strategyKPIs.marketPenetration2028Focused - strategyKPIs.marketPenetration2028Current).toFixed(1)}% gain`}
            deltaType="positive"
            icon={<Target className="w-5 h-5" />}
            subtitle="Estimated share of total vehicle sales"
          />
          <StrategyKPICard
            title="Infra Efficiency"
            current={`${strategyKPIs.infraEfficiencyCurrent.toFixed(0)} units/stn`}
            focused={`${strategyKPIs.infraEfficiencyFocused.toFixed(0)} units/stn`}
            delta={`+${((strategyKPIs.infraEfficiencyFocused / strategyKPIs.infraEfficiencyCurrent - 1) * 100).toFixed(1)}% efficiency`}
            deltaType="positive"
            icon={<Zap className="w-5 h-5" />}
            subtitle="Units sold per charging station"
          />
          <StrategyKPICard
            title="ROI Lift"
            current="Baseline"
            focused={`+${strategyKPIs.roiLift.toFixed(1)}%`}
            delta="Accelerated adoption speed"
            deltaType="positive"
            icon={<BarChart3 className="w-5 h-5" />}
            subtitle="Percentage increase in adoption velocity"
          />
        </div>
      </section>

      {/* Main Strategy Comparison Chart + Map */}
      <section>
        <h3 className="text-lg font-bold font-display text-foreground mb-4 flex items-center gap-2">
          <Map className="w-5 h-5 text-primary" />
          Strategic Overview
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StrategyComparisonChart data={strategyProjections} />
          </div>
          <div className="lg:col-span-1">
            <WaterfallChart data={waterfallData} />
          </div>
        </div>
      </section>

      {/* India Focus Map */}
      <section>
        <IndiaMapChart data={stateProjections} />
      </section>

      {/* Advanced Analytics Row */}
      <section>
        <h3 className="text-lg font-bold font-display text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-accent" />
          Advanced Analytics
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StackedAreaChart data={stackedAreaData} />
          <BubblePlot data={bubblePlotData} />
          <RadarChart data={radarData} />
        </div>
      </section>

      {/* Feature Importance & Slope Graph */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureImportanceChart data={featureImportance} />
          <SlopeGraph data={slopeGraphData} />
        </div>
      </section>

      {/* Strategy Summary */}
      <section className="p-6 rounded-xl bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 border border-accent/30">
        <h3 className="text-lg font-bold font-display text-accent mb-3">📊 Strategy Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">
              <span className="text-accent font-semibold">Growth Alpha:</span> By focusing {focusIntensity}% of resources on the Top 10 states, 
              you can achieve an additional <span className="text-accent font-bold">
                {(strategyKPIs.growthAlpha / 1000000).toFixed(2)}M units
              </span> over 24 months.
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">
              <span className="text-secondary font-semibold">Key Driver:</span> Infrastructure density contributes 
              <span className="text-secondary font-bold"> 35%</span> of the projected growth, followed by 
              Policy Incentives at <span className="text-secondary font-bold">28%</span>.
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">
              <span className="text-primary font-semibold">Recommendation:</span> Prioritize Maharashtra, Karnataka, and Tamil Nadu 
              for maximum ROI. These states show the highest correlation between infrastructure investment and adoption velocity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
