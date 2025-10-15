const adjectives = [
  "Rápido", "Furioso", "Valiente", "Curioso", "Travieso", "Brillante", "Simpático", "Astuto", "Feliz", "Aventurero", "Intrépido", "Leal", "Sabio", "Veloz", "Feroz"
];

const animals = [
  "Tigre", "Zorro", "Elefante", "Lobo", "Pingüino", "Águila", "Delfín", "Canguro", "Oso", "Jirafa", "Cocodrilo", "Mono", "Tortuga", "Serpiente", "Rinoceronte"
];

export function generateRandomUsername(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj}${animal}`;
}
