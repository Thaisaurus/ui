type Node = {
  id: number;
  position: { x: number; y: number }; // 0 < x,y < 100
  similarity: number; // 0 to 1
  variant: `antonym` | `search` | `synonym`;
  word: string;
};

export type { Node };
