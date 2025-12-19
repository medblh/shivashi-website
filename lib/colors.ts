// lib/colors.ts
export const colorMap: { [key: string]: string } = {
  // Couleurs de base
  'black': '#000000',
  'white': '#FFFFFF',
  'gray': '#808080',
  'grey': '#808080',
  
  // Couleurs primaires
  'red': '#FF0000',
  'blue': '#0000FF',
  'green': '#008000',
  'yellow': '#FFFF00',
  'orange': '#FFA500',
  'purple': '#800080',
  'pink': '#FFC0CB',
  'brown': '#A52A2A',
  
  // Couleurs spécifiques
  'navy': '#000080',
  'royal blue': '#4169E1',
  'sky blue': '#87CEEB',
  'light blue': '#ADD8E6',
  'dark blue': '#00008B',
  'forest green': '#228B22',
  'lime green': '#32CD32',
  'olive': '#808000',
  'teal': '#008080',
  'cyan': '#00FFFF',
  'magenta': '#FF00FF',
  'lavender': '#E6E6FA',
  'violet': '#EE82EE',
  'maroon': '#800000',
  'beige': '#F5F5DC',
  'cream': '#FFFDD0',
  'gold': '#FFD700',
  'silver': '#C0C0C0',
  'bronze': '#CD7F32',
  'ivory' : '#FFFFF0',
  'soft pink' : '#FDB0C0',
  'camel beige' : '#C7AA82',
  'chocolate brown': '#7B3F00',
  
  // Couleurs en français
  'noir': '#000000',
  'blanc': '#FFFFFF',
  'rouge': '#FF0000',
  'bleu': '#0000FF',
  'vert': '#008000',
  'jaune': '#FFFF00',
  'rose': '#FFC0CB',
  'marron': '#A52A2A',
  'gris': '#808080',
  'burgundy': '#800020',
  // Couleurs spécifiques de vos produits (sans duplication)
  // 'yellow', 'white', 'gray', 'red' sont déjà définis plus haut
};

// Fonction utilitaire pour obtenir la couleur hexadécimale
export function getColorHex(colorName: string): string {
  const normalizedColor = colorName.toLowerCase().trim();
  return colorMap[normalizedColor] || '#CCCCCC'; // Couleur par défaut si non trouvée
}

// Fonction pour déterminer si la couleur est claire ou foncée (pour la bordure)
export function isLightColor(hexColor: string): boolean {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness > 128;
}