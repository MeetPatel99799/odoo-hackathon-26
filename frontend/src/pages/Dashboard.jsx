import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import FilterBar from '../components/dashboard/FilterBar';
import KpiCard from '../components/dashboard/KpiCard';
import RecentTripsTable from '../components/dashboard/RecentTripsTable';
import VehicleStatusPanel from '../components/dashboard/VehicleStatusPanel';

const TYPE_OPTIONS = ['Truck', 'Van', 'Sedan', 'SUV'];
const STATUS_OPTIONS = ['Available', 'On Trip', 'In Shop', 'Retired'];
const REGION_OPTIONS = ['North Region', 'South Region', 'East Region', 'West Region'];

function mapTrips(rows) {
  return rows.map((row) => ({
    tripCode: row.trip_code,
    vehicle: row.vehicle_name ?? '—',
    driver: row.driver_name ?? '—',
    status: row.status,
    eta: row.eta,
  }));
}

function toStatusCounts(summary) {
  const counts = {};
  for (const { status, count } of summary) {
    counts[status] = count;
  }
  return counts;
}

function buildFilterParams(vehicleType, status, region) {
  const params = {};
  if (vehicleType) params.vehicleType = vehicleType;
  if (status) params.status = status;
  if (region) params.region = region;
  return params;
}

export default function Dashboard() {
  const [vehicleType, setVehicleType] = useState('');
  const [status, setStatus] = useState('');
  const [region, setRegion] = useState('');

  const [kpis, setKpis] = useState(null);
  const [trips, setTrips] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = buildFilterParams(vehicleType, status, region);
      const [kpisRes, tripsRes, statusRes] = await Promise.all([
        api.get('/dashboard/kpis', { params }),
        api.get('/dashboard/recent-trips'),
        api.get('/dashboard/vehicle-status-summary'),
      ]);

      setKpis(kpisRes.data);
      setTrips(mapTrips(tripsRes.data));
      setStatusCounts(toStatusCounts(statusRes.data));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [vehicleType, status, region]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleFilterChange = (field, value) => {
    if (field === 'vehicleType') setVehicleType(value);
    if (field === 'status') setStatus(value);
    if (field === 'region') setRegion(value);
  };

  if (loading && !kpis) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading dashboard…</span>
        </div>
      </div>
    );
  }

  if (error && !kpis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-gray-400">
        <p className="text-sm text-red-400">{error}</p>
        <button
          type="button"
          onClick={fetchDashboard}
          className="text-sm text-primary hover:text-primary/80 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Transit Operations and Fleet Analytics Control Center
          </p>
        </div>
        {loading && (
          <span className="text-xs text-gray-500 self-start md:self-auto">Refreshing…</span>
        )}
      </div>

      <FilterBar
        vehicleType={vehicleType}
        status={status}
        region={region}
        onChange={handleFilterChange}
        typeOptions={TYPE_OPTIONS}
        statusOptions={STATUS_OPTIONS}
        regionOptions={REGION_OPTIONS}
      />

      {error && (
        <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm">
          <span>{error}</span>
          <button type="button" onClick={fetchDashboard} className="underline hover:text-red-300">
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Active Vehicles"
          value={kpis?.activeVehicles ?? 0}
          suffix="On Trip"
          accentColor="#c9791a"
        />
        <KpiCard
          label="Available Vehicles"
          value={kpis?.availableVehicles ?? 0}
          accentColor="#10b981"
        />
        <KpiCard
          label="In Service Bay"
          value={kpis?.vehiclesInMaintenance ?? 0}
          suffix="Units"
          accentColor="#f59e0b"
        />
        <KpiCard
          label="Active Trips"
          value={kpis?.activeTrips ?? 0}
          accentColor="#3b82f6"
        />
        <KpiCard
          label="Pending Trips"
          value={kpis?.pendingTrips ?? 0}
          accentColor="#8b5cf6"
        />
        <KpiCard
          label="Drivers On Duty"
          value={kpis?.driversOnDuty ?? 0}
          accentColor="#06b6d4"
        />
        <KpiCard
          label="Fleet Utilization"
          value={kpis?.fleetUtilizationPct ?? 0}
          suffix="%"
          accentColor="#c9791a"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <RecentTripsTable trips={trips} />
        </div>
        <div className="lg:col-span-1">
          <VehicleStatusPanel counts={statusCounts} />
        </div>
      </div>
    </div>
  );
}
