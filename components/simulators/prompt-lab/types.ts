// Prompt Lab 타입 정의

export type PromptTechnique =
  | 'zero-shot'
  | 'few-shot'
  | 'chain-of-thought'
  | 'role-playing'
  | 'structured-output'
  | 'self-consistency'
  | 'tree-of-thought'

export type ModelType =
  | 'gpt-4'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'gemini-pro'
  | 'llama-3'

export type TaskCategory =
  | 'text-generation'
  | 'summarization'
  | 'classification'
  | 'extraction'
  | 'translation'
  | 'code-generation'
  | 'reasoning'
  | 'creative'

export interface PromptMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface PromptExample {
  input: string
  output: string
}

export interface PromptTemplate {
  id: string
  name: string
  description: string
  technique: PromptTechnique
  category: TaskCategory
  systemPrompt: string
  userPromptTemplate: string
  examples?: PromptExample[]
  variables?: string[]
  tips?: string[]
}

export interface PromptConfig {
  model: ModelType
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
}

export interface PromptResult {
  id: string
  prompt: string
  response: string
  config: PromptConfig
  technique: PromptTechnique
  timestamp: number
  tokenCount?: {
    prompt: number
    completion: number
    total: number
  }
}

export interface PromptLabProps {
  showTechniques?: boolean
  showComparison?: boolean
  interactive?: boolean
}

// Technique colors and icons
export const techniqueStyles: Record<PromptTechnique, { color: string; icon: string; label: string }> = {
  'zero-shot': { color: 'bg-blue-100 text-blue-700', icon: '🎯', label: 'Zero-Shot' },
  'few-shot': { color: 'bg-green-100 text-green-700', icon: '📚', label: 'Few-Shot' },
  'chain-of-thought': { color: 'bg-purple-100 text-purple-700', icon: '🔗', label: 'Chain-of-Thought' },
  'role-playing': { color: 'bg-orange-100 text-orange-700', icon: '🎭', label: 'Role-Playing' },
  'structured-output': { color: 'bg-cyan-100 text-cyan-700', icon: '📋', label: 'Structured Output' },
  'self-consistency': { color: 'bg-pink-100 text-pink-700', icon: '🔄', label: 'Self-Consistency' },
  'tree-of-thought': { color: 'bg-yellow-100 text-yellow-700', icon: '🌳', label: 'Tree-of-Thought' },
}

// Model info
export const modelInfo: Record<ModelType, { provider: string; contextWindow: number; costPer1K: number }> = {
  'gpt-4': { provider: 'OpenAI', contextWindow: 8192, costPer1K: 0.03 },
  'gpt-4o': { provider: 'OpenAI', contextWindow: 128000, costPer1K: 0.005 },
  'gpt-4o-mini': { provider: 'OpenAI', contextWindow: 128000, costPer1K: 0.00015 },
  'claude-3-opus': { provider: 'Anthropic', contextWindow: 200000, costPer1K: 0.015 },
  'claude-3-sonnet': { provider: 'Anthropic', contextWindow: 200000, costPer1K: 0.003 },
  'claude-3-haiku': { provider: 'Anthropic', contextWindow: 200000, costPer1K: 0.00025 },
  'gemini-pro': { provider: 'Google', contextWindow: 32000, costPer1K: 0.00025 },
  'llama-3': { provider: 'Meta', contextWindow: 8192, costPer1K: 0.0 },
}

// Category colors
export const categoryColors: Record<TaskCategory, string> = {
  'text-generation': 'bg-blue-50 text-blue-700',
  'summarization': 'bg-green-50 text-green-700',
  'classification': 'bg-purple-50 text-purple-700',
  'extraction': 'bg-orange-50 text-orange-700',
  'translation': 'bg-cyan-50 text-cyan-700',
  'code-generation': 'bg-gray-100 text-gray-700',
  'reasoning': 'bg-pink-50 text-pink-700',
  'creative': 'bg-yellow-50 text-yellow-700',
}
