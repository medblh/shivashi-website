"use client";

import { useState, useEffect } from 'react';
import AdminGuard from '@/components/AdminGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  TrendingUp,
  AlertCircle,
  Plus,
  Eye,
  LogOut,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
}

interface RecentOrder {
  id: number;
  user_id: number;
  total: number;
  status: string;
  created_at: string;
  user_name: string;
  shipping_address: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDashboardData = async () => {
  try {
    setIsRefreshing(true);
    
    // Appel API pour récupérer les vraies statistiques
    const [statsResponse, ordersResponse] = await Promise.all([
      fetch('/api/admin/stats'),
      fetch('/api/admin/orders/recent')
    ]);
    
    let statsData = { stats: {
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      lowStockProducts: 0
    }};
    let ordersData = { orders: [] };

    if (statsResponse.ok) {
      statsData = await statsResponse.json();
    } else {
      console.log('Stats API non disponible, utilisation des données par défaut');
    }

    if (ordersResponse.ok) {
      ordersData = await ordersResponse.json();
    } else {
      console.log('Orders API non disponible, utilisation des données par défaut');
    }
    
    setStats(statsData.stats);
    setRecentOrders(ordersData.orders);
    
  } catch (error) {
    console.log('Erreur de chargement des données:', error);
    // Données par défaut en cas d'erreur
    setStats({
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      lowStockProducts: 0
    });
    setRecentOrders([]);
  } finally {
    setIsLoadingData(false);
    setIsRefreshing(false);
  }
};

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
                <p className="text-gray-600 mt-2">Bienvenue, {user?.name}</p>
              </div>
              <div className="flex space-x-4">
                <Button 
                  onClick={handleRefresh}
                  variant="outline"
                  disabled={isRefreshing}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Actualiser</span>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir le Site
                  </Link>
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {isLoadingData ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <>
              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-gray-600">Utilisateurs inscrits</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                    <p className="text-xs text-gray-600">Commandes totales</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                    <DollarSign className="h-4 w-4 text-amber-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-gray-600">Revenus totaux</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Produits</CardTitle>
                    <Package className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalProducts}</div>
                    <p className="text-xs text-gray-600">Produits en stock</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stock Faible</CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${stats.lowStockProducts > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {stats.lowStockProducts}
                    </div>
                    <p className="text-xs text-gray-600">Produits à réapprovisionner</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Commandes récentes */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Commandes Récentes
                    </CardTitle>
                    <span className="text-sm text-gray-500">{recentOrders.length} commande(s)</span>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                          <div key={order.id} className="flex justify-between items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <p className="font-semibold text-gray-900">Commande #{order.id}</p>
                                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                  {order.status === 'completed' ? 'Complétée' : 
                                   order.status === 'pending' ? 'En attente' :
                                   order.status === 'shipped' ? 'Expédiée' :
                                   order.status === 'cancelled' ? 'Annulée' : order.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{order.user_name}</p>
                              <p className="text-xs text-gray-500 truncate" title={order.shipping_address}>
                                {order.shipping_address}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(order.created_at)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-amber-600">${order.total}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Aucune commande récente</p>
                          <p className="text-sm text-gray-500 mt-2">Les nouvelles commandes apparaîtront ici</p>
                        </div>
                      )}
                    </div>
                    <Button asChild variant="outline" className="w-full mt-4">
                      <Link href="/admin/orders">
                        Voir toutes les commandes
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Actions rapides */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Actions Rapides
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button asChild className="w-full justify-start bg-amber-600 hover:bg-amber-700 text-white">
                        <Link href="/admin/products/new">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un Produit
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/admin/products">
                          <Package className="h-4 w-4 mr-2" />
                          Gérer les Produits
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/admin/orders">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Gérer les Commandes
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/admin/users">
                          <Users className="h-4 w-4 mr-2" />
                          Gérer les Utilisateurs
                        </Link>
                      </Button>
                    </div>

                    {/* Informations système */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Informations Système</h4>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>🟢 Base de données connectée</p>
                        <p>📊 Données en temps réel</p>
                        <p>🛡️ Session admin active</p>
                        <p>🔄 Dernière actualisation: {new Date().toLocaleTimeString('fr-FR')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Message de bienvenue avec état */}
              <Card className="mt-8 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-amber-800 mb-2">
                      {stats.totalOrders > 0 ? '📈 Votre boutique est active !' : '👋 Bienvenue dans votre espace administrateur'}
                    </h3>
                    <p className="text-amber-700">
                      {stats.totalOrders > 0 
                        ? `Vous avez ${stats.totalOrders} commandes et $${stats.totalRevenue} de revenus. Continuez comme ça !`
                        : 'Gérez facilement votre boutique Shivashi depuis ce dashboard. Ajoutez vos premiers produits pour commencer.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      // Ajoutez cette section dans le return, avant la fermeture du AdminGuard
<div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
  <h4 className="font-semibold text-blue-800 mb-2">État de la Base de Données</h4>
  <div className="text-sm text-blue-700 space-y-1">
    <p>• Utilisateurs: {stats.totalUsers}</p>
    <p>• Produits: {stats.totalProducts}</p>
    <p>• Commandes: {stats.totalOrders}</p>
    <p>• Revenus: ${stats.totalRevenue}</p>
    <p>• Stock faible: {stats.lowStockProducts}</p>
  </div>
  <Button asChild variant="outline" size="sm" className="mt-2">
    <Link href="/admin/debug">
      Voir les données brutes ›
    </Link>
  </Button>
</div>
    </AdminGuard>
  );
}