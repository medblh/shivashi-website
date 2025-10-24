export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Notre Histoire</h1>
        
        <div className="prose prose-lg">
          <p className="text-xl text-gray-600 mb-8">
            Fondée en 2010, Shivashi incarne l'excellence et l'authenticité dans 
            chaque création. Notre histoire est celle d'une passion inébranlable 
            pour l'artisanat d'exception.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Notre Mission</h2>
              <p className="text-gray-600">
                Révéler la beauté intrinsèque des matériaux nobles through 
                un savoir-faire transmis de génération en génération. 
                Chaque pièce Shivashi raconte une histoire d'exigence et de passion.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Notre Vision</h2>
              <p className="text-gray-600">
                Devenir la référence mondiale en matière de luxe authentique, 
                où tradition et innovation se rencontrent pour créer 
                des œuvres intemporelles.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Nos Valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Excellence</h3>
                <p className="text-sm text-gray-600">
                  Nous ne transigeons pas sur la qualité. Chaque détail compte.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Authenticité</h3>
                <p className="text-sm text-gray-600">
                  Des matériaux véritables, un savoir-faire réel, une histoire vraie.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-sm text-gray-600">
                  Réinventer la tradition pour créer le luxe de demain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}