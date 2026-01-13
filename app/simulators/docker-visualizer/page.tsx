'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const DockerVisualizer = dynamic(
  () => import('@/components/simulators/docker-visualizer').then(mod => ({ default: mod.DockerVisualizer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Docker Visualizer 로딩 중...</p>
        </div>
      </div>
    )
  }
)

export default function DockerVisualizerPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 네비게이션 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전 페이지로 돌아가기
          </button>
        </div>

        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Phase 4</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Cloud & Infra</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Docker</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Docker Visualizer</h1>
              <p className="text-blue-100">
                Docker Compose 설정을 시각적으로 탐색하세요.
                컨테이너, 네트워크, 볼륨 구조와 의존성을 한눈에 파악할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 학습 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🐳</div>
            <h3 className="font-semibold text-gray-900">Containers</h3>
            <p className="text-sm text-gray-600">
              이미지, 포트, 환경변수 설정
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🌐</div>
            <h3 className="font-semibold text-gray-900">Networks</h3>
            <p className="text-sm text-gray-600">
              bridge, overlay, internal
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">💾</div>
            <h3 className="font-semibold text-gray-900">Volumes</h3>
            <p className="text-sm text-gray-600">
              bind mount, named volume
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="font-semibold text-gray-900">Dependencies</h3>
            <p className="text-sm text-gray-600">
              depends_on, health check
            </p>
          </div>
        </div>

        {/* 메인 Docker Visualizer */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" style={{ minHeight: '600px' }}>
          <DockerVisualizer showYaml={true} interactive={true} />
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 Docker Compose란?
            </h3>
            <p className="text-gray-700 text-sm">
              <strong>Docker Compose</strong>는 다중 컨테이너 Docker 애플리케이션을 정의하고 실행하기 위한 도구입니다.
              YAML 파일로 서비스, 네트워크, 볼륨을 설정하고, 단일 명령으로 전체 스택을 관리할 수 있습니다.
            </p>
          </div>

          <div className="bg-cyan-50 rounded-xl p-6">
            <h3 className="font-semibold text-cyan-900 mb-2">
              🎯 FDE 커리큘럼 연계
            </h3>
            <p className="text-gray-700 text-sm">
              이 시뮬레이터는 FDE Academy Phase 4 "클라우드 & 인프라" 과정의 실습 도구입니다.
              Docker를 활용한 컨테이너화와 마이크로서비스 아키텍처를 학습합니다.
            </p>
          </div>
        </div>

        {/* Sample Stacks */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">🎮 샘플 스택</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">Web</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Web Application Stack</h4>
              <p className="text-xs text-gray-600">Next.js + PostgreSQL + Redis + Nginx</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-medium">MSA</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Microservices</h4>
              <p className="text-xs text-gray-600">API Gateway + Services + RabbitMQ</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded font-medium">ML</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">ML Pipeline</h4>
              <p className="text-xs text-gray-600">Jupyter + MLflow + MinIO</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">Classic</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">LAMP Stack</h4>
              <p className="text-xs text-gray-600">Apache + MySQL + PHP</p>
            </div>
          </div>
        </div>

        {/* Network Types */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">🌐 Network Drivers</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">bridge</span>
              </div>
              <p className="text-xs text-gray-600">기본 네트워크, 동일 호스트 통신</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded font-medium">host</span>
              </div>
              <p className="text-xs text-gray-600">호스트 네트워크 직접 사용</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-medium">overlay</span>
              </div>
              <p className="text-xs text-gray-600">다중 호스트 (Swarm)</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-medium">none</span>
              </div>
              <p className="text-xs text-gray-600">네트워크 비활성화</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded font-medium">macvlan</span>
              </div>
              <p className="text-xs text-gray-600">물리 네트워크 직접 연결</p>
            </div>
          </div>
        </div>

        {/* Volume Types */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">💾 Volume Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📁</span>
                <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">bind mount</code>
              </div>
              <p className="text-xs text-gray-600">호스트 파일시스템 경로를 컨테이너에 마운트. 개발 환경에 적합.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💾</span>
                <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">named volume</code>
              </div>
              <p className="text-xs text-gray-600">Docker가 관리하는 볼륨. 데이터 영속성, 프로덕션에 적합.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚡</span>
                <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">tmpfs</code>
              </div>
              <p className="text-xs text-gray-600">메모리에만 저장. 임시 데이터, 민감한 정보에 적합.</p>
            </div>
          </div>
        </div>

        {/* 다음 단계 */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">다음 학습</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              이전 학습으로 돌아가기
            </button>
            <Link
              href="/curriculum"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition"
            >
              전체 커리큘럼 보기
            </Link>
            <Link
              href="/simulators/airflow-dag"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition"
            >
              Airflow DAG →
            </Link>
            <Link
              href="/simulators/dbt-lineage"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition"
            >
              dbt Lineage →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
