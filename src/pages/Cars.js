import React, { useEffect, useState } from 'react';
import api from '../api';
import CarCard from '../components/CarCard';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('');
  const [category, setCategory] = useState('');
  const [ordering, setOrdering] = useState('-created_at');

  useEffect(() => {
    api.get('categories/').then(res => setCategories(res.data.results || res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { ordering };
    if (search) params.search = search;
    api.get('cars/', { params })
      .then(res => {
        let data = res.data.results || res.data;
        if (condition) data = data.filter(c => c.condition === condition);
        if (category) data = data.filter(c => String(c.category) === category);
        setCars(data);
      })
      .finally(() => setLoading(false));
  }, [search, condition, category, ordering]);

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">All <span>Cars</span></h2>
        <div className="filters">
          <input placeholder="Search brand, model..." value={search} onChange={e => setSearch(e.target.value)} />
          <select value={condition} onChange={e => setCondition(e.target.value)}>
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </select>
          <select value={ordering} onChange={e => setOrdering(e.target.value)}>
            <option value="-created_at">Newest First</option>
            <option value="price">Price: Low → High</option>
            <option value="-price">Price: High → Low</option>
            <option value="-year">Year: Newest</option>
          </select>
        </div>
        {loading
          ? <div className="loading">Loading cars...</div>
          : cars.length === 0
            ? <div className="empty">No cars found.</div>
            : <div className="car-grid">{cars.map(car => <CarCard key={car.id} car={car} />)}</div>
        }
      </div>
    </section>
  );
}
