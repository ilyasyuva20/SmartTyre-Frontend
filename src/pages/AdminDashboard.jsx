import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  KeyRound, 
  BarChart3, 
  Package, 
  Plus, 
  Edit2, 
  Check, 
  X, 
  LogOut, 
  TrendingUp, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { adminApi } from '../services/api';

const AdminDashboard = () => {
  const { adminToken, setAdminToken, logoutAdmin } = useApp();
  
  // Auth Form State
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Dashboard Data State
  const [inventory, setInventory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Inline Editing State
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(null);

  // New Tire Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTire, setNewTire] = useState({
    brand: '',
    model_name: '',
    size: '',
    price: '',
    category: 'recommended',
    warranty_years: 3,
    stock_count: 10
  });

  const fetchAdminData = async () => {
    setLoadingData(true);
    try {
      const [invRes, anaRes] = await Promise.all([
        adminApi.getInventory(),
        adminApi.getAnalytics()
      ]);

      if (invRes.success) setInventory(invRes.tires || []);
      if (anaRes.success) setAnalytics(anaRes);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      if (err.response?.status === 401) {
        logoutAdmin();
      }
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAdminData();
    }
  }, [adminToken]);

  // Handle Admin Login PIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);

    try {
      const response = await adminApi.login(pinInput);
      if (response.success && response.token) {
        localStorage.setItem('smart_tire_admin_token', response.token);
        setAdminToken(response.token);
      } else {
        setAuthError(response.message || 'Invalid PIN');
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Authentication failed. Check PIN.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Inline Price & Stock Edit Handler
  const handleStartEdit = (tire) => {
    setEditingId(tire.id);
    setEditPrice(tire.price);
    setEditStock(tire.stock_count);
  };

  const handleSaveInlineEdit = async (id) => {
    try {
      const response = await adminApi.updateTire(id, {
        price: parseFloat(editPrice),
        stock_count: parseInt(editStock, 10)
      });

      if (response.success) {
        setInventory(prev => prev.map(t => t.id === id ? response.data : t));
        setEditingId(null);
        setUpdateSuccess(`Price updated to ₹${editPrice}`);
        setTimeout(() => setUpdateSuccess(null), 3000);
      }
    } catch (err) {
      alert('Failed to update tire price');
    }
  };

  // Create New Tire Entry
  const handleCreateTire = async (e) => {
    e.preventDefault();
    try {
      const response = await adminApi.addTire({
        ...newTire,
        price: parseFloat(newTire.price),
        warranty_years: parseInt(newTire.warranty_years, 10),
        stock_count: parseInt(newTire.stock_count, 10)
      });

      if (response.success) {
        setInventory([response.data, ...inventory]);
        setIsAddModalOpen(false);
        setNewTire({ brand: '', model_name: '', size: '', price: '', category: 'recommended', warranty_years: 3, stock_count: 10 });
      }
    } catch (err) {
      alert('Failed to add tire entry');
    }
  };

  // Filter Inventory
  const filteredInventory = inventory.filter(t => 
    t.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.model_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.size.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // If Not Authenticated - Render PIN Auth Screen
  if (!adminToken) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-3xl p-8 border border-red-accent/40 shadow-glow-red space-y-6 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-accent/20 border border-red-accent/40 mx-auto flex items-center justify-center text-red-accent">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-display font-black text-white">Business Admin Portal</h2>
            <p className="text-xs text-slate-400 mt-1">Enter 4-Digit Security PIN to manage pricing & stock</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="• • • •"
                className="w-full bg-dark-900 border-2 border-slate-700 focus:border-red-accent rounded-2xl p-4 text-center font-mono font-bold text-2xl tracking-[0.5em] text-white focus:outline-none shadow-inner"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-accent font-medium bg-red-accent/10 py-2 rounded-xl border border-red-accent/30">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isAuthenticating || pinInput.length < 4}
              className="w-full py-4 bg-gradient-to-r from-red-accent to-red-dark text-white font-bold rounded-2xl shadow-glow-red disabled:opacity-40 transition-all active:scale-95"
            >
              {isAuthenticating ? 'Authenticating...' : 'Unlock Admin Dashboard'}
            </button>
          </form>

          <p className="text-[11px] text-slate-500">Default PIN for testing: <span className="font-mono text-red-accent font-bold">8888</span></p>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard Interface
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dark-800 p-5 rounded-3xl border border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-accent">Workshop Control Center</span>
          <h2 className="text-2xl font-display font-black text-white">Smart Tire Hub Admin</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-red-accent hover:bg-red-dark text-white font-bold text-xs rounded-xl shadow-glow-red-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Tire
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2.5 bg-dark-700 hover:bg-dark-600 text-slate-400 hover:text-white rounded-xl transition-colors"
            title="Logout Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {updateSuccess && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold rounded-2xl text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {updateSuccess}
        </motion.div>
      )}

      {/* Analytics Widget: Top Searched Vehicles (Last 30 Days) */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-accent/20 border border-red-accent/40 flex items-center justify-center text-red-accent">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">Top Searched Vehicles (Last 30 Days)</h3>
            <p className="text-xs text-slate-400">Demand insights from `search_logs` table for inventory planning</p>
          </div>
        </div>

        {analytics?.top_searched_vehicles ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {analytics.top_searched_vehicles.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-dark-900/90 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-display font-bold text-white">{item.vehicle}</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-accent/20 text-red-accent text-[10px] font-bold">
                    {item.count} searches
                  </span>
                </div>
                {/* Popularity Progress Bar */}
                <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-accent to-amber-500 rounded-full" 
                    style={{ width: `${Math.min(100, (item.count / (analytics.total_searches_last_30_days || 1)) * 100 * 3)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">Loading analytics report...</p>
        )}
      </div>

      {/* Quick Price Edit Inventory Data Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-red-accent" />
            <h3 className="font-display font-bold text-lg text-white">Inventory Catalog & Quick Inline Edit</h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Filter brand, size..."
              className="w-full bg-dark-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-accent"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-900 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Brand & Model</th>
                <th className="p-3.5">Size</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price (₹) [Inline Edit]</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-dark-800/40">
              {filteredInventory.map((t) => {
                const isEditing = editingId === t.id;

                return (
                  <tr key={t.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white">{t.brand}</div>
                      <div className="text-slate-400 text-[11px]">{t.model_name}</div>
                    </td>
                    <td className="p-3.5 font-mono font-semibold text-slate-200">{t.size}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.category === 'premium' ? 'bg-amber-500/20 text-amber-300' :
                        t.category === 'recommended' ? 'bg-red-accent/20 text-red-accent' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editPrice}
                          onChange={e => setEditPrice(e.target.value)}
                          className="w-24 bg-dark-900 border border-red-accent rounded-lg p-1.5 font-mono font-bold text-white text-xs focus:outline-none"
                        />
                      ) : (
                        <span className="font-mono font-bold text-white text-sm">₹{t.price}</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={e => setEditStock(e.target.value)}
                          className="w-16 bg-dark-900 border border-red-accent rounded-lg p-1.5 font-mono font-bold text-white text-xs focus:outline-none"
                        />
                      ) : (
                        <span className={`font-semibold ${t.stock_count > 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {t.stock_count} units
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSaveInlineEdit(t.id)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-dark-700 text-slate-400 hover:text-white rounded-lg"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(t)}
                          className="px-2.5 py-1 bg-dark-700 hover:bg-red-accent hover:text-white text-slate-300 font-semibold rounded-lg text-[11px] transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Tire Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-dark-800 border border-slate-700 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-lg text-white">Add New Tire to Catalog</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTire} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Michelin / Bridgestone"
                  value={newTire.brand}
                  onChange={e => setNewTire({ ...newTire, brand: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Primacy 4 ST"
                  value={newTire.model_name}
                  onChange={e => setNewTire({ ...newTire, model_name: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Tire Size</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 215/60 R17"
                    value={newTire.size}
                    onChange={e => setNewTire({ ...newTire, size: e.target.value })}
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="7500"
                    value={newTire.price}
                    onChange={e => setNewTire({ ...newTire, price: e.target.value })}
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Tier Category</label>
                  <select
                    value={newTire.category}
                    onChange={e => setNewTire({ ...newTire, category: e.target.value })}
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="budget">Budget</option>
                    <option value="recommended">Recommended</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={newTire.stock_count}
                    onChange={e => setNewTire({ ...newTire, stock_count: e.target.value })}
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-accent text-white font-bold rounded-xl shadow-glow-red mt-2"
              >
                Save New Tire
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
