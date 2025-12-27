// Day 6: 로컬 LLM과 RAG 통합 (sLLM)

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day6SllmRag: Day = {
  slug: 'sllm-rag',
  title: '로컬 LLM과 RAG 통합 (sLLM)',
  totalDuration: 300,
  tasks: [
    // ========================================
    // Task 1: sLLM 개요와 선택 가이드 (40분)
    // ========================================
    createVideoTask('w5d6-sllm-overview', 'sLLM 개요와 선택 가이드', 40, {
      introduction: `
## sLLM이란?

**sLLM (Small Language Model)** 또는 **Local LLM**은 로컬 환경에서 실행할 수 있는 경량화된 대규모 언어 모델입니다.

> "GPT-4의 90% 성능을 10%의 비용으로"
> — 2024년 sLLM 혁명의 핵심 메시지

## 왜 sLLM인가?

| 관점 | Cloud LLM (GPT-4, Claude) | sLLM (Llama, Mistral) |
|------|---------------------------|----------------------|
| **비용** | 토큰당 과금 ($15-60/1M) | 전기료만 (거의 무료) |
| **데이터 보안** | 외부 서버 전송 | 완전 로컬 처리 |
| **레이턴시** | 네트워크 의존 (200-500ms) | 로컬 처리 (50-100ms) |
| **커스터마이징** | 제한적 (프롬프트만) | 파인튜닝 가능 |
| **오프라인** | 불가능 | 완전 지원 |
| **성능** | 최고 수준 | 80-95% 수준 |

## 2024-2025 주요 sLLM 비교

### 범용 모델 (General Purpose)

| 모델 | 크기 | 출시 | MMLU | 한국어 | 라이선스 |
|------|------|------|------|--------|----------|
| **Llama 3.2** | 1B, 3B | 2024.09 | 66.6 | ⭐⭐ | Llama 3.2 License |
| **Llama 3.1** | 8B, 70B | 2024.07 | 73.0 | ⭐⭐⭐ | Llama 3.1 License |
| **Mistral 7B** | 7B | 2023.09 | 62.5 | ⭐⭐ | Apache 2.0 |
| **Mixtral 8x7B** | 46.7B* | 2023.12 | 70.6 | ⭐⭐⭐ | Apache 2.0 |
| **Qwen2.5** | 0.5B-72B | 2024.09 | 74.2 | ⭐⭐⭐⭐ | Qwen License |
| **Phi-3.5** | 3.8B | 2024.08 | 69.0 | ⭐⭐ | MIT |
| **Gemma 2** | 2B, 9B, 27B | 2024.06 | 71.3 | ⭐⭐⭐ | Gemma License |

> *Mixtral은 MoE(Mixture of Experts) 구조로 실제 활성 파라미터는 12.9B

### 코딩 특화 모델

| 모델 | 크기 | HumanEval | 특징 |
|------|------|-----------|------|
| **CodeLlama** | 7B, 13B, 34B | 53.7% | Meta의 코드 특화 |
| **DeepSeek Coder** | 1.3B-33B | 65.2% | 최고 수준 코드 생성 |
| **StarCoder2** | 3B, 7B, 15B | 46.3% | BigCode 프로젝트 |
| **Qwen2.5-Coder** | 1.5B-32B | 61.6% | 코드+자연어 겸용 |

### 한국어 특화 모델

| 모델 | 크기 | 한국어 벤치마크 | 특징 |
|------|------|-----------------|------|
| **SOLAR** | 10.7B | KoBEST 최상위 | 업스테이지 개발 |
| **KULLM3** | 8B | 우수 | 고려대학교 개발 |
| **Polyglot-Ko** | 1.3B-12.8B | 양호 | EleutherAI 한국어 |
| **KoAlpaca** | 5.8B, 12.8B | 양호 | Polyglot 기반 |

## 모델 선택 의사결정 트리

<svg viewBox="0 0 900 370" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto; background: #1e293b; border-radius: 12px;">
  <defs>
    <linearGradient id="blueGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#2563eb"/>
    </linearGradient>
    <linearGradient id="purpleGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6"/>
      <stop offset="100%" style="stop-color:#7c3aed"/>
    </linearGradient>
  </defs>
  <rect x="350" y="15" width="200" height="50" rx="10" fill="url(#blueGrad1)"/>
  <text x="450" y="47" text-anchor="middle" fill="white" font-size="15" font-weight="bold">어떤 용도인가요?</text>
  <path d="M 400 65 Q 400 85 150 108" stroke="#64748b" stroke-width="2" fill="none"/>
  <path d="M 450 65 L 450 108" stroke="#64748b" stroke-width="2"/>
  <path d="M 500 65 Q 500 85 750 108" stroke="#64748b" stroke-width="2" fill="none"/>
  <rect x="70" y="108" width="160" height="44" rx="8" fill="url(#purpleGrad1)"/>
  <text x="150" y="136" text-anchor="middle" fill="white" font-size="14" font-weight="bold">범용 챗봇</text>
  <rect x="370" y="108" width="160" height="44" rx="8" fill="url(#purpleGrad1)"/>
  <text x="450" y="136" text-anchor="middle" fill="white" font-size="14" font-weight="bold">코드 생성</text>
  <rect x="670" y="108" width="160" height="44" rx="8" fill="url(#purpleGrad1)"/>
  <text x="750" y="136" text-anchor="middle" fill="white" font-size="14" font-weight="bold">한국어</text>
  <path d="M 110 152 L 75 200" stroke="#64748b" stroke-width="2"/>
  <path d="M 190 152 L 220 200" stroke="#64748b" stroke-width="2"/>
  <path d="M 410 152 L 375 200" stroke="#64748b" stroke-width="2"/>
  <path d="M 490 152 L 520 200" stroke="#64748b" stroke-width="2"/>
  <path d="M 710 152 L 675 200" stroke="#64748b" stroke-width="2"/>
  <path d="M 790 152 L 820 200" stroke="#64748b" stroke-width="2"/>
  <rect x="20" y="200" width="110" height="38" rx="6" fill="#f59e0b"/>
  <text x="75" y="225" text-anchor="middle" fill="white" font-size="12" font-weight="600">GPU 없음</text>
  <rect x="165" y="200" width="110" height="38" rx="6" fill="#10b981"/>
  <text x="220" y="225" text-anchor="middle" fill="white" font-size="12" font-weight="600">GPU 있음</text>
  <rect x="320" y="200" width="110" height="38" rx="6" fill="#f59e0b"/>
  <text x="375" y="225" text-anchor="middle" fill="white" font-size="12" font-weight="600">GPU 없음</text>
  <rect x="465" y="200" width="110" height="38" rx="6" fill="#10b981"/>
  <text x="520" y="225" text-anchor="middle" fill="white" font-size="12" font-weight="600">GPU 있음</text>
  <rect x="620" y="200" width="110" height="38" rx="6" fill="#ec4899"/>
  <text x="675" y="225" text-anchor="middle" fill="white" font-size="12" font-weight="600">최고성능</text>
  <rect x="765" y="200" width="110" height="38" rx="6" fill="#06b6d4"/>
  <text x="820" y="225" text-anchor="middle" fill="white" font-size="12" font-weight="600">경량</text>
  <line x1="75" y1="238" x2="75" y2="285" stroke="#64748b" stroke-width="2"/>
  <line x1="220" y1="238" x2="220" y2="285" stroke="#64748b" stroke-width="2"/>
  <line x1="375" y1="238" x2="375" y2="285" stroke="#64748b" stroke-width="2"/>
  <line x1="520" y1="238" x2="520" y2="285" stroke="#64748b" stroke-width="2"/>
  <line x1="675" y1="238" x2="675" y2="285" stroke="#64748b" stroke-width="2"/>
  <line x1="820" y1="238" x2="820" y2="285" stroke="#64748b" stroke-width="2"/>
  <rect x="20" y="285" width="110" height="60" rx="8" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2"/>
  <text x="75" y="310" text-anchor="middle" fill="white" font-size="13" font-weight="bold">Phi-3.5</text>
  <text x="75" y="330" text-anchor="middle" fill="#93c5fd" font-size="11">3.8B</text>
  <rect x="165" y="285" width="110" height="60" rx="8" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2"/>
  <text x="220" y="310" text-anchor="middle" fill="white" font-size="13" font-weight="bold">Llama 3.1</text>
  <text x="220" y="330" text-anchor="middle" fill="#93c5fd" font-size="11">8B / 70B</text>
  <rect x="320" y="285" width="110" height="60" rx="8" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2"/>
  <text x="375" y="310" text-anchor="middle" fill="white" font-size="13" font-weight="bold">StarCoder2</text>
  <text x="375" y="330" text-anchor="middle" fill="#93c5fd" font-size="11">3B</text>
  <rect x="465" y="285" width="110" height="60" rx="8" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2"/>
  <text x="520" y="310" text-anchor="middle" fill="white" font-size="13" font-weight="bold">DeepSeek</text>
  <text x="520" y="330" text-anchor="middle" fill="#93c5fd" font-size="11">Coder</text>
  <rect x="620" y="285" width="110" height="60" rx="8" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2"/>
  <text x="675" y="310" text-anchor="middle" fill="white" font-size="13" font-weight="bold">SOLAR</text>
  <text x="675" y="330" text-anchor="middle" fill="#93c5fd" font-size="11">10.7B</text>
  <rect x="765" y="285" width="110" height="60" rx="8" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2"/>
  <text x="820" y="310" text-anchor="middle" fill="white" font-size="13" font-weight="bold">Polyglot</text>
  <text x="820" y="330" text-anchor="middle" fill="#93c5fd" font-size="11">5.8B</text>
</svg>

## FDE 관점: sLLM이 필요한 실제 시나리오

| 시나리오 | 왜 sLLM? | 추천 모델 |
|----------|----------|-----------|
| **금융 문서 RAG** | 민감 데이터 외부 전송 불가 | Llama 3.1 8B |
| **사내 코드 분석** | 소스코드 보안 | DeepSeek Coder |
| **오프라인 환경** | 인터넷 없는 환경 (공장, 선박) | Phi-3.5 (경량) |
| **비용 최적화** | 월 수천 달러 API 비용 절감 | Mistral 7B |
| **빠른 응답** | 실시간 대응 필요 | Llama 3.2 3B |

> **이번 Day의 학습 로드맵**: Task 1에서 모델 이해 → Task 2-3에서 설치 → Task 4에서 RAG 통합 → Task 5에서 프로덕션 배포
`,
      keyPoints: [
        'sLLM은 로컬에서 실행 가능한 경량 LLM',
        'Llama 3.1, Mistral, Qwen이 2024년 주요 모델',
        '용도(범용/코드/한국어)에 따라 모델 선택',
        '보안, 비용, 레이턴시가 sLLM 선택의 핵심 이유',
      ],
    }),

    // ========================================
    // Task 2: 시스템 요구사항과 GPU 이해 (50분)
    // ========================================
    createReadingTask('w5d6-system-requirements', '시스템 요구사항과 GPU 이해', 50, {
      introduction: `
## LLM 실행을 위한 하드웨어 이해

sLLM을 로컬에서 실행하려면 **GPU VRAM**이 가장 중요한 요소입니다.

### 왜 VRAM이 중요한가?

<svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto; background: #1e293b; border-radius: 12px;">
  <defs>
    <linearGradient id="memBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#2563eb"/>
    </linearGradient>
    <linearGradient id="memGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#22c55e"/>
      <stop offset="100%" style="stop-color:#16a34a"/>
    </linearGradient>
    <linearGradient id="memPurpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6"/>
      <stop offset="100%" style="stop-color:#7c3aed"/>
    </linearGradient>
  </defs>
  <text x="300" y="35" text-anchor="middle" fill="#f1f5f9" font-size="18" font-weight="bold">LLM 메모리 구조</text>
  <rect x="50" y="60" width="500" height="110" rx="8" fill="url(#memBlueGrad)" opacity="0.9"/>
  <text x="300" y="90" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="bold">Model Weights (고정)</text>
  <text x="80" y="115" fill="#e2e8f0" font-size="12">• 7B 모델 = ~14GB (FP16)</text>
  <text x="80" y="135" fill="#e2e8f0" font-size="12">• 13B 모델 = ~26GB (FP16)</text>
  <text x="80" y="155" fill="#e2e8f0" font-size="12">• 70B 모델 = ~140GB (FP16)</text>
  <text x="300" y="190" text-anchor="middle" fill="#94a3b8" font-size="24" font-weight="bold">+</text>
  <rect x="50" y="205" width="500" height="100" rx="8" fill="url(#memGreenGrad)" opacity="0.9"/>
  <text x="300" y="235" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="bold">KV Cache (동적)</text>
  <text x="80" y="260" fill="#e2e8f0" font-size="12">• Context 길이에 비례</text>
  <text x="80" y="280" fill="#e2e8f0" font-size="12">• 배치 크기에 비례  →  약 1-4GB 추가</text>
  <text x="300" y="330" text-anchor="middle" fill="#94a3b8" font-size="24" font-weight="bold">=</text>
  <rect x="50" y="345" width="500" height="60" rx="8" fill="url(#memPurpleGrad)" opacity="0.9"/>
  <text x="300" y="382" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="bold">총 필요 VRAM: 7B 모델 실행 = 약 16-18GB</text>
</svg>

### VRAM 계산 공식

\`\`\`
필요 VRAM (FP16) = 파라미터 수 × 2 bytes + 2~4GB (KV Cache, 오버헤드)

예시:
- 7B 모델: 7 × 10^9 × 2 = 14GB + 2GB = ~16GB
- 13B 모델: 13 × 10^9 × 2 = 26GB + 2GB = ~28GB
- 70B 모델: 70 × 10^9 × 2 = 140GB + 4GB = ~144GB
\`\`\`

## 양자화(Quantization)의 마법

양자화는 모델 가중치의 정밀도를 낮춰 메모리 사용량을 줄이는 기술입니다.

| 양자화 수준 | 메모리 배수 | 품질 손실 | 7B 모델 VRAM |
|-------------|-------------|-----------|--------------|
| **FP16** (기본) | 2 bytes | 없음 | 14GB |
| **INT8** | 1 byte | 최소 (~1%) | 7GB |
| **INT4** (Q4) | 0.5 bytes | 소폭 (~3%) | 3.5GB |
| **GGUF Q4_K_M** | ~0.5 bytes | 소폭 (~2%) | 4GB |
| **GGUF Q2_K** | ~0.3 bytes | 상당 (~10%) | 2GB |

> **실무 권장**: Q4_K_M이 품질/크기 균형이 가장 좋음

### GGUF 포맷 이해

**GGUF (GPT-Generated Unified Format)**는 llama.cpp에서 사용하는 양자화 포맷입니다.

\`\`\`
GGUF 파일명 규칙:
[모델명]-[크기]-[양자화].gguf

예시:
- llama-3.1-8b-instruct-q4_k_m.gguf
  └─ Llama 3.1 8B, Q4_K_M 양자화

- mistral-7b-instruct-v0.3-q8_0.gguf
  └─ Mistral 7B v0.3, INT8 양자화
\`\`\`

| GGUF 양자화 | 설명 | 권장 용도 |
|-------------|------|-----------|
| **Q2_K** | 2bit, 극단적 압축 | 테스트용 |
| **Q4_0** | 4bit, 기본 | 가벼운 실험 |
| **Q4_K_M** | 4bit, 개선됨 | **프로덕션 권장** |
| **Q5_K_M** | 5bit, 품질 우선 | 품질 중요 시 |
| **Q6_K** | 6bit, 고품질 | VRAM 여유 시 |
| **Q8_0** | 8bit, 최고 품질 | 최대 품질 필요 |
| **F16** | 16bit, 무손실 | 파인튜닝용 |

## 하드웨어별 권장 모델

### NVIDIA GPU

| GPU | VRAM | 권장 모델 | 비고 |
|-----|------|-----------|------|
| **RTX 3060** | 12GB | Llama 3.2 3B, Phi-3.5 | Q4 양자화 필수 |
| **RTX 3080** | 10GB | Mistral 7B Q4 | 배치 1개 |
| **RTX 3090** | 24GB | Llama 3.1 8B Q8 | 여유 있음 |
| **RTX 4070** | 12GB | Llama 3.2 3B, Qwen2.5 7B Q4 | 효율적 |
| **RTX 4080** | 16GB | Llama 3.1 8B Q4 | 권장 |
| **RTX 4090** | 24GB | Llama 3.1 8B Q8, 13B Q4 | 최적 |
| **A100** | 40/80GB | 70B 모델 Q4-Q8 | 서버용 |
| **H100** | 80GB | 70B 모델 F16 | 최고 성능 |

### Apple Silicon

| 칩 | 통합 메모리 | 권장 모델 | 비고 |
|----|------------|-----------|------|
| **M1** | 8-16GB | Phi-3.5 3.8B Q4 | 제한적 |
| **M1 Pro/Max** | 16-64GB | Llama 3.1 8B Q4 | 괜찮음 |
| **M2** | 8-24GB | Mistral 7B Q4 | 양호 |
| **M2 Pro/Max** | 16-96GB | Llama 3.1 8B Q8 | 좋음 |
| **M3 Pro/Max** | 18-128GB | 70B Q4 가능 | 훌륭함 |
| **M4 Pro/Max** | 24-128GB | 70B Q8 가능 | 최고 |

> Apple Silicon은 CPU와 GPU가 통합 메모리를 공유하므로 VRAM이 아닌 전체 RAM이 중요

### CPU Only (GPU 없음)

| 설정 | RAM | 권장 모델 | 성능 |
|------|-----|-----------|------|
| **최소** | 8GB | Phi-3 Mini Q4 | 매우 느림 |
| **권장** | 16GB | Llama 3.2 1B Q4 | 느림 |
| **최적** | 32GB | Llama 3.2 3B Q4 | 사용 가능 |

> CPU 전용은 추론 속도가 10-50x 느림. 개발/테스트용으로만 권장

## 클라우드 GPU 옵션

로컬 GPU가 없다면 클라우드 GPU를 고려하세요.

| 서비스 | GPU | 시간당 비용 | 특징 |
|--------|-----|-------------|------|
| **RunPod** | RTX 4090 | $0.44 | 저렴, 간편 |
| **Vast.ai** | RTX 4090 | $0.30-0.50 | 최저가 |
| **Lambda Labs** | A100 | $1.10 | 안정적 |
| **AWS (g5.xlarge)** | A10G | $1.00 | 기업용 |
| **GCP (a2-highgpu)** | A100 | $3.67 | 엔터프라이즈 |
| **Google Colab Pro** | T4/A100 | $10/월 | 학습용 |

## 실습 환경 체크리스트

\`\`\`bash
# 1. GPU 확인 (NVIDIA)
nvidia-smi

# 출력 예시:
# +-----------------------------------------------------------------------------+
# | NVIDIA-SMI 535.104.05   Driver Version: 535.104.05   CUDA Version: 12.2    |
# |-------------------------------+----------------------+----------------------+
# | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
# | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
# |===============================+======================+======================|
# |   0  NVIDIA GeForce ...  Off  | 00000000:01:00.0 Off |                  N/A |
# | 30%   35C    P8    15W / 350W |    500MiB / 24564MiB |      0%      Default |
# +-------------------------------+----------------------+----------------------+

# 2. GPU 확인 (Apple Silicon)
system_profiler SPDisplaysDataType

# 3. RAM 확인 (Linux/Mac)
free -h  # Linux
sysctl hw.memsize  # Mac

# 4. 저장공간 확인
df -h

# 모델 저장 공간 필요:
# - 7B Q4: ~4GB
# - 7B Q8: ~7GB
# - 13B Q4: ~8GB
# - 70B Q4: ~40GB
\`\`\`
`,
      keyPoints: [
        'VRAM = 파라미터 × 2 (FP16) + KV Cache',
        'Q4_K_M 양자화가 품질/크기 최적 균형',
        'RTX 4080/4090이 로컬 LLM 최적 GPU',
        'Apple Silicon은 통합 메모리로 유리',
      ],
    }),

    // ========================================
    // Task 3: Ollama 설치와 모델 관리 (45분)
    // ========================================
    createCodeTask('w5d6-ollama-setup', 'Ollama 설치와 모델 관리', 45, {
      introduction: `
## Ollama란?

**Ollama**는 로컬 LLM을 쉽게 실행할 수 있게 해주는 도구입니다.

> "Docker for LLMs" — Ollama의 핵심 컨셉

### Ollama의 장점

| 특징 | 설명 |
|------|------|
| **간편한 설치** | 한 줄 명령어로 설치 |
| **모델 관리** | \`ollama pull\`로 모델 다운로드 |
| **자동 양자화** | GGUF 자동 최적화 |
| **REST API** | OpenAI 호환 API 제공 |
| **크로스 플랫폼** | Mac, Linux, Windows 지원 |

## 설치 가이드

### macOS

\`\`\`bash
# 방법 1: 공식 인스톨러 (권장)
# https://ollama.ai/download 에서 다운로드
# → 앱 실행 시 자동으로 서버 시작됨

# 방법 2: Homebrew
brew install ollama

# 설치 확인
ollama --version
# ollama version is 0.4.x
\`\`\`

**중요: Ollama 서버 실행**

\`\`\`bash
# Homebrew로 설치한 경우 서버를 직접 시작해야 함
ollama serve

# 출력:
# Couldn't find '~/.ollama/id_ed25519'. Generating new private key.
# time=... level=INFO msg="starting llama server" ...
# time=... level=INFO msg="llama runner started" ...

# 서버가 실행되면 새 터미널에서 모델 다운로드/실행
# (서버는 계속 실행 상태 유지)
\`\`\`

> **Tip**: 공식 인스톨러(.dmg)로 설치하면 메뉴바에 Ollama 아이콘이 생기고 자동으로 서버가 실행됩니다. Homebrew 설치는 \`ollama serve\`를 수동으로 실행해야 합니다.

### Linux

\`\`\`bash
# 공식 설치 스크립트
curl -fsSL https://ollama.com/install.sh | sh

# 서비스 시작
sudo systemctl start ollama
sudo systemctl enable ollama

# 설치 확인
ollama --version
\`\`\`

### Windows

\`\`\`powershell
# 방법 1: 공식 인스톨러
# https://ollama.ai/download 에서 OllamaSetup.exe 다운로드

# 방법 2: winget
winget install Ollama.Ollama

# 설치 확인
ollama --version
\`\`\`

### Docker

\`\`\`bash
# CPU 전용
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# NVIDIA GPU 지원
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
\`\`\`

## 모델 다운로드 및 관리

### 기본 명령어

\`\`\`bash
# 모델 다운로드
ollama pull llama3.2        # Llama 3.2 3B (기본)
ollama pull llama3.1        # Llama 3.1 8B
ollama pull mistral         # Mistral 7B
ollama pull qwen2.5         # Qwen 2.5 7B
ollama pull phi3.5          # Phi-3.5 3.8B
ollama pull codellama       # CodeLlama 7B
ollama pull deepseek-coder  # DeepSeek Coder

# 특정 크기 지정
ollama pull llama3.1:70b    # 70B 버전
ollama pull qwen2.5:0.5b    # 0.5B 경량 버전

# 설치된 모델 목록
ollama list

# 출력 예시:
# NAME              ID              SIZE    MODIFIED
# llama3.2:latest   a80c4f17acd5    2.0 GB  2 days ago
# llama3.1:latest   42182419e950    4.7 GB  1 day ago
# mistral:latest    f974a74358d6    4.1 GB  3 days ago

# 모델 삭제
ollama rm llama3.2

# 모델 정보 확인
ollama show llama3.1
\`\`\`

### 모델 실행

\`\`\`bash
# 대화형 모드
ollama run llama3.1

# 출력:
# >>> 안녕하세요!
# 안녕하세요! 무엇을 도와드릴까요?

# 단일 프롬프트 실행
ollama run llama3.1 "RAG란 무엇인가요? 한국어로 간단히 설명해주세요."

# 시스템 프롬프트와 함께
ollama run llama3.1 --system "당신은 한국어 기술 문서 작성 전문가입니다."
\`\`\`

## Ollama REST API

Ollama는 기본적으로 \`http://localhost:11434\`에서 API를 제공합니다.

### API 엔드포인트

\`\`\`bash
# 1. 텍스트 생성
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.1",
  "prompt": "RAG의 핵심 개념을 설명해주세요.",
  "stream": false
}'

# 응답:
# {
#   "model": "llama3.1",
#   "response": "RAG(Retrieval-Augmented Generation)는...",
#   "done": true,
#   "total_duration": 5432123456,
#   "load_duration": 123456789,
#   "prompt_eval_count": 12,
#   "eval_count": 156
# }

# 2. 채팅 API (OpenAI 호환)
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.1",
  "messages": [
    {"role": "system", "content": "당신은 친절한 AI 어시스턴트입니다."},
    {"role": "user", "content": "RAG란?"}
  ],
  "stream": false
}'

# 3. 임베딩 생성
curl http://localhost:11434/api/embeddings -d '{
  "model": "llama3.1",
  "prompt": "RAG는 검색 증강 생성입니다."
}'

# 4. 모델 목록 조회
curl http://localhost:11434/api/tags

# 5. 모델 정보 조회
curl http://localhost:11434/api/show -d '{"name": "llama3.1"}'
\`\`\`

### OpenAI 호환 API

Ollama는 OpenAI SDK와 호환되는 엔드포인트도 제공합니다.

\`\`\`python
from openai import OpenAI

# Ollama를 OpenAI 클라이언트로 사용
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # 아무 값이나 OK
)

# 채팅 완성
response = client.chat.completions.create(
    model="llama3.1",
    messages=[
        {"role": "system", "content": "당신은 RAG 전문가입니다."},
        {"role": "user", "content": "RAG의 장점을 설명해주세요."}
    ],
    temperature=0.7,
    max_tokens=500
)

print(response.choices[0].message.content)
\`\`\`

## Python에서 Ollama 사용

### ollama 패키지

\`\`\`python
# 설치
# pip install ollama

import ollama

# 1. 기본 생성
response = ollama.generate(
    model='llama3.1',
    prompt='RAG란 무엇인가요?'
)
print(response['response'])

# 2. 채팅
response = ollama.chat(
    model='llama3.1',
    messages=[
        {'role': 'system', 'content': '당신은 AI 전문가입니다.'},
        {'role': 'user', 'content': 'sLLM의 장점은?'}
    ]
)
print(response['message']['content'])

# 3. 스트리밍
stream = ollama.chat(
    model='llama3.1',
    messages=[{'role': 'user', 'content': 'Python의 장점을 설명해주세요.'}],
    stream=True
)

for chunk in stream:
    print(chunk['message']['content'], end='', flush=True)

# 4. 임베딩
embeddings = ollama.embeddings(
    model='llama3.1',
    prompt='RAG는 검색 증강 생성입니다.'
)
print(f"임베딩 차원: {len(embeddings['embedding'])}")
\`\`\`

## 커스텀 모델 생성 (Modelfile)

Ollama는 \`Modelfile\`을 통해 커스텀 모델을 생성할 수 있습니다.

\`\`\`dockerfile
# Modelfile
FROM llama3.1

# 시스템 프롬프트 설정
SYSTEM """
당신은 FDE(Forward Deployed Engineer) 교육을 위한 AI 튜터입니다.
항상 한국어로 답변하고, 실무 중심으로 설명합니다.
코드 예제를 포함해서 설명해주세요.
"""

# 파라미터 설정
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 4096
PARAMETER stop "<|eot_id|>"

# 템플릿 커스터마이징 (선택사항)
TEMPLATE """
{{ if .System }}<|start_header_id|>system<|end_header_id|>
{{ .System }}<|eot_id|>{{ end }}{{ if .Prompt }}<|start_header_id|>user<|end_header_id|>
{{ .Prompt }}<|eot_id|>{{ end }}<|start_header_id|>assistant<|end_header_id|>
{{ .Response }}<|eot_id|>
"""
\`\`\`

\`\`\`bash
# 커스텀 모델 생성
ollama create fde-tutor -f Modelfile

# 모델 사용
ollama run fde-tutor "RAG 파이프라인을 설명해주세요."

# 모델 배포 (Ollama Hub에 푸시)
ollama push yourusername/fde-tutor
\`\`\`

## 성능 최적화 팁

\`\`\`bash
# 1. GPU 메모리 할당 확인
OLLAMA_GPU_LAYERS=35 ollama serve  # 35개 레이어를 GPU에 로드

# 2. 컨텍스트 길이 조정
# Modelfile에서:
PARAMETER num_ctx 8192  # 기본 4096 → 8192

# 3. 배치 크기 조정
PARAMETER num_batch 512  # 기본 512

# 4. 여러 모델 동시 로드 방지
# 한 번에 하나의 모델만 활성화

# 5. 모델 캐시 위치 변경 (저장공간 부족 시)
OLLAMA_MODELS=/path/to/models ollama serve
\`\`\`

## 트러블슈팅

| 문제 | 원인 | 해결책 |
|------|------|--------|
| "Out of memory" | VRAM 부족 | 더 작은 모델 또는 Q4 양자화 |
| 느린 응답 | GPU 미사용 | \`nvidia-smi\`로 GPU 확인 |
| 모델 로드 실패 | 저장공간 부족 | \`df -h\`로 확인 후 정리 |
| API 연결 실패 | Ollama 미실행 | \`ollama serve\` 실행 |
| CUDA 오류 | 드라이버 불일치 | CUDA 드라이버 업데이트 |
`,
      codeExample: `# Ollama 실습 코드

import ollama
from openai import OpenAI

# ========================================
# 1. 기본 Ollama 사용
# ========================================

def basic_ollama_usage():
    """Ollama 기본 사용법"""

    # 간단한 텍스트 생성
    response = ollama.generate(
        model='llama3.1',
        prompt='Python에서 RAG를 구현하는 방법을 간단히 설명해주세요.'
    )

    print("=== 기본 생성 ===")
    print(response['response'])
    print(f"\\n처리 시간: {response['total_duration'] / 1e9:.2f}초")
    print(f"토큰 수: {response['eval_count']}")

# ========================================
# 2. 채팅 인터페이스
# ========================================

def chat_with_ollama():
    """대화형 채팅"""

    messages = [
        {'role': 'system', 'content': '당신은 RAG 전문가입니다. 한국어로 답변합니다.'},
        {'role': 'user', 'content': 'RAG에서 chunking이 중요한 이유는?'}
    ]

    response = ollama.chat(
        model='llama3.1',
        messages=messages
    )

    print("=== 채팅 응답 ===")
    print(response['message']['content'])

# ========================================
# 3. 스트리밍 응답
# ========================================

def streaming_response():
    """스트리밍으로 실시간 출력"""

    print("=== 스트리밍 응답 ===")

    stream = ollama.chat(
        model='llama3.1',
        messages=[{'role': 'user', 'content': 'LangChain의 핵심 기능 3가지를 설명해주세요.'}],
        stream=True
    )

    for chunk in stream:
        print(chunk['message']['content'], end='', flush=True)
    print()

# ========================================
# 4. OpenAI 호환 API 사용
# ========================================

def openai_compatible_usage():
    """OpenAI SDK로 Ollama 사용"""

    client = OpenAI(
        base_url="http://localhost:11434/v1",
        api_key="ollama"
    )

    response = client.chat.completions.create(
        model="llama3.1",
        messages=[
            {"role": "system", "content": "당신은 코드 리뷰 전문가입니다."},
            {"role": "user", "content": "Python에서 타입 힌트를 사용해야 하는 이유는?"}
        ],
        temperature=0.7,
        max_tokens=500
    )

    print("=== OpenAI 호환 API ===")
    print(response.choices[0].message.content)

# ========================================
# 5. 임베딩 생성
# ========================================

def generate_embeddings():
    """텍스트 임베딩 생성"""

    texts = [
        "RAG는 검색 증강 생성입니다.",
        "벡터 데이터베이스는 임베딩을 저장합니다.",
        "LangChain은 LLM 애플리케이션 프레임워크입니다."
    ]

    print("=== 임베딩 생성 ===")

    for text in texts:
        result = ollama.embeddings(
            model='llama3.1',
            prompt=text
        )
        embedding = result['embedding']
        print(f"'{text[:30]}...' → 차원: {len(embedding)}, 첫 5값: {embedding[:5]}")

# ========================================
# 6. 모델 정보 조회
# ========================================

def check_models():
    """설치된 모델 확인"""

    print("=== 설치된 모델 ===")

    models = ollama.list()

    for model in models['models']:
        size_gb = model['size'] / (1024**3)
        print(f"- {model['name']}: {size_gb:.2f}GB")

# ========================================
# 실행
# ========================================

if __name__ == "__main__":
    # 모델 목록 확인
    check_models()
    print()

    # 기본 사용
    basic_ollama_usage()
    print()

    # 채팅
    chat_with_ollama()
    print()

    # 스트리밍
    streaming_response()
    print()

    # OpenAI 호환
    openai_compatible_usage()
    print()

    # 임베딩
    generate_embeddings()
`,
      keyPoints: [
        'Ollama는 로컬 LLM 실행을 위한 가장 쉬운 도구',
        'ollama pull로 모델 다운로드, ollama run으로 실행',
        'OpenAI 호환 API로 기존 코드 재사용 가능',
        'Modelfile로 커스텀 모델 생성 가능',
      ],
    }),

    // ========================================
    // Task 4: sLLM + RAG 통합 구현 (50분)
    // ========================================
    createCodeTask('w5d6-sllm-rag-integration', 'sLLM + RAG 통합 구현', 50, {
      introduction: `
## sLLM을 RAG에 통합하기

Day 1-5에서 배운 RAG 시스템에 sLLM을 통합합니다.

### 아키텍처 비교

<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto; background: #1e293b; border-radius: 12px;">
  <defs>
    <linearGradient id="cloudGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b"/>
      <stop offset="100%" style="stop-color:#d97706"/>
    </linearGradient>
    <linearGradient id="localGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#22c55e"/>
      <stop offset="100%" style="stop-color:#16a34a"/>
    </linearGradient>
    <linearGradient id="stepGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#2563eb"/>
    </linearGradient>
  </defs>
  <text x="200" y="35" text-anchor="middle" fill="#fbbf24" font-size="16" font-weight="bold">Cloud RAG (기존)</text>
  <text x="600" y="35" text-anchor="middle" fill="#4ade80" font-size="16" font-weight="bold">sLLM RAG (오늘)</text>
  <rect x="80" y="55" width="240" height="40" rx="6" fill="url(#stepGrad2)"/>
  <text x="200" y="82" text-anchor="middle" fill="white" font-size="14" font-weight="bold">Query</text>
  <text x="200" y="108" text-anchor="middle" fill="#64748b" font-size="16">↓</text>
  <rect x="80" y="120" width="240" height="55" rx="6" fill="url(#cloudGrad2)"/>
  <text x="200" y="143" text-anchor="middle" fill="white" font-size="13" font-weight="bold">Embedding</text>
  <text x="200" y="163" text-anchor="middle" fill="#fef3c7" font-size="11">(OpenAI API) ← 비용 발생</text>
  <text x="200" y="188" text-anchor="middle" fill="#64748b" font-size="16">↓</text>
  <rect x="80" y="200" width="240" height="55" rx="6" fill="url(#stepGrad2)"/>
  <text x="200" y="223" text-anchor="middle" fill="white" font-size="13" font-weight="bold">Vector Search</text>
  <text x="200" y="243" text-anchor="middle" fill="#bfdbfe" font-size="11">(Chroma)</text>
  <text x="200" y="268" text-anchor="middle" fill="#64748b" font-size="16">↓</text>
  <rect x="80" y="280" width="240" height="55" rx="6" fill="url(#cloudGrad2)"/>
  <text x="200" y="303" text-anchor="middle" fill="white" font-size="13" font-weight="bold">LLM Generation</text>
  <text x="200" y="323" text-anchor="middle" fill="#fef3c7" font-size="11">(GPT-4 API) ← 비용 발생</text>
  <text x="200" y="348" text-anchor="middle" fill="#64748b" font-size="16">↓</text>
  <rect x="80" y="360" width="240" height="40" rx="6" fill="url(#stepGrad2)"/>
  <text x="200" y="387" text-anchor="middle" fill="white" font-size="14" font-weight="bold">Response</text>
  <text x="200" y="430" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="bold">비용: $15-60/1M tokens</text>
  <rect x="480" y="55" width="240" height="40" rx="6" fill="url(#stepGrad2)"/>
  <text x="600" y="82" text-anchor="middle" fill="white" font-size="14" font-weight="bold">Query</text>
  <text x="600" y="108" text-anchor="middle" fill="#64748b" font-size="16">↓</text>
  <rect x="480" y="120" width="240" height="55" rx="6" fill="url(#localGrad2)"/>
  <text x="600" y="143" text-anchor="middle" fill="white" font-size="13" font-weight="bold">Embedding</text>
  <text x="600" y="163" text-anchor="middle" fill="#dcfce7" font-size="11">(Ollama Local) ← 무료</text>
  <text x="600" y="188" text-anchor="middle" fill="#64748b" font-size="16">↓</text>
  <rect x="480" y="200" width="240" height="55" rx="6" fill="url(#stepGrad2)"/>
  <text x="600" y="223" text-anchor="middle" fill="white" font-size="13" font-weight="bold">Vector Search</text>
  <text x="600" y="243" text-anchor="middle" fill="#bfdbfe" font-size="11">(Chroma)</text>
  <text x="600" y="268" text-anchor="middle" fill="#64748b" font-size="16">↓</text>
  <rect x="480" y="280" width="240" height="55" rx="6" fill="url(#localGrad2)"/>
  <text x="600" y="303" text-anchor="middle" fill="white" font-size="13" font-weight="bold">LLM Generation</text>
  <text x="600" y="323" text-anchor="middle" fill="#dcfce7" font-size="11">(Ollama Local) ← 무료</text>
  <text x="600" y="348" text-anchor="middle" fill="#64748b" font-size="16">↓</text>
  <rect x="480" y="360" width="240" height="40" rx="6" fill="url(#stepGrad2)"/>
  <text x="600" y="387" text-anchor="middle" fill="white" font-size="14" font-weight="bold">Response</text>
  <text x="600" y="430" text-anchor="middle" fill="#4ade80" font-size="13" font-weight="bold">비용: 전기료 (~$0.1/시간)</text>
  <line x1="400" y1="50" x2="400" y2="440" stroke="#475569" stroke-width="1" stroke-dasharray="5,5"/>
</svg>

## LangChain + Ollama 통합

### 기본 설정

\`\`\`python
# 필요한 패키지 설치
# pip install langchain langchain-community chromadb ollama

from langchain_community.llms import Ollama
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# Ollama LLM 설정
llm = Ollama(
    model="llama3.1",
    temperature=0.7,
    num_ctx=4096,  # 컨텍스트 길이
)

# Ollama 임베딩 설정
embeddings = OllamaEmbeddings(
    model="llama3.1",
    # 또는 임베딩 전용 모델
    # model="nomic-embed-text"
)
\`\`\`

### 문서 로드 및 청킹

\`\`\`python
from langchain_community.document_loaders import TextLoader, PyPDFLoader

# 문서 로드
loader = PyPDFLoader("documents/rag_guide.pdf")
documents = loader.load()

# 텍스트 분할
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\\n\\n", "\\n", ".", "!", "?", ",", " "]
)

chunks = text_splitter.split_documents(documents)
print(f"총 {len(chunks)}개 청크 생성")
\`\`\`

### 벡터 스토어 생성

\`\`\`python
# Chroma 벡터 스토어 생성 (Ollama 임베딩 사용)
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# Retriever 설정
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}
)
\`\`\`

### RAG 체인 구성

\`\`\`python
# 한국어 최적화 프롬프트
prompt_template = """다음 컨텍스트를 참고하여 질문에 답변해주세요.
답변할 수 없는 경우 "정보가 부족합니다"라고 말하세요.

컨텍스트:
{context}

질문: {question}

답변:"""

PROMPT = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "question"]
)

# RAG 체인 생성
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    chain_type_kwargs={"prompt": PROMPT},
    return_source_documents=True
)

# 질의 실행
result = qa_chain.invoke({"query": "RAG의 주요 컴포넌트는?"})
print(result["result"])
\`\`\`

## 성능 최적화 전략

### 1. 임베딩 캐싱

\`\`\`python
import hashlib
import json
from pathlib import Path

class CachedOllamaEmbeddings:
    """디스크 캐싱을 지원하는 Ollama 임베딩"""

    def __init__(self, model: str = "llama3.1", cache_dir: str = ".embed_cache"):
        self.model = model
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        self.embeddings = OllamaEmbeddings(model=model)

    def _get_cache_key(self, text: str) -> str:
        return hashlib.md5(f"{self.model}:{text}".encode()).hexdigest()

    def _get_cache_path(self, text: str) -> Path:
        return self.cache_dir / f"{self._get_cache_key(text)}.json"

    def embed_query(self, text: str) -> list[float]:
        cache_path = self._get_cache_path(text)

        # 캐시 확인
        if cache_path.exists():
            return json.loads(cache_path.read_text())

        # 새로 생성
        embedding = self.embeddings.embed_query(text)

        # 캐시 저장
        cache_path.write_text(json.dumps(embedding))

        return embedding

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        embeddings = []
        for text in texts:
            embeddings.append(self.embed_query(text))
        return embeddings
\`\`\`

### 2. 배치 처리

\`\`\`python
from concurrent.futures import ThreadPoolExecutor
from typing import List
import ollama

def batch_generate(prompts: List[str], model: str = "llama3.1", max_workers: int = 4):
    """여러 프롬프트를 병렬 처리"""

    def generate_single(prompt):
        response = ollama.generate(model=model, prompt=prompt)
        return response['response']

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(generate_single, prompts))

    return results

# 사용 예시
prompts = [
    "RAG란?",
    "임베딩이란?",
    "벡터 DB란?"
]

results = batch_generate(prompts)
for prompt, result in zip(prompts, results):
    print(f"Q: {prompt}\\nA: {result[:100]}...\\n")
\`\`\`

### 3. 컨텍스트 압축

\`\`\`python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

# 컨텍스트 압축기 설정
compressor = LLMChainExtractor.from_llm(llm)

# 압축 retriever 생성
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=retriever
)

# 압축된 결과로 검색
compressed_docs = compression_retriever.invoke("RAG의 장점")
for doc in compressed_docs:
    print(f"압축된 내용: {doc.page_content[:100]}...")
\`\`\`
`,
      codeExample: `# sLLM RAG 시스템 전체 구현

import os
from pathlib import Path
from typing import List, Optional
from dataclasses import dataclass
import ollama
from langchain_community.llms import Ollama
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_community.document_loaders import TextLoader, DirectoryLoader

# ========================================
# 1. 설정
# ========================================

@dataclass
class RAGConfig:
    """RAG 시스템 설정"""
    llm_model: str = "llama3.1"
    embedding_model: str = "llama3.1"
    chunk_size: int = 500
    chunk_overlap: int = 50
    num_retrieve: int = 4
    temperature: float = 0.7
    persist_directory: str = "./sllm_chroma_db"

# ========================================
# 2. sLLM RAG 시스템 클래스
# ========================================

class SLLMRagSystem:
    """로컬 LLM 기반 RAG 시스템"""

    def __init__(self, config: RAGConfig = RAGConfig()):
        self.config = config
        self.vectorstore = None
        self.qa_chain = None

        # LLM 초기화
        self.llm = Ollama(
            model=config.llm_model,
            temperature=config.temperature,
            num_ctx=4096,
        )

        # 임베딩 초기화
        self.embeddings = OllamaEmbeddings(
            model=config.embedding_model
        )

        # 텍스트 분할기
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=config.chunk_size,
            chunk_overlap=config.chunk_overlap,
            separators=["\\n\\n", "\\n", ".", "!", "?", ",", " "]
        )

        # 프롬프트 템플릿
        self.prompt = PromptTemplate(
            template=self._get_prompt_template(),
            input_variables=["context", "question"]
        )

    def _get_prompt_template(self) -> str:
        return """당신은 전문적인 AI 어시스턴트입니다.
주어진 컨텍스트를 기반으로 질문에 정확하게 답변해주세요.

## 규칙
1. 컨텍스트에 있는 정보만 사용하세요.
2. 확실하지 않으면 "정보가 부족합니다"라고 말하세요.
3. 답변은 명확하고 구조화되게 작성하세요.

## 컨텍스트
{context}

## 질문
{question}

## 답변"""

    def add_documents(self, documents: List[str], metadatas: Optional[List[dict]] = None):
        """문서를 벡터 스토어에 추가"""

        # 텍스트 분할
        from langchain.schema import Document

        docs = []
        for i, text in enumerate(documents):
            metadata = metadatas[i] if metadatas else {}
            docs.append(Document(page_content=text, metadata=metadata))

        chunks = self.text_splitter.split_documents(docs)
        print(f"총 {len(chunks)}개 청크 생성")

        # 벡터 스토어 생성/업데이트
        if self.vectorstore is None:
            self.vectorstore = Chroma.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                persist_directory=self.config.persist_directory
            )
        else:
            self.vectorstore.add_documents(chunks)

        # RAG 체인 초기화
        self._init_qa_chain()

        return len(chunks)

    def add_directory(self, directory: str, glob: str = "**/*.txt"):
        """디렉토리의 모든 문서 추가"""

        loader = DirectoryLoader(directory, glob=glob, loader_cls=TextLoader)
        documents = loader.load()

        chunks = self.text_splitter.split_documents(documents)
        print(f"{directory}에서 {len(documents)}개 문서, {len(chunks)}개 청크 로드")

        if self.vectorstore is None:
            self.vectorstore = Chroma.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                persist_directory=self.config.persist_directory
            )
        else:
            self.vectorstore.add_documents(chunks)

        self._init_qa_chain()

        return len(chunks)

    def load_existing(self):
        """기존 벡터 스토어 로드"""

        if Path(self.config.persist_directory).exists():
            self.vectorstore = Chroma(
                persist_directory=self.config.persist_directory,
                embedding_function=self.embeddings
            )
            self._init_qa_chain()
            print(f"기존 벡터 스토어 로드 완료")
            return True
        return False

    def _init_qa_chain(self):
        """QA 체인 초기화"""

        if self.vectorstore is None:
            raise ValueError("벡터 스토어가 초기화되지 않았습니다.")

        retriever = self.vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": self.config.num_retrieve}
        )

        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={"prompt": self.prompt},
            return_source_documents=True
        )

    def query(self, question: str) -> dict:
        """질문에 대한 답변 생성"""

        if self.qa_chain is None:
            raise ValueError("QA 체인이 초기화되지 않았습니다. add_documents()를 먼저 호출하세요.")

        result = self.qa_chain.invoke({"query": question})

        return {
            "answer": result["result"],
            "sources": [
                {
                    "content": doc.page_content,
                    "metadata": doc.metadata
                }
                for doc in result["source_documents"]
            ]
        }

    def query_stream(self, question: str):
        """스트리밍 답변 생성"""

        if self.vectorstore is None:
            raise ValueError("벡터 스토어가 초기화되지 않았습니다.")

        # 관련 문서 검색
        docs = self.vectorstore.similarity_search(question, k=self.config.num_retrieve)

        # 컨텍스트 구성
        context = "\\n\\n".join([doc.page_content for doc in docs])

        # 프롬프트 생성
        prompt = self.prompt.format(context=context, question=question)

        # 스트리밍 생성
        stream = ollama.generate(
            model=self.config.llm_model,
            prompt=prompt,
            stream=True
        )

        for chunk in stream:
            yield chunk['response']

    def get_stats(self) -> dict:
        """시스템 통계"""

        if self.vectorstore is None:
            return {"status": "not_initialized"}

        collection = self.vectorstore._collection
        return {
            "status": "ready",
            "model": self.config.llm_model,
            "embedding_model": self.config.embedding_model,
            "num_documents": collection.count(),
            "persist_directory": self.config.persist_directory
        }

# ========================================
# 3. 사용 예시
# ========================================

def main():
    # 시스템 초기화
    config = RAGConfig(
        llm_model="llama3.1",
        embedding_model="llama3.1",
        chunk_size=500,
        num_retrieve=4
    )

    rag = SLLMRagSystem(config)

    # 샘플 문서 추가
    sample_docs = [
        """
        RAG(Retrieval-Augmented Generation)는 검색 증강 생성 기술입니다.
        LLM의 환각(hallucination) 문제를 해결하기 위해 외부 지식을 검색하여 활용합니다.
        주요 구성요소는 Document Loader, Text Splitter, Embedding, Vector Store, Retriever, LLM입니다.
        """,
        """
        벡터 데이터베이스는 고차원 벡터를 효율적으로 저장하고 검색하는 데이터베이스입니다.
        대표적인 벡터 DB로는 Chroma, Pinecone, Weaviate, Milvus 등이 있습니다.
        유사도 검색을 위해 코사인 유사도, 유클리드 거리 등의 메트릭을 사용합니다.
        """,
        """
        청킹(Chunking)은 긴 문서를 작은 조각으로 나누는 과정입니다.
        좋은 청킹 전략은 의미 단위를 보존하면서 적절한 크기로 분할합니다.
        일반적으로 500-1000 토큰 크기가 권장되며, 오버랩을 통해 문맥을 보존합니다.
        """,
    ]

    # 문서 추가
    num_chunks = rag.add_documents(sample_docs)
    print(f"\\n{num_chunks}개 청크 인덱싱 완료\\n")

    # 통계 확인
    stats = rag.get_stats()
    print(f"시스템 통계: {stats}\\n")

    # 질의 테스트
    questions = [
        "RAG란 무엇인가요?",
        "벡터 데이터베이스의 종류는?",
        "청킹할 때 권장되는 크기는?"
    ]

    for q in questions:
        print(f"Q: {q}")
        result = rag.query(q)
        print(f"A: {result['answer'][:200]}...")
        print(f"Sources: {len(result['sources'])}개")
        print("-" * 50)

    # 스트리밍 테스트
    print("\\n=== 스트리밍 응답 ===")
    print("Q: RAG의 핵심 구성요소를 설명해주세요.")
    print("A: ", end="")
    for chunk in rag.query_stream("RAG의 핵심 구성요소를 설명해주세요."):
        print(chunk, end="", flush=True)
    print()

if __name__ == "__main__":
    main()
`,
      keyPoints: [
        'LangChain + Ollama로 완전 로컬 RAG 구현 가능',
        'OllamaEmbeddings로 임베딩도 로컬 처리',
        '임베딩 캐싱으로 중복 계산 방지',
        '스트리밍으로 사용자 경험 향상',
      ],
    }),

    // ========================================
    // Task 5: 프로덕션 배포와 최적화 (45분)
    // ========================================
    createVideoTask('w5d6-production-deployment', '프로덕션 배포와 최적화', 45, {
      introduction: `
## 프로덕션 sLLM 배포

로컬 개발에서 프로덕션으로 넘어갈 때 고려해야 할 사항들을 다룹니다.

## Docker 컨테이너화

### Ollama + RAG 서비스 Dockerfile

\`\`\`dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# 시스템 패키지 설치
RUN apt-get update && apt-get install -y \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# Ollama 설치
RUN curl -fsSL https://ollama.com/install.sh | sh

# Python 의존성
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드
COPY . .

# Ollama 서비스 시작 스크립트
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8000 11434

CMD ["/start.sh"]
\`\`\`

\`\`\`bash
# start.sh
#!/bin/bash

# Ollama 서버 시작 (백그라운드)
ollama serve &

# Ollama가 준비될 때까지 대기
sleep 5

# 모델 다운로드 (이미 있으면 스킵)
ollama pull llama3.1

# FastAPI 서버 시작
uvicorn main:app --host 0.0.0.0 --port 8000
\`\`\`

### Docker Compose (GPU 지원)

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  rag-api:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - ollama
    environment:
      - OLLAMA_HOST=http://ollama:11434
    volumes:
      - ./data:/app/data
      - chroma_data:/app/chroma_db

volumes:
  ollama_data:
  chroma_data:
\`\`\`

## FastAPI 프로덕션 서버

\`\`\`python
# main.py
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import asyncio
from contextlib import asynccontextmanager

from rag_system import SLLMRagSystem, RAGConfig

# ========================================
# 앱 설정
# ========================================

rag_system: Optional[SLLMRagSystem] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """앱 시작/종료 시 실행"""
    global rag_system

    # 시작 시: RAG 시스템 초기화
    config = RAGConfig(
        llm_model="llama3.1",
        embedding_model="llama3.1"
    )
    rag_system = SLLMRagSystem(config)

    # 기존 데이터 로드
    rag_system.load_existing()

    print("RAG 시스템 초기화 완료")

    yield

    # 종료 시: 정리 작업
    print("RAG 시스템 종료")

app = FastAPI(
    title="sLLM RAG API",
    description="로컬 LLM 기반 RAG 서비스",
    version="1.0.0",
    lifespan=lifespan
)

# ========================================
# 요청/응답 모델
# ========================================

class QueryRequest(BaseModel):
    question: str
    num_results: int = 4

class QueryResponse(BaseModel):
    answer: str
    sources: List[dict]
    model: str

class DocumentRequest(BaseModel):
    documents: List[str]
    metadatas: Optional[List[dict]] = None

class StatsResponse(BaseModel):
    status: str
    model: str
    num_documents: int

# ========================================
# API 엔드포인트
# ========================================

@app.get("/health")
async def health_check():
    """헬스 체크"""
    return {"status": "healthy", "model": rag_system.config.llm_model if rag_system else "not_loaded"}

@app.get("/stats", response_model=StatsResponse)
async def get_stats():
    """시스템 통계"""
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG 시스템 미초기화")

    stats = rag_system.get_stats()
    return StatsResponse(
        status=stats["status"],
        model=stats["model"],
        num_documents=stats.get("num_documents", 0)
    )

@app.post("/documents")
async def add_documents(request: DocumentRequest):
    """문서 추가"""
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG 시스템 미초기화")

    num_chunks = rag_system.add_documents(
        request.documents,
        request.metadatas
    )

    return {"message": f"{num_chunks}개 청크 추가됨"}

@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """질문 응답"""
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG 시스템 미초기화")

    try:
        result = rag_system.query(request.question)
        return QueryResponse(
            answer=result["answer"],
            sources=result["sources"],
            model=rag_system.config.llm_model
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query/stream")
async def query_stream(request: QueryRequest):
    """스트리밍 응답"""
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG 시스템 미초기화")

    async def generate():
        for chunk in rag_system.query_stream(request.question):
            yield chunk

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )
\`\`\`

## vLLM을 사용한 고성능 서빙

Ollama보다 높은 처리량이 필요한 경우 **vLLM**을 사용합니다.

### vLLM 설치 및 실행

\`\`\`bash
# 설치
pip install vllm

# 서버 실행
python -m vllm.entrypoints.openai.api_server \\
    --model meta-llama/Meta-Llama-3.1-8B-Instruct \\
    --port 8000 \\
    --tensor-parallel-size 1

# 또는 양자화된 모델
python -m vllm.entrypoints.openai.api_server \\
    --model TheBloke/Llama-2-7B-Chat-AWQ \\
    --quantization awq \\
    --port 8000
\`\`\`

### vLLM vs Ollama 비교

| 특징 | Ollama | vLLM |
|------|--------|------|
| **설치 난이도** | 매우 쉬움 | 보통 |
| **처리량** | 보통 | 높음 (2-5x) |
| **배치 처리** | 제한적 | 우수 |
| **메모리 효율** | 보통 | 우수 (PagedAttention) |
| **용도** | 개발/소규모 | 프로덕션/대규모 |

## 성능 모니터링

### Prometheus + Grafana 메트릭

\`\`\`python
# metrics.py
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time

# 메트릭 정의
QUERY_COUNT = Counter(
    'rag_queries_total',
    'Total RAG queries',
    ['status']
)

QUERY_LATENCY = Histogram(
    'rag_query_latency_seconds',
    'RAG query latency',
    buckets=[0.1, 0.5, 1, 2, 5, 10, 30]
)

TOKENS_GENERATED = Counter(
    'rag_tokens_generated_total',
    'Total tokens generated'
)

ACTIVE_REQUESTS = Gauge(
    'rag_active_requests',
    'Currently processing requests'
)

MODEL_LOADED = Gauge(
    'rag_model_loaded',
    'Model load status',
    ['model']
)

# 메트릭 데코레이터
def track_query(func):
    async def wrapper(*args, **kwargs):
        ACTIVE_REQUESTS.inc()
        start = time.time()

        try:
            result = await func(*args, **kwargs)
            QUERY_COUNT.labels(status='success').inc()
            return result
        except Exception as e:
            QUERY_COUNT.labels(status='error').inc()
            raise
        finally:
            QUERY_LATENCY.observe(time.time() - start)
            ACTIVE_REQUESTS.dec()

    return wrapper

# Prometheus 서버 시작 (별도 포트)
def start_metrics_server(port: int = 9090):
    start_http_server(port)
    print(f"Metrics server started on port {port}")
\`\`\`

## 비용 비교 실험

### API vs sLLM 비용 계산기

\`\`\`python
from dataclasses import dataclass
from typing import Literal

@dataclass
class CostEstimate:
    """비용 추정"""
    provider: str
    input_tokens: int
    output_tokens: int
    queries_per_day: int

    def calculate_monthly_cost(self) -> dict:
        # 토큰당 비용 ($ per 1M tokens)
        COSTS = {
            "gpt-4o": {"input": 5.0, "output": 15.0},
            "gpt-4o-mini": {"input": 0.15, "output": 0.6},
            "claude-3-5-sonnet": {"input": 3.0, "output": 15.0},
            "claude-3-5-haiku": {"input": 1.0, "output": 5.0},
            "local-llama": {"input": 0, "output": 0},  # 전기료만
        }

        if self.provider not in COSTS:
            raise ValueError(f"Unknown provider: {self.provider}")

        cost = COSTS[self.provider]

        # 일일 비용
        daily_input_cost = (self.input_tokens * self.queries_per_day / 1_000_000) * cost["input"]
        daily_output_cost = (self.output_tokens * self.queries_per_day / 1_000_000) * cost["output"]
        daily_total = daily_input_cost + daily_output_cost

        # 월간 비용 (30일)
        monthly_total = daily_total * 30

        return {
            "provider": self.provider,
            "daily_cost": round(daily_total, 2),
            "monthly_cost": round(monthly_total, 2),
            "yearly_cost": round(monthly_total * 12, 2)
        }

# 사용 예시
def compare_costs():
    """비용 비교"""

    # 시나리오: 일일 1000 쿼리, 평균 500 input + 200 output tokens
    scenarios = [
        CostEstimate("gpt-4o", 500, 200, 1000),
        CostEstimate("gpt-4o-mini", 500, 200, 1000),
        CostEstimate("claude-3-5-sonnet", 500, 200, 1000),
        CostEstimate("local-llama", 500, 200, 1000),
    ]

    print("=== 월간 비용 비교 (1000 쿼리/일) ===\\n")
    print(f"{'Provider':<20} {'Daily':<10} {'Monthly':<12} {'Yearly':<12}")
    print("-" * 54)

    for scenario in scenarios:
        cost = scenario.calculate_monthly_cost()
        print(f"{cost['provider']:<20} \${cost['daily_cost']:<9} \${cost['monthly_cost']:<11} \${cost['yearly_cost']:<11}")

    # 로컬 운영 비용 추가
    print("\\n* local-llama: 전기료 약 $10-30/월 (GPU 24시간 가동 기준)")
    print("* GPU 서버 렌탈: RTX 4090 약 $300-500/월")

if __name__ == "__main__":
    compare_costs()
\`\`\`

## 출력 예시

\`\`\`
=== 월간 비용 비교 (1000 쿼리/일) ===

Provider             Daily      Monthly      Yearly
------------------------------------------------------
gpt-4o               $6.0       $180.0       $2160.0
gpt-4o-mini          $0.16      $4.8         $57.6
claude-3-5-sonnet    $4.5       $135.0       $1620.0
local-llama          $0.0       $0.0         $0.0

* local-llama: 전기료 약 $10-30/월 (GPU 24시간 가동 기준)
* GPU 서버 렌탈: RTX 4090 약 $300-500/월
\`\`\`

> **결론**: 일일 1000 쿼리 이상이면 sLLM이 경제적. 그 이하면 gpt-4o-mini 추천.
`,
      keyPoints: [
        'Docker + Compose로 프로덕션 배포',
        'FastAPI로 REST API 서비스화',
        'vLLM은 Ollama보다 2-5x 높은 처리량',
        '일일 1000+ 쿼리시 sLLM이 경제적',
      ],
    }),

    // ========================================
    // Task 6: Day 6 종합 퀴즈 (20분)
    // ========================================
    createQuizTask('w5d6-quiz', 'Day 6 종합 퀴즈', 20, {
      introduction: `
## Day 6 학습 내용 점검

sLLM 개요, 시스템 요구사항, Ollama, RAG 통합, 프로덕션 배포에 대한 이해도를 점검합니다.
`,
      questions: [
        {
          id: 'w5d6-q1',
          question: '7B 파라미터 LLM을 FP16으로 로드할 때 필요한 VRAM은 약 얼마인가요?',
          options: [
            '7GB',
            '14GB',
            '28GB',
            '56GB'
          ],
          correctAnswer: 1,
          explanation: 'FP16은 파라미터당 2바이트를 사용합니다. 7B × 2 bytes = 14GB. 여기에 KV Cache 등을 더하면 실제로는 16-18GB 정도 필요합니다.'
        },
        {
          id: 'w5d6-q2',
          question: 'Q4_K_M 양자화의 장점으로 가장 적절한 것은?',
          options: [
            '무손실 압축으로 품질 저하가 전혀 없다',
            '메모리 사용량을 약 75% 줄이면서 품질 손실은 2-3%에 불과하다',
            '가장 빠른 추론 속도를 제공한다',
            '파인튜닝에 가장 적합하다'
          ],
          correctAnswer: 1,
          explanation: 'Q4_K_M은 4bit 양자화로 FP16 대비 약 75% 메모리 절감(14GB → ~4GB)을 달성하면서 품질 손실은 2-3% 수준입니다. 프로덕션에서 가장 많이 사용되는 양자화 레벨입니다.'
        },
        {
          id: 'w5d6-q3',
          question: 'Ollama의 특징이 아닌 것은?',
          options: [
            'OpenAI 호환 API 제공',
            'Modelfile로 커스텀 모델 생성 가능',
            '모델 파인튜닝 기능 내장',
            '자동 양자화 및 최적화'
          ],
          correctAnswer: 2,
          explanation: 'Ollama는 모델 실행과 서빙에 특화된 도구입니다. 파인튜닝은 별도의 도구(Axolotl, LLaMA-Factory 등)가 필요합니다. Ollama는 이미 학습된 모델을 로드하고 실행하는 데 최적화되어 있습니다.'
        },
        {
          id: 'w5d6-q4',
          question: 'LangChain에서 Ollama를 사용할 때 올바른 임포트는?',
          options: [
            'from langchain.llms import Ollama',
            'from langchain_community.llms import Ollama',
            'from langchain_ollama import Ollama',
            'from ollama.langchain import LLM'
          ],
          correctAnswer: 1,
          explanation: 'LangChain 0.1.x 이후로 커뮤니티 통합(community integrations)은 langchain_community 패키지에서 임포트합니다. langchain_ollama도 존재하지만 langchain_community.llms.Ollama가 더 일반적으로 사용됩니다.'
        },
        {
          id: 'w5d6-q5',
          question: 'sLLM 도입이 적합하지 않은 상황은?',
          options: [
            '금융사에서 고객 데이터를 처리하는 RAG 시스템',
            '하루 100건 미만의 간헐적 쿼리가 발생하는 내부 도구',
            '인터넷이 차단된 보안 시설의 문서 검색 시스템',
            '월 수천 달러의 API 비용이 발생하는 서비스'
          ],
          correctAnswer: 1,
          explanation: '하루 100건 미만의 쿼리라면 gpt-4o-mini 기준 월 $5 미만의 비용이 발생합니다. GPU 서버 운영 비용(전기료, 관리)이 더 높을 수 있어 Cloud API가 더 경제적입니다. 반면 금융사(보안), 오프라인 환경, 대량 쿼리는 sLLM이 적합합니다.'
        },
        {
          id: 'w5d6-q6',
          question: 'vLLM의 PagedAttention이 제공하는 주요 이점은?',
          options: [
            '모델 학습 속도 향상',
            'KV Cache 메모리 효율화로 처리량 증가',
            '모델 압축률 향상',
            '네트워크 지연 감소'
          ],
          correctAnswer: 1,
          explanation: 'PagedAttention은 KV Cache를 페이지 단위로 관리하여 메모리 단편화를 줄이고, 동적으로 할당/해제합니다. 이를 통해 같은 GPU 메모리로 더 많은 동시 요청을 처리할 수 있어 처리량이 2-5배 향상됩니다.'
        },
        {
          id: 'w5d6-q7',
          question: 'Apple Silicon M3 Max (128GB)에서 실행 가능한 가장 큰 모델은?',
          options: [
            'Llama 3.1 8B Q8',
            'Llama 3.1 13B Q4',
            'Llama 3.1 70B Q4',
            'Llama 3.1 70B Q8'
          ],
          correctAnswer: 2,
          explanation: '70B 모델은 Q4 양자화시 약 40GB가 필요합니다. M3 Max 128GB는 통합 메모리를 사용하므로 70B Q4 모델을 충분히 로드할 수 있습니다. Q8은 약 70GB가 필요하여 다른 프로세스와 함께 사용시 부족할 수 있습니다.'
        },
        {
          id: 'w5d6-q8',
          question: '다음 중 한국어 성능이 가장 우수한 모델은?',
          options: [
            'Phi-3.5',
            'Mistral 7B',
            'SOLAR 10.7B',
            'CodeLlama 7B'
          ],
          correctAnswer: 2,
          explanation: 'SOLAR는 업스테이지(Upstage)에서 개발한 한국어 특화 모델로, KoBEST 벤치마크에서 최상위 성능을 보여줍니다. Phi-3.5, Mistral, CodeLlama는 영어 중심으로 학습되어 한국어 성능이 상대적으로 떨어집니다.'
        },
      ],
      keyPoints: [
        'VRAM 계산: 파라미터 × 2(FP16) + 오버헤드',
        'Q4_K_M이 프로덕션 최적 양자화',
        'Ollama는 실행/서빙, 파인튜닝은 별도 도구',
        '일일 쿼리 수에 따라 API vs sLLM 선택',
      ],
    }),

    // ========================================
    // Challenge: 하이브리드 RAG 시스템 (50분)
    // ========================================
    createChallengeTask('w5d6-challenge', '하이브리드 RAG 시스템 구축', 50, {
      introduction: `
## Challenge: Cloud + sLLM 하이브리드 RAG

실제 프로덕션에서는 Cloud LLM과 sLLM을 상황에 따라 혼합 사용합니다.

### 시나리오

당신은 FDE로서 다음 요구사항을 가진 RAG 시스템을 설계해야 합니다:

1. **기본 쿼리**: sLLM (비용 절감)
2. **복잡한 쿼리**: Cloud LLM (높은 품질)
3. **민감 데이터**: sLLM만 사용 (보안)

### 구현 요구사항

\`\`\`python
class HybridRAGSystem:
    """하이브리드 RAG 시스템"""

    def __init__(self):
        # TODO: sLLM (Ollama) 초기화
        # TODO: Cloud LLM (OpenAI 또는 Anthropic) 초기화
        # TODO: 벡터 스토어 초기화
        pass

    def classify_query(self, query: str) -> str:
        """쿼리 복잡도 분류

        Returns:
            - "simple": 단순 검색/요약 → sLLM
            - "complex": 분석/추론/생성 → Cloud LLM
            - "sensitive": 민감 데이터 관련 → sLLM only
        """
        # TODO: 구현
        pass

    def route_query(self, query: str, force_local: bool = False) -> dict:
        """쿼리 라우팅 및 실행

        Args:
            query: 사용자 질문
            force_local: True면 항상 sLLM 사용

        Returns:
            {
                "answer": str,
                "model_used": str,
                "reason": str,
                "cost": float
            }
        """
        # TODO: 구현
        pass
\`\`\`

### 평가 기준

| 항목 | 배점 |
|------|------|
| 쿼리 분류 정확도 | 30점 |
| 라우팅 로직 구현 | 30점 |
| 비용 추적 기능 | 20점 |
| 에러 핸들링 | 10점 |
| 코드 품질 | 10점 |

### 테스트 케이스

\`\`\`python
# 테스트 쿼리
test_queries = [
    # Simple → sLLM
    ("RAG란 무엇인가요?", "simple"),
    ("이 문서를 요약해주세요", "simple"),

    # Complex → Cloud
    ("이 세 문서의 공통점과 차이점을 분석하고, 각각의 장단점을 비교해주세요", "complex"),
    ("이 데이터를 바탕으로 다음 분기 매출을 예측해주세요", "complex"),

    # Sensitive → sLLM only
    ("고객 김철수의 계좌 잔액은?", "sensitive"),
    ("환자 ID 12345의 진단 결과", "sensitive"),
]
\`\`\`

### 보너스 과제

1. **Fallback 메커니즘**: Cloud LLM 실패 시 자동으로 sLLM으로 전환
2. **비용 대시보드**: 일별/주별 비용 추적 및 시각화
3. **A/B 테스트**: 같은 쿼리를 양쪽으로 보내 품질 비교
`,
      hints: [
        '쿼리 복잡도는 키워드 기반 규칙 또는 sLLM으로 분류 가능',
        'force_local은 민감 데이터 처리 시 필수',
        '비용 추적은 토큰 수 × 단가로 계산',
        'try-except로 Cloud LLM 실패 시 sLLM fallback 구현',
      ],
      keyPoints: [
        '실무에서는 하이브리드 접근이 최적',
        '쿼리 복잡도에 따른 라우팅이 핵심',
        '민감 데이터는 항상 로컬 처리',
        '비용 추적으로 ROI 검증',
      ],
    }),
  ],
}
