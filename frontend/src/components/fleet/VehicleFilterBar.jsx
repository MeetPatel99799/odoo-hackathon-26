/**
 * VehicleFilterBar - Dropdown filters and search controls for the Vehicle Registry
 *
 * Props:
 * - type: currently selected vehicle type
 * - status: currently selected status
 * - search: currently entered search text
 * - onChange(field, value): callback called when a filter field changes ('type', 'status', or 'search')
 * - onAddClick: callback triggered when the "+ Add Vehicle" button is clicked
 * - canAdd: boolean, if true renders the "+ Add Vehicle" button
 */
export default function VehicleFilterBar({
  type,
  status,
  search,
  onChange,
  onAddClick,
  canAdd = false
}) {
  const handleInputChange = (field, value) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-panel border border-border p-4 rounded-xl shadow-md w-full">
      <div className="flex flex-wrap items-center gap-4 flex-1">
        {/* Search input */}
        <div className="flex flex-col min-w-[200px] flex-1 sm:flex-initial">
          <label htmlFor="search-reg" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Search Reg. No
          </label>
          <input
            id="search-reg"
            type="text"
            value={search ?? ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            placeholder="Search reg. no..."
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all w-full"
          />
        </div>

        {/* Type select */}
        <div className="flex flex-col min-w-[150px] flex-1 sm:flex-initial">
          <label htmlFor="select-type" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Type
          </label>
          <div className="relative">
            <select
              id="select-type"
              value={type ?? ''}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer appearance-none pr-8"
            >
              <option value="">All</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
              <option value="Mini">Mini</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status select */}
        <div className="flex flex-col min-w-[150px] flex-1 sm:flex-initial">
          <label htmlFor="select-status" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Status
          </label>
          <div className="relative">
            <select
              id="select-status"
              value={status ?? ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer appearance-none pr-8"
            >
              <option value="">All</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="In Shop">In Shop</option>
              <option value="Retired">Retired</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Add vehicle button */}
      {canAdd && (
        <button
          onClick={onAddClick}
          className="bg-primary hover:bg-amber-600 text-black font-semibold text-sm rounded-lg px-4 py-2.5 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 self-end sm:self-center"
        >
          <span className="text-base font-bold">+</span> Add Vehicle
        </button>
      )}
    </div>
  );
}
