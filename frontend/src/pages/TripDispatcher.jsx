import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TripLifecycleStepper from '../components/trips/TripLifecycleStepper';
import CreateTripForm from '../components/trips/CreateTripForm';
import CapacityErrorBox from '../components/trips/CapacityErrorBox';
import LiveBoard from '../components/trips/LiveBoard';

export default function TripDispatcher() {
  const { hasAccess } = useAuth();
  const canWrite = hasAccess('trips', 'write');
  const readOnly = !canWrite;

  const [trips, setTrips] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);

  const [form, setForm] = useState({
    source: '',
    destination: '',
    vehicleId: '',
    driverId: '',
    cargoWeight: '',
    distance: ''
  });
  
  const [activeStage, setActiveStage] = useState('Draft');
  const [dispatchError, setDispatchError] = useState('');

  const fetchDependencies = useCallback(async () => {
    try {
      const [vehRes, drvRes, tripRes] = await Promise.all([
        api.get('/trips/available-vehicles').catch(() => ({ data: [] })),
        api.get('/trips/available-drivers').catch(() => ({ data: [] })),
        api.get('/trips').catch(() => ({ data: [] }))
      ]);
      
      let fetchedVehicles = vehRes.data;
      let fetchedDrivers = drvRes.data;
      let fetchedTrips = tripRes.data;

      // Fallback mock data if API is unreachable
      if (fetchedVehicles.length === 0) {
        fetchedVehicles = [
          { id: 1, regNo: 'VAN-001', capacity: 500 },
          { id: 2, regNo: 'TRK-099', capacity: 2000 }
        ];
      }
      if (fetchedDrivers.length === 0) {
        fetchedDrivers = [
          { id: 1, name: 'Alice Driver' },
          { id: 2, name: 'Bob Wheeler' }
        ];
      }
      if (fetchedTrips.length === 0) {
        fetchedTrips = [
          { id: 101, tripCode: 'TRP-1001', source: 'Warehouse A', destination: 'Store B', vehicle: 'VAN-001', driver: 'Alice Driver', status: 'Dispatched', note: 'On time' }
        ];
      }

      setVehicleOptions(fetchedVehicles);
      setDriverOptions(fetchedDrivers);
      setTrips(fetchedTrips);
    } catch (err) {
      console.error('Failed to fetch dependencies', err);
    }
  }, []);

  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  const capacityExceededBy = useMemo(() => {
    if (!form.vehicleId || !form.cargoWeight) return 0;
    const selectedVeh = vehicleOptions.find(v => String(v.id) === String(form.vehicleId));
    if (!selectedVeh) return 0;
    const weight = Number(form.cargoWeight);
    return weight > selectedVeh.capacity ? weight - selectedVeh.capacity : 0;
  }, [form.vehicleId, form.cargoWeight, vehicleOptions]);

  const selectedVehicleCapacity = useMemo(() => {
    const v = vehicleOptions.find(v => String(v.id) === String(form.vehicleId));
    return v ? v.capacity : 0;
  }, [form.vehicleId, vehicleOptions]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setForm({
      source: '',
      destination: '',
      vehicleId: '',
      driverId: '',
      cargoWeight: '',
      distance: ''
    });
    setActiveStage('Draft');
    setDispatchError('');
  };

  const handleDispatch = async () => {
    if (capacityExceededBy > 0) return;
    
    setDispatchError('');
    try {
      // Create draft first
      const { data: newTrip } = await api.post('/trips', form);
      const tripId = newTrip?.id || Math.floor(Math.random() * 1000); // fallback id if mock
      
      // Then dispatch it
      setActiveStage('Dispatched');
      await api.patch(`/trips/${tripId}/dispatch`);
      
      handleCancel();
      fetchDependencies();
    } catch (err) {
      setDispatchError(err.response?.data?.error || 'Failed to dispatch trip.');
    }
  };

  const handleComplete = async (tripId, data) => {
    try {
      await api.patch(`/trips/${tripId}/complete`, data);
      setActiveStage('Completed');
      fetchDependencies();
    } catch (err) {
      console.error('Failed to complete trip', err);
    }
  };

  const handleCancelTrip = async (tripId) => {
    try {
      await api.patch(`/trips/${tripId}/cancel`);
      setActiveStage('Cancelled');
      fetchDependencies();
    } catch (err) {
      console.error('Failed to cancel trip', err);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text tracking-tight">Trip Dispatcher</h1>
        <p className="text-sm text-gray-400 mt-0.5 mb-6">
          Create, dispatch, and monitor trips in real-time.
        </p>
      </div>

      <TripLifecycleStepper activeStage={activeStage} />
      
      {dispatchError && (
        <div className="bg-red-950/20 border-2 border-dashed border-red-500 rounded-lg p-4 my-2 text-red-400 font-semibold text-sm">
          Server Error: {dispatchError}
        </div>
      )}

      {selectedVehicleCapacity > 0 && form.cargoWeight && capacityExceededBy > 0 && (
        <CapacityErrorBox 
          capacityKg={selectedVehicleCapacity} 
          cargoKg={Number(form.cargoWeight)} 
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="overflow-y-auto pr-2">
          <CreateTripForm
            {...form}
            vehicleOptions={vehicleOptions}
            driverOptions={driverOptions}
            onChange={handleChange}
            onDispatch={handleDispatch}
            onCancel={handleCancel}
            capacityExceededBy={capacityExceededBy}
            readOnly={readOnly}
          />
        </div>
        <div className="overflow-y-auto">
          <LiveBoard
            trips={trips}
            onComplete={handleComplete}
            onCancelTrip={handleCancelTrip}
            readOnly={readOnly}
          />
        </div>
      </div>
    </div>
  );
}