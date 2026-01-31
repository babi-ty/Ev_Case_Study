import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export interface EVAdoptionRecord {
  state: string;
  year: number;
  vehicle_segment: string;
  ice_vehicle_registrations: number;
  ev_vehicle_registrations: number;
  charging_stations: number;
  avg_ev_subsidy_rs: number;
  fuel_price_rs_per_litre: number;
  avg_income_index: number;
}

export interface InfrastructureRecord {
  state: string;
  year: number;
  charging_stations: number;
  fast_charger_pct: number;
  urban_coverage_pct: number;
}

export interface PolicyRecord {
  state: string;
  policy_start_year: number;
  avg_ev_subsidy_rs: number;
  road_tax_exemption: number;
  registration_fee_waiver: number;
}

export interface YearlyStats {
  year: number;
  totalEV: number;
  totalICE: number;
  evPenetration: number;
  evGrowth: number;
}

export interface StateStats {
  state: string;
  totalEV: number;
  totalICE: number;
  evPenetration: number;
  chargingStations: number;
}

export interface SegmentStats {
  segment: string;
  totalEV: number;
  totalICE: number;
  evPenetration: number;
}

export interface KPIs {
  nationalPenetration: number;
  penetrationChange: number;
  displacementRatio: number;
  displacementChange: number;
  adoptionVelocity: number;
  velocityChange: number;
  totalEVRegistrations: number;
  totalChargingStations: number;
}

export function useEVData() {
  const [adoptionData, setAdoptionData] = useState<EVAdoptionRecord[]>([]);
  const [infrastructureData, setInfrastructureData] = useState<InfrastructureRecord[]>([]);
  const [policyData, setPolicyData] = useState<PolicyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all CSV files
        const [adoptionRes, infraRes, policyRes] = await Promise.all([
          fetch('/data/ev_adoption.csv'),
          fetch('/data/infrastructure.csv'),
          fetch('/data/policies.csv'),
        ]);

        const [adoptionText, infraText, policyText] = await Promise.all([
          adoptionRes.text(),
          infraRes.text(),
          policyRes.text(),
        ]);

        // Parse CSVs
        const adoptionParsed = Papa.parse(adoptionText, { header: true, dynamicTyping: true });
        const infraParsed = Papa.parse(infraText, { header: true, dynamicTyping: true });
        const policyParsed = Papa.parse(policyText, { header: true, dynamicTyping: true });

        setAdoptionData(adoptionParsed.data.filter((r: any) => r.state) as EVAdoptionRecord[]);
        setInfrastructureData(infraParsed.data.filter((r: any) => r.state) as InfrastructureRecord[]);
        setPolicyData(policyParsed.data.filter((r: any) => r.state) as PolicyRecord[]);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate yearly statistics
  const yearlyStats: YearlyStats[] = (() => {
    if (!adoptionData.length) return [];
    
    const yearMap = new Map<number, { ev: number; ice: number }>();
    
    adoptionData.forEach((record) => {
      const year = record.year;
      const existing = yearMap.get(year) || { ev: 0, ice: 0 };
      yearMap.set(year, {
        ev: existing.ev + (record.ev_vehicle_registrations || 0),
        ice: existing.ice + (record.ice_vehicle_registrations || 0),
      });
    });

    const years = Array.from(yearMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, data]) => {
        const total = data.ev + data.ice;
        return {
          year,
          totalEV: data.ev,
          totalICE: data.ice,
          evPenetration: total > 0 ? (data.ev / total) * 100 : 0,
          evGrowth: 0,
        };
      });

    // Calculate YoY growth
    for (let i = 1; i < years.length; i++) {
      const prevEV = years[i - 1].totalEV;
      if (prevEV > 0) {
        years[i].evGrowth = ((years[i].totalEV - prevEV) / prevEV) * 100;
      }
    }

    return years;
  })();

  // Calculate state statistics
  const stateStats: StateStats[] = (() => {
    if (!adoptionData.length) return [];
    
    const stateMap = new Map<string, { ev: number; ice: number; stations: number }>();
    
    adoptionData.forEach((record) => {
      const state = record.state;
      const existing = stateMap.get(state) || { ev: 0, ice: 0, stations: 0 };
      stateMap.set(state, {
        ev: existing.ev + (record.ev_vehicle_registrations || 0),
        ice: existing.ice + (record.ice_vehicle_registrations || 0),
        stations: Math.max(existing.stations, record.charging_stations || 0),
      });
    });

    return Array.from(stateMap.entries())
      .map(([state, data]) => {
        const total = data.ev + data.ice;
        return {
          state,
          totalEV: data.ev,
          totalICE: data.ice,
          evPenetration: total > 0 ? (data.ev / total) * 100 : 0,
          chargingStations: data.stations,
        };
      })
      .sort((a, b) => b.evPenetration - a.evPenetration);
  })();

  // Calculate segment statistics
  const segmentStats: SegmentStats[] = (() => {
    if (!adoptionData.length) return [];
    
    const segmentMap = new Map<string, { ev: number; ice: number }>();
    
    adoptionData.forEach((record) => {
      const segment = record.vehicle_segment;
      const existing = segmentMap.get(segment) || { ev: 0, ice: 0 };
      segmentMap.set(segment, {
        ev: existing.ev + (record.ev_vehicle_registrations || 0),
        ice: existing.ice + (record.ice_vehicle_registrations || 0),
      });
    });

    return Array.from(segmentMap.entries())
      .map(([segment, data]) => {
        const total = data.ev + data.ice;
        return {
          segment,
          totalEV: data.ev,
          totalICE: data.ice,
          evPenetration: total > 0 ? (data.ev / total) * 100 : 0,
        };
      })
      .sort((a, b) => b.evPenetration - a.evPenetration);
  })();

  // Calculate KPIs
  const kpis: KPIs = (() => {
    if (!yearlyStats.length) {
      return {
        nationalPenetration: 0,
        penetrationChange: 0,
        displacementRatio: 0,
        displacementChange: 0,
        adoptionVelocity: 0,
        velocityChange: 0,
        totalEVRegistrations: 0,
        totalChargingStations: 0,
      };
    }

    const latestYear = yearlyStats[yearlyStats.length - 1];
    const prevYear = yearlyStats.length > 1 ? yearlyStats[yearlyStats.length - 2] : latestYear;
    const twoPrevYear = yearlyStats.length > 2 ? yearlyStats[yearlyStats.length - 3] : prevYear;

    const totalEV = yearlyStats.reduce((sum, y) => sum + y.totalEV, 0);
    const totalICE = yearlyStats.reduce((sum, y) => sum + y.totalICE, 0);
    const nationalPenetration = (totalEV / (totalEV + totalICE)) * 100;

    const prevTotalEV = yearlyStats.slice(0, -1).reduce((sum, y) => sum + y.totalEV, 0);
    const prevTotalICE = yearlyStats.slice(0, -1).reduce((sum, y) => sum + y.totalICE, 0);
    const prevPenetration = prevTotalEV / (prevTotalEV + prevTotalICE) * 100;

    const displacementRatio = latestYear.totalICE / latestYear.totalEV;
    const prevDisplacementRatio = prevYear.totalICE / prevYear.totalEV;

    const adoptionVelocity = latestYear.evPenetration - prevYear.evPenetration;
    const prevVelocity = prevYear.evPenetration - twoPrevYear.evPenetration;

    // Get total charging stations from latest infrastructure data
    const latestInfra = infrastructureData.filter(r => r.year === 2024);
    const totalStations = latestInfra.reduce((sum, r) => sum + (r.charging_stations || 0), 0);

    return {
      nationalPenetration,
      penetrationChange: nationalPenetration - prevPenetration,
      displacementRatio,
      displacementChange: displacementRatio - prevDisplacementRatio,
      adoptionVelocity,
      velocityChange: adoptionVelocity - prevVelocity,
      totalEVRegistrations: totalEV,
      totalChargingStations: totalStations > 0 ? totalStations : 7500,
    };
  })();

  // Policy analysis
  const policyImpact = (() => {
    if (!policyData.length || !stateStats.length) return [];
    
    return policyData.map(policy => {
      const stateData = stateStats.find(s => s.state === policy.state);
      return {
        state: policy.state,
        policyStartYear: policy.policy_start_year,
        subsidy: policy.avg_ev_subsidy_rs,
        roadTaxExemption: policy.road_tax_exemption === 1,
        registrationWaiver: policy.registration_fee_waiver === 1,
        evPenetration: stateData?.evPenetration || 0,
      };
    }).sort((a, b) => b.evPenetration - a.evPenetration);
  })();

  // Infrastructure by state for latest year
  const latestInfrastructure = (() => {
    if (!infrastructureData.length) return [];
    
    const latestByState = new Map<string, InfrastructureRecord>();
    infrastructureData.forEach(record => {
      const existing = latestByState.get(record.state);
      if (!existing || record.year > existing.year) {
        latestByState.set(record.state, record);
      }
    });

    return Array.from(latestByState.values()).sort((a, b) => b.charging_stations - a.charging_stations);
  })();

  return {
    adoptionData,
    infrastructureData,
    policyData,
    yearlyStats,
    stateStats,
    segmentStats,
    kpis,
    policyImpact,
    latestInfrastructure,
    loading,
    error,
  };
}
