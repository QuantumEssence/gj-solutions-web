import React from 'react';
import { Search, Filter, XCircle, Calendar, CheckSquare } from 'lucide-react';
import type { FilterState } from './types';

interface LeadFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  filters,
  onFilterChange,
  totalCount,
  filteredCount
}) => {
  const hasActiveFilters = 
    Boolean(filters.search.trim()) || 
    filters.status !== 'All' || 
    filters.spmc !== 'All' || 
    filters.dateRange !== 'all';

  const handleReset = () => {
    onFilterChange({
      search: '',
      status: 'All',
      spmc: 'All',
      dateRange: 'all',
      referenceTimestamp: 0
    });
  };

  return (
    <div className="admin-filters-container">
      <div className="admin-filters-grid">
        {/* Search Input */}
        <div className="admin-filter-field search-field">
          <label htmlFor="search-input" className="admin-filter-label">
            <Search size={14} /> Search Practitioner / Clinic / Email
          </label>
          <div className="admin-search-wrapper">
            <input
              id="search-input"
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Search by name, email, or clinic domain..."
              className="admin-search-input"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, search: '' })}
                className="admin-search-clear-btn"
                title="Clear search"
              >
                <XCircle size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="admin-filter-field">
          <label htmlFor="status-select" className="admin-filter-label">
            <Filter size={14} /> Status
          </label>
          <select
            id="status-select"
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="admin-select-input"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Meeting Scheduled">Meeting Scheduled</option>
            <option value="Replied via Email">Replied via Email</option>
          </select>
        </div>

        {/* SPMC Affiliation Toggle */}
        <div className="admin-filter-field">
          <label className="admin-filter-label">
            <CheckSquare size={14} /> SPMC Affiliation
          </label>
          <div className="admin-toggle-group">
            <button
              type="button"
              className={`admin-toggle-btn ${filters.spmc === 'All' ? 'active' : ''}`}
              onClick={() => onFilterChange({ ...filters, spmc: 'All' })}
            >
              All
            </button>
            <button
              type="button"
              className={`admin-toggle-btn ${filters.spmc === 'SPMC Only' ? 'active' : ''}`}
              onClick={() => onFilterChange({ ...filters, spmc: 'SPMC Only' })}
            >
              SPMC Only
            </button>
            <button
              type="button"
              className={`admin-toggle-btn ${filters.spmc === 'Non-SPMC' ? 'active' : ''}`}
              onClick={() => onFilterChange({ ...filters, spmc: 'Non-SPMC' })}
            >
              Non-SPMC
            </button>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="admin-filter-field">
          <label htmlFor="date-range-select" className="admin-filter-label">
            <Calendar size={14} /> Date Range
          </label>
          <select
            id="date-range-select"
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value, referenceTimestamp: Date.now() })}
            className="admin-select-input"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Filter Stats Bar and Reset */}
      <div className="admin-filters-summary">
        <div className="admin-filters-count">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> inquiries
          {hasActiveFilters && <span className="admin-filter-active-pill">Filters Active</span>}
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="admin-filter-reset-btn"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default LeadFilters;
