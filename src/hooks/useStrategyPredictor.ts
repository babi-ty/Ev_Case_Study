import { useMemo, useState } from 'react';
import type { StateStats, YearlyStats, InfrastructureRecord, PolicyRecord } from './useEVData';

// Top 10 focus states based on infrastructure and market readiness
export const TOP_10_STATES = [
  'Maharashtra',
  'Karnataka', 
  'Tamil Nadu',
  'Delhi',
  'Gujarat',
  'Uttar Pradesh',
  'Rajasthan',
  'Madhya Pradesh',
  'Telangana',
  'Kerala',
] as const;

export interface StrategyProjection {
  month: number;
  year: number;
  monthLabel: string;
  currentStrategy: number;
  focusedStrategy: number;
  delta: number;
}

export interface StateProjection {
  state: string;
  isTop10: boolean;
  currentUnits: number;
  projectedUnits: number;
  growthRate: number;
  infraDensity: number;
  policyScore: number;
  projectedGrowth: number;
}

export interface StrategyKPIs {
  currentProjected24m: number;
  focusedProjected24m: number;
  growthAlpha: number;
  marketPenetration2028Current: number;
  marketPenetration2028Focused: number;
  infraEfficiencyCurrent: number;
  infraEfficiencyFocused: number;
  roiLift: number;
}

export interface WaterfallItem {
  name: string;
  value: number;
  cumulative: number;
  isTotal?: boolean;
  color: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  category: 'Policy' | 'Infrastructure' | 'Market' | 'Economic';
}

export interface RadarMetric {
  metric: string;
  fullMark: number;
}

export interface StateRadarData {
  state: string;
  policy: number;
  infrastructure: number;
  demand: number;
  affordability: number;
  growth: number;
}

export interface BubblePlotData {
  state: string;
  infraDensity: number;
  salesGrowth: number;
  population: number;
  isTop10: boolean;
}

export interface SlopeGraphData {
  state: string;
  rankBefore: number;
  rankAfter: number;
  isTop10: boolean;
}

export interface StackedAreaData {
  month: number;
  monthLabel: string;
  top10Volume: number;
  othersVolume: number;
}

export function useStrategyPredictor(
  stateStats: StateStats[],
  yearlyStats: YearlyStats[],
  infrastructureData: InfrastructureRecord[],
  policyData: PolicyRecord[],
) {
  const [focusIntensity, setFocusIntensity] = useState(40); // Default 40%

  // Base growth rates
  const BASELINE_MONTHLY_GROWTH = 0.018; // 1.8% monthly for current strategy
  const ACCELERATED_MONTHLY_GROWTH = 0.035; // 3.5% monthly for focused strategy

  // Calculate state projections
  const stateProjections: StateProjection[] = useMemo(() => {
    if (!stateStats.length) return [];

    // Get latest infrastructure data by state
    const latestInfra = new Map<string, InfrastructureRecord>();
    infrastructureData.forEach(r => {
      const existing = latestInfra.get(r.state);
      if (!existing || r.year > existing.year) {
        latestInfra.set(r.state, r);
      }
    });

    // Get policy data by state
    const policyMap = new Map<string, PolicyRecord>();
    policyData.forEach(p => policyMap.set(p.state, p));

    return stateStats.map(state => {
      const isTop10 = TOP_10_STATES.includes(state.state as any);
      const infra = latestInfra.get(state.state);
      const policy = policyMap.get(state.state);

      // Calculate infrastructure density (stations per million vehicles)
      const totalVehicles = state.totalEV + state.totalICE;
      const infraDensity = infra ? (infra.charging_stations / totalVehicles) * 1000000 : 0;

      // Calculate policy score (0-100)
      let policyScore = 0;
      if (policy) {
        policyScore += policy.avg_ev_subsidy_rs / 1000; // Up to ~100 points
        policyScore += policy.road_tax_exemption ? 20 : 0;
        policyScore += policy.registration_fee_waiver ? 15 : 0;
      }
      policyScore = Math.min(100, policyScore);

      // Calculate growth rate based on focus intensity
      const intensityMultiplier = isTop10 ? (1 + focusIntensity / 100) : (1 - focusIntensity / 200);
      const baseGrowthRate = isTop10 ? ACCELERATED_MONTHLY_GROWTH : BASELINE_MONTHLY_GROWTH;
      const adjustedGrowthRate = baseGrowthRate * intensityMultiplier;

      // Project 24 months
      const projectedUnits = state.totalEV * Math.pow(1 + adjustedGrowthRate, 24);
      const projectedGrowth = ((projectedUnits - state.totalEV) / state.totalEV) * 100;

      return {
        state: state.state,
        isTop10,
        currentUnits: state.totalEV,
        projectedUnits,
        growthRate: adjustedGrowthRate * 100,
        infraDensity,
        policyScore,
        projectedGrowth,
      };
    }).sort((a, b) => b.projectedUnits - a.projectedUnits);
  }, [stateStats, infrastructureData, policyData, focusIntensity]);

  // Generate 24-month projection timeline
  const strategyProjections: StrategyProjection[] = useMemo(() => {
    if (!stateStats.length) return [];

    const baselineTotal = stateStats.reduce((sum, s) => sum + s.totalEV, 0);
    const top10Total = stateStats
      .filter(s => TOP_10_STATES.includes(s.state as any))
      .reduce((sum, s) => sum + s.totalEV, 0);
    const othersTotal = baselineTotal - top10Total;

    const projections: StrategyProjection[] = [];
    const startDate = new Date(2024, 11); // Starting from Dec 2024

    for (let month = 0; month <= 24; month++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + month);

      // Current strategy: uniform growth
      const currentStrategy = baselineTotal * Math.pow(1 + BASELINE_MONTHLY_GROWTH, month);

      // Focused strategy: accelerated growth for top 10, reduced for others
      const intensityMultiplier = focusIntensity / 100;
      const top10Accelerated = top10Total * Math.pow(1 + ACCELERATED_MONTHLY_GROWTH * (1 + intensityMultiplier), month);
      const othersReduced = othersTotal * Math.pow(1 + BASELINE_MONTHLY_GROWTH * (1 - intensityMultiplier / 2), month);
      const focusedStrategy = top10Accelerated + othersReduced;

      projections.push({
        month,
        year: date.getFullYear(),
        monthLabel: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        currentStrategy: Math.round(currentStrategy),
        focusedStrategy: Math.round(focusedStrategy),
        delta: Math.round(focusedStrategy - currentStrategy),
      });
    }

    return projections;
  }, [stateStats, focusIntensity]);

  // Calculate strategy KPIs
  const strategyKPIs: StrategyKPIs = useMemo(() => {
    if (!strategyProjections.length || !stateStats.length) {
      return {
        currentProjected24m: 0,
        focusedProjected24m: 0,
        growthAlpha: 0,
        marketPenetration2028Current: 0,
        marketPenetration2028Focused: 0,
        infraEfficiencyCurrent: 0,
        infraEfficiencyFocused: 0,
        roiLift: 0,
      };
    }

    const final = strategyProjections[strategyProjections.length - 1];
    const totalVehicleMarket = stateStats.reduce((sum, s) => sum + s.totalEV + s.totalICE, 0);
    const projectedMarket2028 = totalVehicleMarket * 1.4; // Assume 40% market growth by 2028

    // Total charging stations
    const latestInfra = new Map<string, number>();
    infrastructureData.forEach(r => {
      const existing = latestInfra.get(r.state) || 0;
      if (r.year === 2024) {
        latestInfra.set(r.state, r.charging_stations);
      }
    });
    const totalStations = Array.from(latestInfra.values()).reduce((sum, s) => sum + s, 0) || 7500;

    return {
      currentProjected24m: final.currentStrategy,
      focusedProjected24m: final.focusedStrategy,
      growthAlpha: final.focusedStrategy - final.currentStrategy,
      marketPenetration2028Current: (final.currentStrategy / projectedMarket2028) * 100,
      marketPenetration2028Focused: (final.focusedStrategy / projectedMarket2028) * 100,
      infraEfficiencyCurrent: final.currentStrategy / totalStations,
      infraEfficiencyFocused: final.focusedStrategy / totalStations,
      roiLift: ((final.focusedStrategy - final.currentStrategy) / final.currentStrategy) * 100,
    };
  }, [strategyProjections, stateStats, infrastructureData]);

  // Waterfall chart data
  const waterfallData: WaterfallItem[] = useMemo(() => {
    if (!strategyKPIs.growthAlpha) return [];

    const alpha = strategyKPIs.growthAlpha;
    const policyContrib = alpha * 0.28;
    const infraContrib = alpha * 0.35;
    const marketingContrib = alpha * 0.22;
    const demandContrib = alpha * 0.15;

    let cumulative = 0;

    return [
      {
        name: 'Baseline',
        value: strategyKPIs.currentProjected24m,
        cumulative: strategyKPIs.currentProjected24m,
        color: 'hsl(var(--muted))',
      },
      {
        name: 'Infrastructure Density',
        value: infraContrib,
        cumulative: (cumulative += infraContrib) + strategyKPIs.currentProjected24m,
        color: 'hsl(var(--primary))',
      },
      {
        name: 'Policy Incentives',
        value: policyContrib,
        cumulative: (cumulative += policyContrib) + strategyKPIs.currentProjected24m,
        color: 'hsl(var(--secondary))',
      },
      {
        name: 'Targeted Marketing',
        value: marketingContrib,
        cumulative: (cumulative += marketingContrib) + strategyKPIs.currentProjected24m,
        color: 'hsl(var(--accent))',
      },
      {
        name: 'Latent Demand',
        value: demandContrib,
        cumulative: (cumulative += demandContrib) + strategyKPIs.currentProjected24m,
        color: 'hsl(207, 100%, 50%)',
      },
      {
        name: 'Total Focused',
        value: strategyKPIs.focusedProjected24m,
        cumulative: strategyKPIs.focusedProjected24m,
        isTotal: true,
        color: 'hsl(var(--accent))',
      },
    ];
  }, [strategyKPIs]);

  // Feature importance data (mock XGBoost coefficients)
  const featureImportance: FeatureImportance[] = useMemo(() => ([
    { feature: 'Charging Station Density', importance: 0.28, category: 'Infrastructure' as const },
    { feature: 'Fast Charger Availability', importance: 0.18, category: 'Infrastructure' as const },
    { feature: 'State EV Subsidy', importance: 0.22, category: 'Policy' as const },
    { feature: 'Road Tax Exemption', importance: 0.12, category: 'Policy' as const },
    { feature: 'Fuel Price Index', importance: 0.08, category: 'Economic' as const },
    { feature: 'Average Income Index', importance: 0.07, category: 'Economic' as const },
    { feature: 'Urban Coverage', importance: 0.05, category: 'Market' as const },
  ] as FeatureImportance[]).sort((a, b) => b.importance - a.importance), []);

  // Radar chart data for top 10 states
  const radarData: StateRadarData[] = useMemo(() => {
    return stateProjections
      .filter(s => s.isTop10)
      .slice(0, 5)
      .map(s => {
        const policy = policyData.find(p => p.state === s.state);
        return {
          state: s.state,
          policy: s.policyScore,
          infrastructure: Math.min(100, s.infraDensity * 10),
          demand: Math.min(100, (s.currentUnits / 1000000) * 20),
          affordability: Math.min(100, policy?.avg_ev_subsidy_rs ? policy.avg_ev_subsidy_rs / 1000 : 30),
          growth: Math.min(100, s.projectedGrowth / 2),
        };
      });
  }, [stateProjections, policyData]);

  // Bubble plot data
  const bubblePlotData: BubblePlotData[] = useMemo(() => {
    // Mock population data (in millions)
    const populationMap: Record<string, number> = {
      'Maharashtra': 125, 'Karnataka': 67, 'Tamil Nadu': 77, 'Delhi': 20,
      'Gujarat': 64, 'Uttar Pradesh': 230, 'Rajasthan': 78, 'Madhya Pradesh': 85,
      'Telangana': 38, 'Kerala': 35, 'Punjab': 28, 'Haryana': 29,
      'West Bengal': 99, 'Odisha': 47, 'Bihar': 124, 'Jharkhand': 38,
      'Chhattisgarh': 30, 'Assam': 35,
    };

    return stateProjections.map(s => ({
      state: s.state,
      infraDensity: s.infraDensity,
      salesGrowth: s.projectedGrowth,
      population: populationMap[s.state] || 30,
      isTop10: s.isTop10,
    }));
  }, [stateProjections]);

  // Slope graph data
  const slopeGraphData: SlopeGraphData[] = useMemo(() => {
    // Current ranking by EV count
    const currentRanking = [...stateStats]
      .sort((a, b) => b.totalEV - a.totalEV)
      .map((s, i) => ({ state: s.state, rank: i + 1 }));

    // Projected ranking after 2 years
    const projectedRanking = [...stateProjections]
      .sort((a, b) => b.projectedUnits - a.projectedUnits)
      .map((s, i) => ({ state: s.state, rank: i + 1 }));

    return currentRanking.slice(0, 12).map(c => {
      const projected = projectedRanking.find(p => p.state === c.state);
      return {
        state: c.state,
        rankBefore: c.rank,
        rankAfter: projected?.rank || c.rank,
        isTop10: TOP_10_STATES.includes(c.state as any),
      };
    });
  }, [stateStats, stateProjections]);

  // Stacked area data
  const stackedAreaData: StackedAreaData[] = useMemo(() => {
    if (!stateStats.length) return [];

    const top10Total = stateStats
      .filter(s => TOP_10_STATES.includes(s.state as any))
      .reduce((sum, s) => sum + s.totalEV, 0);
    const othersTotal = stateStats
      .filter(s => !TOP_10_STATES.includes(s.state as any))
      .reduce((sum, s) => sum + s.totalEV, 0);

    const startDate = new Date(2024, 11);
    const intensityMultiplier = focusIntensity / 100;

    return Array.from({ length: 25 }, (_, month) => {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + month);

      const top10Volume = top10Total * Math.pow(1 + ACCELERATED_MONTHLY_GROWTH * (1 + intensityMultiplier), month);
      const othersVolume = othersTotal * Math.pow(1 + BASELINE_MONTHLY_GROWTH * (1 - intensityMultiplier / 2), month);

      return {
        month,
        monthLabel: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        top10Volume: Math.round(top10Volume),
        othersVolume: Math.round(othersVolume),
      };
    });
  }, [stateStats, focusIntensity]);

  return {
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
    TOP_10_STATES,
  };
}
