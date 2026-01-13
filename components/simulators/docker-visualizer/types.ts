// Docker Visualizer 타입 정의

export type ContainerState = 'running' | 'stopped' | 'paused' | 'restarting' | 'created'

export type NetworkDriver = 'bridge' | 'host' | 'overlay' | 'none' | 'macvlan'

export type VolumeType = 'bind' | 'volume' | 'tmpfs'

export type RestartPolicy = 'no' | 'always' | 'on-failure' | 'unless-stopped'

export interface PortMapping {
  host: number
  container: number
  protocol: 'tcp' | 'udp'
}

export interface VolumeMount {
  type: VolumeType
  source: string
  target: string
  readonly?: boolean
}

export interface EnvironmentVariable {
  key: string
  value: string
  secret?: boolean
}

export interface HealthCheck {
  test: string[]
  interval: string
  timeout: string
  retries: number
  startPeriod?: string
}

export interface DockerContainer {
  id: string
  name: string
  image: string
  tag: string
  state: ContainerState
  ports: PortMapping[]
  volumes: VolumeMount[]
  environment: EnvironmentVariable[]
  networks: string[]
  dependsOn?: string[]
  command?: string
  entrypoint?: string
  restart?: RestartPolicy
  healthCheck?: HealthCheck
  cpuLimit?: string
  memoryLimit?: string
  labels?: Record<string, string>
}

export interface DockerNetwork {
  id: string
  name: string
  driver: NetworkDriver
  subnet?: string
  gateway?: string
  internal?: boolean
  attachable?: boolean
}

export interface DockerVolume {
  id: string
  name: string
  driver: string
  mountpoint?: string
  labels?: Record<string, string>
}

export interface DockerComposeConfig {
  id: string
  name: string
  description: string
  category: 'web' | 'database' | 'microservices' | 'devops' | 'ml'
  version: string
  containers: DockerContainer[]
  networks: DockerNetwork[]
  volumes: DockerVolume[]
  yaml: string
}

export interface DockerVisualizerProps {
  showYaml?: boolean
  showLogs?: boolean
  interactive?: boolean
}

// Container state colors
export const containerStateColors: Record<ContainerState, { bg: string; border: string; text: string; dot: string }> = {
  running: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-700', dot: 'bg-green-500' },
  stopped: { bg: 'bg-gray-50', border: 'border-gray-400', text: 'text-gray-700', dot: 'bg-gray-400' },
  paused: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  restarting: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700', dot: 'bg-blue-500' },
  created: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-700', dot: 'bg-purple-500' },
}

// Network driver colors
export const networkDriverColors: Record<NetworkDriver, string> = {
  bridge: 'bg-blue-100 text-blue-700',
  host: 'bg-red-100 text-red-700',
  overlay: 'bg-purple-100 text-purple-700',
  none: 'bg-gray-100 text-gray-700',
  macvlan: 'bg-orange-100 text-orange-700',
}

// Volume type icons
export const volumeTypeIcons: Record<VolumeType, string> = {
  bind: '📁',
  volume: '💾',
  tmpfs: '⚡',
}
