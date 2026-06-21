import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';
import CarCard from '../components/CarCard';
import Loading from '../components/Loading';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    condition: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    ordering: '-created_at'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load categories
  useEffect(() => {
    api.get('categories/')
      .then(res => setCategories(res.data.results || res.data))
      .catch(err => console.error('Error loading categories:', err));
  }, []);

  // Load all cars initially
  useEffect(() => {
    setLoading(true);
    api.get('cars/?is_available=all')
      .then(res => {
        const data = res.data.results || res.data;
        setAllCars(data);
        setCars(data);
      })
      .catch(err => {
        console.error('Error loading cars:', err);
        // Show user-friendly error message
        const errorMessage = err.message || 'Failed to load cars';
        alert(`Connection Error: ${errorMessage}\n\nPlease check:\n1. Your internet connection\n2. Try refreshing the page\n3. The server might be temporarily unavailable`);
        setAllCars([]);
        setCars([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter function
  const applyFilters = useCallback((carsData, currentFilters) => {
    let filtered = [...carsData];

    // Search filter
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      filtered = filtered.filter(car => 
        car.brand.toLowerCase().includes(searchTerm) ||
        car.model.toLowerCase().includes(searchTerm) ||
        `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm) ||
        car.year.toString().includes(searchTerm)
      );
    }

    // Condition filter
    if (currentFilters.condition) {
      filtered = filtered.filter(car => car.condition === currentFilters.condition);
    }

    // Category filter
    if (currentFilters.category) {
      filtered = filtered.filter(car => String(car.category) === currentFilters.category);
    }

    // Price range filter
    if (currentFilters.minPrice) {
      filtered = filtered.filter(car => parseFloat(car.price) >= parseFloat(currentFilters.minPrice));
    }
    if (currentFilters.maxPrice) {
      filtered = filtered.filter(car => parseFloat(car.price) <= parseFloat(currentFilters.maxPrice));
    }

    // Year range filter
    if (currentFilters.minYear) {
      filtered = filtered.filter(car => car.year >= parseInt(currentFilters.minYear));
    }
    if (currentFilters.maxYear) {
      filtered = filtered.filter(car => car.year <= parseInt(currentFilters.maxYear));
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (currentFilters.ordering) {
        case 'price':
          return parseFloat(a.price) - parseFloat(b.price);
        case '-price':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'year':
          return a.year - b.year;
        case '-year':
          return b.year - a.year;
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case '-created_at':
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

    return filtered;
  }, []);

  // Debounced filter application
  const debouncedApplyFilters = useCallback((currentFilters) => {
    const filtered = applyFilters(allCars, currentFilters);
    setCars(filtered);
  }, [allCars, applyFilters]);

  // Apply filters when they change
  useEffect(() => {
    if (allCars.length > 0) {
      debouncedApplyFilters(filters);
    }
  }, [filters, allCars, debouncedApplyFilters]);

  // Update filter function
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      condition: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      ordering: '-created_at'
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== '-created_at'
  );

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">All <span>Cars</span></h2>
        <p className="section-subtitle">Find your perfect vehicle from our extensive collection</p>
        
        {/* Filter Panel */}
        <div className="filter-panel">
          <div className="filters-row">
            <div className="filter-group">
              <input 
                placeholder="🔍 Search brand, model, year..." 
                value={filters.search} 
                onChange={e => updateFilter('search', e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <select value={filters.condition} onChange={e => updateFilter('condition', e.target.value)}>
                <option value="">All Conditions</option>
                <option value="new">✨ New</option>
                <option value="used">🔧 Used</option>
              </select>
            </div>
            
            <div className="filter-group">
              <select value={filters.category} onChange={e => updateFilter('category', e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
              </select>
            </div>
            
            <div className="filter-group">
              <select value={filters.ordering} onChange={e => updateFilter('ordering', e.target.value)}>
                <option value="-created_at">🆕 Newest First</option>
                <option value="price">💰 Price: Low → High</option>
                <option value="-price">💰 Price: High → Low</option>
                <option value="-year">📅 Year: Newest</option>
                <option value="year">📅 Year: Oldest</option>
                <option value="brand">🔤 Brand A-Z</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="advanced-filters-toggle">
            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '▲ Hide Advanced' : '▼ Advanced Filters'}
            </button>
            
            {hasActiveFilters && (
              <button 
                className="btn btn-sm btn-outline"
                onClick={clearFilters}
              >
                ✕ Clear All
              </button>
            )}
          </div>

          {showAdvanced && (
            <div className="advanced-filters">
              <div className="filter-row">
                <div className="filter-group">
                  <label>Min Price (KSh)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 500000"
                    value={filters.minPrice}
                    onChange={e => updateFilter('minPrice', e.target.value)}
                  />
                </div>
                
                <div className="filter-group">
                  <label>Max Price (KSh)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 5000000"
                    value={filters.maxPrice}
                    onChange={e => updateFilter('maxPrice', e.target.value)}
                  />
                </div>
                
                <div className="filter-group">
                  <label>Min Year</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 2015"
                    value={filters.minYear}
                    onChange={e => updateFilter('minYear', e.target.value)}
                  />
                </div>
                
                <div className="filter-group">
                  <label>Max Year</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 2024"
                    value={filters.maxYear}
                    onChange={e => updateFilter('maxYear', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <Loading text="Loading cars..." />
        ) : (
          <>
            <div className="results-info">
              <p>
                {hasActiveFilters ? (
                  <>Filtered {cars.length} of {allCars.length} cars</>
                ) : (
                  <>Showing all {cars.length} cars</>
                )}
              </p>
            </div>
            
            {cars.length === 0 ? (
              <div className="empty">
                <h3>No cars found</h3>
                <p>Try adjusting your filters or search terms</p>
                {hasActiveFilters && (
                  <button className="btn btn-primary" onClick={clearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="car-grid">
                {cars.map(car => <CarCard key={car.id} car={car} />)}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
