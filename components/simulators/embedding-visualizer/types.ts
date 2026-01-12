// Embedding Visualizer Types

export interface EmbeddingPoint {
  id: string
  text: string
  category: string
  // Original high-dimensional embedding (simplified to 3D for visualization)
  coordinates: {
    x: number
    y: number
    z: number
  }
  // Optional metadata
  metadata?: Record<string, string | number>
}

export interface EmbeddingDataset {
  name: string
  description: string
  points: EmbeddingPoint[]
  categories: string[]
}

export interface SimilarityResult {
  source: string
  target: string
  similarity: number
}

export type DimensionReductionMethod = 'pca' | 'tsne' | 'umap'

export interface VisualizerConfig {
  method: DimensionReductionMethod
  perplexity?: number // for t-SNE
  neighbors?: number  // for UMAP
  showLabels: boolean
  pointSize: number
  highlightSimilar: boolean
}
