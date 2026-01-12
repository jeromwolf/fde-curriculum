'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { EmbeddingDataset, EmbeddingPoint } from './types'

interface Props {
  dataset: EmbeddingDataset
  onPointClick?: (point: EmbeddingPoint) => void
  highlightCategory?: string
  showLabels?: boolean
  pointSize?: number
}

// 카테고리별 색상
const categoryColors: Record<string, number> = {
  '동물': 0xff6b6b,
  '음식': 0x4ecdc4,
  '국가': 0x45b7d1,
  '직업': 0x96ceb4,
  '감정': 0xffeaa7,
  '기술': 0xa29bfe,
  '스포츠': 0x74b9ff,
  '여행': 0x00b894,
  '음악': 0xfd79a8,
  '왕': 0xfdcb6e,
  '여왕': 0xe84393,
  '남자': 0x0984e3,
  '여자': 0xd63031,
}

const defaultColor = 0x6c5ce7

export default function EmbeddingVisualizer3D({
  dataset,
  onPointClick,
  highlightCategory,
  showLabels = true,
  pointSize = 0.15
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedPoint, setSelectedPoint] = useState<EmbeddingPoint | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene 설정
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf8f9fa)

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.set(5, 5, 5)

    // Renderer 설정
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    // OrbitControls (드래그로 회전)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 10)
    scene.add(directionalLight)

    // 축 표시
    const axesHelper = new THREE.AxesHelper(3)
    scene.add(axesHelper)

    // 그리드
    const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xeeeeee)
    scene.add(gridHelper)

    // 포인트들 저장 (클릭 감지용)
    const pointMeshes: { mesh: THREE.Mesh; point: EmbeddingPoint }[] = []

    // 포인트 생성
    dataset.points.forEach((point) => {
      const geometry = new THREE.SphereGeometry(pointSize, 32, 32)
      const color = categoryColors[point.category] || defaultColor

      // 하이라이트 처리
      const isHighlighted = !highlightCategory || point.category === highlightCategory
      const opacity = isHighlighted ? 1 : 0.3

      const material = new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity,
        metalness: 0.3,
        roughness: 0.7
      })

      const sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(
        point.coordinates.x,
        point.coordinates.y,
        point.coordinates.z
      )
      scene.add(sphere)

      pointMeshes.push({ mesh: sphere, point })
    })

    // 라벨 생성 (CSS2DRenderer 대신 스프라이트 사용)
    if (showLabels) {
      const loader = new THREE.TextureLoader()
      dataset.points.forEach((point) => {
        // 캔버스로 텍스트 텍스처 생성
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.width = 256
        canvas.height = 64
        context.fillStyle = 'rgba(255, 255, 255, 0.9)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.font = 'bold 24px Arial'
        context.fillStyle = '#333'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText(point.text, canvas.width / 2, canvas.height / 2)

        const texture = new THREE.CanvasTexture(canvas)
        const spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: (!highlightCategory || point.category === highlightCategory) ? 1 : 0.3
        })
        const sprite = new THREE.Sprite(spriteMaterial)
        sprite.position.set(
          point.coordinates.x,
          point.coordinates.y + 0.3,
          point.coordinates.z
        )
        sprite.scale.set(1, 0.25, 1)
        scene.add(sprite)
      })
    }

    // Raycaster (클릭 감지)
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const meshes = pointMeshes.map(p => p.mesh)
      const intersects = raycaster.intersectObjects(meshes)

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object
        const found = pointMeshes.find(p => p.mesh === clickedMesh)
        if (found) {
          setSelectedPoint(found.point)
          onPointClick?.(found.point)
        }
      }
    }

    container.addEventListener('click', onMouseClick)

    // 애니메이션 루프
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // 리사이즈 핸들러
    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('click', onMouseClick)
      container.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [dataset, highlightCategory, showLabels, pointSize, onPointClick])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {/* 선택된 포인트 정보 */}
      {selectedPoint && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
          <h4 className="font-bold text-lg">{selectedPoint.text}</h4>
          <div className="text-sm text-gray-600 mt-2 space-y-1">
            <p>카테고리: <span className="font-medium">{selectedPoint.category}</span></p>
            <p>좌표: ({selectedPoint.coordinates.x.toFixed(2)}, {selectedPoint.coordinates.y.toFixed(2)}, {selectedPoint.coordinates.z.toFixed(2)})</p>
            {selectedPoint.metadata && (
              <p className="text-indigo-600 text-xs mt-2">
                {JSON.stringify(selectedPoint.metadata)}
              </p>
            )}
          </div>
          <button
            onClick={() => setSelectedPoint(null)}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600"
          >
            닫기
          </button>
        </div>
      )}

      {/* 조작 안내 */}
      <div className="absolute bottom-4 left-4 bg-white/80 px-3 py-2 rounded text-xs text-gray-600">
        <p>🖱️ 드래그: 회전 | 스크롤: 줌 | 클릭: 선택</p>
      </div>
    </div>
  )
}
