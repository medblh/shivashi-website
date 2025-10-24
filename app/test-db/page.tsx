"use client";

import { useState, useEffect } from 'react';

export default function TestDB() {
  const [message, setMessage] = useState('Test en cours...');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    testDatabase();
  }, []);

  const testDatabase = async () => {
    try {
      const response = await fetch('/api/test-db');
      const result = await response.json();
      
      if (response.ok) {
        setMessage('✅ Base de données fonctionnelle !');
        setData(result);
      } else {
        setMessage('❌ Erreur: ' + result.error);
      }
    } catch (error) {
      setMessage('❌ Erreur de connexion: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-4">Test Base de Données</h1>
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <p className="font-semibold">{message}</p>
        </div>
        
        {data && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded">
                <strong>Utilisateurs:</strong> {data.users}
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <strong>Produits:</strong> {data.products}
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <strong>Commandes:</strong> {data.orders}
              </div>
              <div className="p-3 bg-amber-50 rounded">
                <strong>Items commande:</strong> {data.orderItems}
              </div>
            </div>
            
            {data.userDetails && (
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Utilisateur Admin:</h3>
                <pre className="text-sm">{JSON.stringify(data.userDetails, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
        
        <button 
          onClick={testDatabase}
          className="mt-4 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          Retester
        </button>
      </div>
    </div>
  );
}