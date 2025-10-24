"use client";

import { useState, useEffect } from 'react';

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
}

interface Order {
  id: number;
  total: number;
  status: string;
  user_name: string;
}

export default function SimpleDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);


  
  const loadData = async () => {
    try {
      console.log('🔄 Chargement des données...');
      
      // Dans loadData, remettez les URLs originales :
const [statsRes, ordersRes] = await Promise.all([
  fetch('/api/admin/stats'),  // ← URL originale
  fetch('/api/admin/orders/recent')
]);

      console.log('📊 Stats response:', statsRes.status);
      console.log('🛒 Orders response:', ordersRes.status);

      if (statsRes.ok && ordersRes.ok) {
        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();
        
        console.log('✅ Données reçues:', statsData, ordersData);
        
        setStats(statsData.stats);
        setOrders(ordersData.orders);
      } else {
        console.error('❌ Erreur API:', await statsRes.text(), await ordersRes.text());
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p>Chargement des données...</p>
          <button 
            onClick={loadData}
            className="mt-4 bg-amber-600 text-white px-4 py-2 rounded"
          >
            Forcer le chargement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard Simple</h1>
        
        {stats ? (
          <>
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold">Utilisateurs</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold">Produits</h3>
                <p className="text-2xl font-bold text-green-600">{stats.totalProducts}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold">Commandes</h3>
                <p className="text-2xl font-bold text-purple-600">{stats.totalOrders}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold">Revenus</h3>
                <p className="text-2xl font-bold text-amber-600">${stats.totalRevenue}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold">Stock Faible</h3>
                <p className="text-2xl font-bold text-red-600">{stats.lowStockProducts}</p>
              </div>
            </div>

            {/* Commandes récentes */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Commandes Récentes</h2>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-4 border rounded">
                      <div>
                        <p className="font-semibold">Commande #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.user_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total}</p>
                        <span className={`px-2 py-1 text-xs rounded ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Aucune commande récente</p>
              )}
            </div>

            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800">✅ Données chargées avec succès depuis la base de données !</p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">❌ Impossible de charger les données</p>
            <button 
              onClick={loadData}
              className="bg-amber-600 text-white px-6 py-3 rounded hover:bg-amber-700"
            >
              Réessayer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}