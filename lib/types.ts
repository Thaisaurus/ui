type Node = {
  id: number;
  position: { x: number; y: number };
  similarity: number;
  variant: `antonym` | `search` | `synonym`;
  word: string;
};

export type { Node };
