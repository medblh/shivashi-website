import { NextRequest, NextResponse } from 'next/server';
import { getChartData } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('📈 API Chart Data appelée');
    
    // Vérification auth (à adapter)
    const session = { isAuth: true, userId: 1, userRole: 'admin' };
    
    if (!session.isAuth || session.userRole !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const chartData = await getChartData();
    return NextResponse.json(chartData);
  } catch (error) {
    console.error('❌ Erreur API Chart Data:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données graphiques' },
      { status: 500 }
    );
  }
}