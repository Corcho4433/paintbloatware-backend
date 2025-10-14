const adjectives = [
  "Rápido", "Furioso", "Valiente", "Curioso", "Travieso", "Brillante"
];

const animals = [
  "Tigre", "Zorro", "Elefante", "Lobo", "Pingüino", "Águila"
];

export function generateRandomUsername(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj}${animal}`;
}
