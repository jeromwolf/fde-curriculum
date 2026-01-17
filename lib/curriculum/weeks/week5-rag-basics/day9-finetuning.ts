// Day 9: LLM Fine-tuning (QLoRA 실습)

import type { Day } from '../../types'
import {
  createVideoTask,
  createReadingTask,
  createCodeTask,
  createQuizTask,
  createChallengeTask,
} from './types'

export const day9Finetuning: Day = {
  slug: 'finetuning',
  title: 'LLM Fine-tuning (QLoRA 실습)',
  totalDuration: 300,
  tasks: [
    // ========================================
    // Task 1: Fine-tuning 이해 (40분)
    // ========================================
    createReadingTask('w5d9-finetuning-overview', 'Fine-tuning 이해: 언제, 왜 필요한가', 40, {
      introduction: `
## Fine-tuning이란?

Fine-tuning은 사전 학습된 LLM을 특정 도메인/태스크에 맞게 **추가 학습**하는 기법입니다.

> "모델이 지식을 '학습'하여 검색 없이 바로 답변"

---

## RAG vs Fine-tuning 비교

### RAG (우리가 배운 것)

\`\`\`
[문서] → 검색 → [관련 내용] → LLM → 답변

특징:
✅ 빠른 적용 (몇 시간)
✅ 문서 업데이트 쉬움
✅ 비용 저렴
❌ 매번 검색 필요
❌ 모델 자체는 변하지 않음
\`\`\`

### Fine-tuning (오늘 배울 것)

\`\`\`
[데이터] → 학습 → [새로운 모델] → 답변

특징:
✅ 모델이 지식을 "학습"
✅ 검색 없이 바로 답변
✅ 일관된 스타일/톤
❌ 학습 시간 필요
❌ 업데이트 시 재학습
\`\`\`

---

## 언제 뭘 써야 하나?

### RAG 추천

\`\`\`
✅ 문서가 자주 업데이트됨
✅ 출처 표시가 중요함
✅ 빠른 구축이 필요함
✅ 최신 정보가 중요함

예: 뉴스 검색, 실시간 정보
\`\`\`

### Fine-tuning 추천

\`\`\`
✅ 일관된 스타일/톤 필요
✅ 특정 도메인 전문성
✅ 검색 없이 빠른 응답
✅ 모델 크기 줄이기 (작은 모델로 성능 up)

예: 고객 상담 봇, 전문 어시스턴트
\`\`\`

### 최적 조합: RAG + Fine-tuning

\`\`\`
Fine-tuned 모델 + RAG
= 도메인 지식 + 최신 문서
= 최강 조합! 💪
\`\`\`

---

## Fine-tuning 방식 비교

### 1. Full Fine-tuning

\`\`\`
전체 파라미터 학습

Qwen3-1.7B: 1.7B 파라미터 전체 학습
- 비용: 💰💰💰💰💰
- 시간: ⏱️⏱️⏱️⏱️⏱️
- GPU: 40GB+ VRAM 필요
\`\`\`

### 2. LoRA (Low-Rank Adaptation)

\`\`\`
일부 파라미터만 학습 (1~5%)

원본 모델은 그대로 + Adapter 추가
- 비용: 💰💰
- 시간: ⏱️⏱️
- GPU: 16GB VRAM
\`\`\`

### 3. QLoRA (Quantized LoRA) ⭐ 오늘 사용

\`\`\`
양자화 + LoRA

4bit 양자화로 메모리 절약
- 비용: 💰
- 시간: ⏱️
- GPU: 8GB VRAM (또는 Colab 무료)
\`\`\`

---

## QLoRA 작동 원리

### 개념

\`\`\`
[원본 모델 - 16bit]
       ↓ 양자화
[양자화 모델 - 4bit] (고정, 학습 안함)
       +
[LoRA Adapter] (이것만 학습!)
       ↓
[결과 모델]
\`\`\`

### 메모리 비교

| 방식 | Qwen3-1.7B VRAM |
|------|-----------------|
| Full Fine-tuning | ~14GB |
| LoRA | ~8GB |
| **QLoRA** | **~4GB** |

### 성능

\`\`\`
Full Fine-tuning: 100% (기준)
LoRA:             ~98%
QLoRA:            ~95%

→ 5% 성능 손실로 75% 메모리 절약!
\`\`\`

---

## 비용/시간 예상

### Qwen3-1.7B QLoRA 기준

| 항목 | 로컬 (RTX 4090) | Colab (무료) |
|------|-----------------|--------------|
| VRAM | 4~6GB 사용 | 15GB (T4) |
| 학습 시간 | 30분~1시간 | 1~2시간 |
| 비용 | 전기세만 | 무료 |

### 데이터 규모별

| 데이터 수 | 학습 시간 | 권장 epoch |
|-----------|-----------|------------|
| 100개 | 10분 | 3-5 |
| 500개 | 30분 | 2-3 |
| 1,000개 | 1시간 | 1-2 |
| 5,000개 | 3시간 | 1 |
      `,
      keyPoints: [
        'RAG: 검색 기반, 빠른 적용, 문서 업데이트 쉬움',
        'Fine-tuning: 모델 학습, 일관된 스타일, 검색 불필요',
        'QLoRA: 4bit 양자화 + LoRA로 8GB GPU에서 학습 가능',
        '최적 조합: Fine-tuned 모델 + RAG',
      ],
    }),

    // ========================================
    // Task 2: 학습 데이터 준비 (35분)
    // ========================================
    createCodeTask('w5d9-data-preparation', '학습 데이터 준비: Instruction Format', 35, {
      introduction: `
## 학습 데이터 형식

Fine-tuning에서 가장 중요한 것은 **고품질 학습 데이터**입니다.

---

## Instruction Format

### 기본 구조

\`\`\`json
{
  "instruction": "질문 또는 지시",
  "input": "추가 컨텍스트 (선택)",
  "output": "원하는 답변"
}
\`\`\`

### 실제 예시 (연말정산)

\`\`\`json
{
  "instruction": "자녀세액공제 금액을 알려주세요.",
  "input": "",
  "output": "자녀세액공제 금액은 다음과 같습니다:\\n- 1명: 25만원\\n- 2명: 55만원 (25만원 + 30만원)\\n- 3명 이상: 55만원 + 30만원 × (자녀수-2)"
}
\`\`\`

---

## 데이터 수집 4가지 방법

### 방법 1: 수동 작성 (권장 시작점)

\`\`\`python
data = [
    {
        "instruction": "연말정산이 뭔가요?",
        "input": "",
        "output": "연말정산은 근로자가 1년간 납부한 소득세를..."
    },
    {
        "instruction": "신용카드 소득공제 한도는?",
        "input": "",
        "output": "신용카드 소득공제 한도는 연간 300만원입니다..."
    },
    # ... 최소 50~100개 권장
]
\`\`\`

### 방법 2: RAG 답변 활용

\`\`\`python
# 기존 RAG로 답변 생성 → 검수 → 학습 데이터
questions = ["자녀세액공제란?", "의료비 공제 한도는?", ...]

for q in questions:
    answer = rag_chatbot(q)  # RAG로 답변 생성
    # 사람이 검수 후 저장
    data.append({"instruction": q, "output": answer})
\`\`\`

### 방법 3: GPT/Claude로 생성

\`\`\`python
prompt = """
연말정산 관련 Q&A 데이터를 생성해주세요.

형식:
Q: [질문]
A: [상세한 답변]

주제: 자녀세액공제

5개 생성해주세요.
"""

# 생성 후 검수 필수!
\`\`\`

### 방법 4: 기존 FAQ 활용

\`\`\`
국세청 FAQ, 회사 내부 Q&A 등
→ 정제 후 학습 데이터로 변환
\`\`\`

### ⚠️ 주의사항

- 반드시 사람이 검수!
- 잘못된 정보 = 잘못 학습
- 다양한 표현 포함 (같은 질문, 다른 표현)

---

## 데이터셋 예시 (JSON)

\`\`\`json
// tax_qa_dataset.json
[
  {
    "instruction": "자녀세액공제 금액이 얼마인가요?",
    "input": "",
    "output": "자녀세액공제 금액은 다음과 같습니다:\\n\\n1. 기본 공제\\n- 자녀 1명: 25만원\\n- 자녀 2명: 55만원\\n- 자녀 3명 이상: 55만원 + 30만원 × (자녀수-2)\\n\\n2. 출산·입양 공제\\n- 첫째: 30만원\\n- 둘째: 50만원\\n- 셋째 이상: 70만원"
  },
  {
    "instruction": "신용카드 소득공제 받으려면 얼마나 써야 하나요?",
    "input": "",
    "output": "신용카드 소득공제를 받으려면 총급여의 25%를 초과하여 사용해야 합니다.\\n\\n예시:\\n- 연봉 4,000만원인 경우\\n- 최소 사용액: 1,000만원 (25%)\\n- 1,000만원 초과분부터 공제 적용\\n\\n공제율:\\n- 신용카드: 15%\\n- 체크카드/현금영수증: 30%\\n- 전통시장/대중교통: 40%"
  },
  {
    "instruction": "의료비 세액공제 대상은 누구인가요?",
    "input": "",
    "output": "의료비 세액공제 대상은 다음과 같습니다:\\n\\n1. 본인\\n2. 배우자\\n3. 부양가족 (나이/소득 제한 없음)\\n\\n공제율: 15%\\n\\n한도:\\n- 본인, 65세 이상, 장애인: 한도 없음\\n- 그 외: 연 700만원"
  }
]
\`\`\`

---

## 데이터 품질 체크리스트

### ✅ 좋은 데이터

\`\`\`
- 명확한 질문과 답변
- 구체적인 수치 포함
- 일관된 답변 스타일
- 다양한 질문 표현
- 실제 사용 사례 반영
\`\`\`

### ❌ 나쁜 데이터

\`\`\`
- 모호한 답변 ("상황에 따라 다릅니다")
- 오래된 정보 (2024년 이전 기준)
- 중복 데이터
- 너무 짧은 답변
- 오류가 있는 정보
\`\`\`

### 권장 데이터 수

| 목적 | 최소 | 권장 |
|------|------|------|
| 테스트/학습 | 50개 | 100개 |
| 실무 적용 | 200개 | 500개+ |
| 고품질 모델 | 1,000개 | 5,000개+ |

---

## HuggingFace Datasets 로드

\`\`\`python
from datasets import Dataset
import json

# JSON 로드
with open("tax_qa_dataset.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Dataset 변환
dataset = Dataset.from_list(data)

# 확인
print(dataset)
# Dataset({
#     features: ['instruction', 'input', 'output'],
#     num_rows: 100
# })

# Train/Test 분할
dataset = dataset.train_test_split(test_size=0.1)
print(f"Train: {len(dataset['train'])}, Test: {len(dataset['test'])}")
\`\`\`
      `,
      keyPoints: [
        'Instruction Format: instruction + input + output',
        '데이터 수집: 수동 작성, RAG 활용, GPT 생성, FAQ',
        '품질 > 수량: 100개 고품질 데이터가 1000개 저품질보다 나음',
        '반드시 사람이 검수: 잘못된 정보 = 잘못된 학습',
      ],
      practiceGoal: '자신의 도메인에 맞는 학습 데이터셋을 설계하고 수집할 수 있다',
    }),

    // ========================================
    // Task 3: QLoRA 실습 (50분)
    // ========================================
    createCodeTask('w5d9-qlora-training', 'QLoRA 실습: 4bit 양자화 학습', 50, {
      introduction: `
## 환경 선택

### 옵션 1: 로컬 GPU

\`\`\`
필요 사양:
- NVIDIA GPU (RTX 3060 이상)
- VRAM 8GB 이상
- RAM 16GB 이상

장점: 자유로운 실험
단점: 초기 투자 필요
\`\`\`

### 옵션 2: Google Colab (무료) ⭐ 추천

\`\`\`
제공 사양:
- T4 GPU (15GB VRAM)
- RAM 12GB

장점: 무료, 바로 시작
단점: 시간 제한, 세션 끊김

설정: 런타임 > 런타임 유형 변경 > T4 GPU
\`\`\`

---

## 패키지 설치

\`\`\`bash
pip install transformers datasets peft accelerate bitsandbytes trl
\`\`\`

| 패키지 | 용도 | 크기 |
|--------|------|------|
| **transformers** | 모델 로드/학습 | ~50MB |
| **datasets** | 데이터셋 처리 | ~20MB |
| **peft** | LoRA/QLoRA | ~5MB |
| **accelerate** | 학습 가속 | ~10MB |
| **bitsandbytes** | 양자화 | ~20MB |
| **trl** | 학습 트레이너 | ~10MB |

---

## Step 1: 모델 로드 (4bit 양자화)

\`\`\`python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

# 양자화 설정
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,                    # 4bit 양자화
    bnb_4bit_quant_type="nf4",            # 양자화 타입
    bnb_4bit_compute_dtype=torch.bfloat16 # 연산 타입
)

# 모델 로드
model_name = "Qwen/Qwen3-1.7B"

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=bnb_config,
    device_map="auto",
    trust_remote_code=True
)

tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

print(f"모델 로드 완료: {model_name}")
\`\`\`

---

## Step 2: LoRA 설정

\`\`\`python
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

# 모델 준비 (양자화된 모델용)
model = prepare_model_for_kbit_training(model)

# LoRA 설정
lora_config = LoraConfig(
    r=16,                    # LoRA rank (클수록 성능↑, 메모리↑)
    lora_alpha=32,           # LoRA alpha
    lora_dropout=0.05,       # Dropout
    bias="none",             # Bias 학습 여부
    task_type="CAUSAL_LM",   # 태스크 타입
    target_modules=[         # 적용할 레이어
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ]
)

# LoRA 적용
model = get_peft_model(model, lora_config)

# 학습 가능 파라미터 확인
model.print_trainable_parameters()
# trainable params: 13,631,488 || all params: 1,777,565,696
# trainable%: 0.77%  ← 1% 미만만 학습!
\`\`\`

---

## Step 3: 프롬프트 포맷

\`\`\`python
def format_prompt(example):
    """학습 데이터를 프롬프트 형식으로 변환"""

    if example['input']:
        prompt = f"""### 지시:
{example['instruction']}

### 입력:
{example['input']}

### 답변:
{example['output']}"""
    else:
        prompt = f"""### 지시:
{example['instruction']}

### 답변:
{example['output']}"""

    return {"text": prompt}

# 데이터셋에 적용
formatted_dataset = dataset.map(format_prompt)

# 확인
print(formatted_dataset['train'][0]['text'])
\`\`\`

---

## Step 4: 학습 설정

\`\`\`python
from transformers import TrainingArguments

training_args = TrainingArguments(
    output_dir="./tax-qwen-lora",      # 저장 경로
    num_train_epochs=3,                 # 에폭 수
    per_device_train_batch_size=4,      # 배치 크기
    gradient_accumulation_steps=4,      # 그래디언트 누적
    learning_rate=2e-4,                 # 학습률
    warmup_steps=100,                   # 웜업
    logging_steps=10,                   # 로깅 주기
    save_strategy="epoch",              # 저장 전략
    fp16=True,                          # 혼합 정밀도
    optim="paged_adamw_8bit",          # 옵티마이저
    report_to="none",                   # 리포트 (wandb 등)
)
\`\`\`

---

## Step 5: 학습 실행

\`\`\`python
from trl import SFTTrainer

trainer = SFTTrainer(
    model=model,
    train_dataset=formatted_dataset["train"],
    eval_dataset=formatted_dataset["test"],
    tokenizer=tokenizer,
    args=training_args,
    dataset_text_field="text",
    max_seq_length=1024,
    packing=False,
)

# 학습 시작!
print("🚀 학습 시작...")
trainer.train()
print("✅ 학습 완료!")
\`\`\`

### 학습 로그 예시

\`\`\`
Step 10/300: loss=2.45
Step 20/300: loss=1.89
Step 30/300: loss=1.52
...
Step 300/300: loss=0.78

Training completed! ✅
\`\`\`

---

## Step 6: 모델 저장

\`\`\`python
# LoRA 가중치만 저장 (수십 MB)
model.save_pretrained("./tax-qwen-lora")
tokenizer.save_pretrained("./tax-qwen-lora")

print("모델 저장 완료!")
# ./tax-qwen-lora/
# ├── adapter_config.json
# ├── adapter_model.safetensors  ← ~50MB
# └── tokenizer files
\`\`\`

### 전체 모델로 병합 (선택)

\`\`\`python
from peft import PeftModel

# 병합된 모델 생성
merged_model = model.merge_and_unload()

# 저장
merged_model.save_pretrained("./tax-qwen-merged")
# 크기: ~3.4GB (전체 모델)
\`\`\`
      `,
      keyPoints: [
        'BitsAndBytesConfig: 4bit 양자화로 메모리 절약',
        'LoraConfig: r=16, target_modules로 학습 대상 지정',
        'SFTTrainer: Supervised Fine-Tuning 전용 트레이너',
        '학습 파라미터 1% 미만으로 전체 모델 성능 95% 달성',
      ],
      practiceGoal: 'QLoRA로 직접 모델을 Fine-tuning하고 저장할 수 있다',
    }),

    // ========================================
    // Task 4: 학습된 모델 테스트 (25분)
    // ========================================
    createCodeTask('w5d9-model-testing', '학습된 모델 테스트와 평가', 25, {
      introduction: `
## 추론 테스트

### 답변 생성 함수

\`\`\`python
def generate_answer(instruction, model, tokenizer):
    """Fine-tuned 모델로 답변 생성"""
    prompt = f"""### 지시:
{instruction}

### 답변:
"""

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    outputs = model.generate(
        **inputs,
        max_new_tokens=256,
        temperature=0.7,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )

    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response.split("### 답변:")[-1].strip()

# 테스트
question = "자녀세액공제 금액이 얼마인가요?"
answer = generate_answer(question, model, tokenizer)
print(answer)
\`\`\`

---

## 학습 전후 비교

### Before (기본 Qwen3-1.7B)

\`\`\`
Q: 자녀세액공제 금액이 얼마인가요?

A: 자녀세액공제에 대해 설명드리겠습니다.
   세액공제는 납부할 세금에서 직접 차감되는...
   (일반적인 설명, 구체적 금액 없음)
\`\`\`

### After (Fine-tuned)

\`\`\`
Q: 자녀세액공제 금액이 얼마인가요?

A: 자녀세액공제 금액은 다음과 같습니다:

   1. 기본 공제
   - 자녀 1명: 25만원
   - 자녀 2명: 55만원
   - 자녀 3명 이상: 55만원 + 30만원 × (자녀수-2)

   2. 출산·입양 공제
   - 첫째: 30만원
   - 둘째: 50만원
   - 셋째 이상: 70만원

   (학습된 정확한 정보!)
\`\`\`

---

## 정량적 평가

### 테스트 세트로 평가

\`\`\`python
from rouge_score import rouge_scorer

scorer = rouge_scorer.RougeScorer(['rouge1', 'rougeL'], use_stemmer=True)

results = []
for example in test_dataset:
    prediction = generate_answer(example['instruction'], model, tokenizer)
    reference = example['output']

    scores = scorer.score(reference, prediction)
    results.append({
        'rouge1': scores['rouge1'].fmeasure,
        'rougeL': scores['rougeL'].fmeasure
    })

avg_rouge1 = sum(r['rouge1'] for r in results) / len(results)
avg_rougeL = sum(r['rougeL'] for r in results) / len(results)

print(f"ROUGE-1: {avg_rouge1:.3f}")
print(f"ROUGE-L: {avg_rougeL:.3f}")
\`\`\`

### 성능 비교표

| 지표 | 기본 모델 | Fine-tuned |
|------|----------|------------|
| 정확도 | 72% | **89%** |
| 답변 일관성 | 65% | **92%** |
| 응답 속도 | 1.2초 | 1.1초 |
| ROUGE-1 | 0.45 | **0.78** |
| ROUGE-L | 0.38 | **0.72** |
      `,
      keyPoints: [
        'generate() 함수로 Fine-tuned 모델 추론',
        '학습 전후 비교로 개선 효과 확인',
        'ROUGE 점수로 정량적 평가',
        'Fine-tuning 후 정확도 17% 향상 가능',
      ],
      practiceGoal: 'Fine-tuned 모델의 성능을 테스트하고 정량적으로 평가할 수 있다',
    }),

    // ========================================
    // Task 5: Fine-tuned + RAG 통합 (40분)
    // ========================================
    createCodeTask('w5d9-finetuned-rag', 'Fine-tuned 모델 + RAG 통합', 40, {
      introduction: `
## 왜 Fine-tuned + RAG인가?

### Fine-tuning만

\`\`\`
✅ 학습된 내용 빠른 답변
❌ 학습 안 된 내용 답변 불가
❌ 최신 정보 반영 어려움
\`\`\`

### RAG만

\`\`\`
✅ 문서 기반 답변
❌ 일반적인 LLM 사용
❌ 도메인 지식 부족
\`\`\`

### Fine-tuned + RAG ⭐

\`\`\`
✅ 도메인 전문 지식 (Fine-tuning)
✅ 최신 문서 검색 (RAG)
✅ 정확하고 일관된 답변
= 최강 조합!
\`\`\`

---

## Ollama에 커스텀 모델 등록

### Step 1: GGUF 변환

\`\`\`bash
# llama.cpp 도구 사용
python convert_hf_to_gguf.py ./tax-qwen-merged \\
    --outfile tax-qwen.gguf \\
    --outtype q4_k_m
\`\`\`

### Step 2: Modelfile 작성

\`\`\`dockerfile
# Modelfile
FROM ./tax-qwen.gguf

TEMPLATE """{{ .Prompt }}"""

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER stop "### 지시:"

SYSTEM """당신은 연말정산 전문 상담사입니다.
정확하고 친절하게 답변해주세요."""
\`\`\`

### Step 3: Ollama에 등록

\`\`\`bash
ollama create tax-qwen -f Modelfile
ollama list  # tax-qwen 확인
\`\`\`

---

## RAG에 적용

### 모델 교체 (한 줄만 변경!)

\`\`\`python
from langchain_community.llms import Ollama

# Before (일반 모델)
# MODEL_NAME = "qwen2.5:7b"

# After (커스텀 모델!)
MODEL_NAME = "tax-qwen"

# 나머지 RAG 코드는 동일
llm = Ollama(model=MODEL_NAME)
\`\`\`

### 전체 RAG 파이프라인

\`\`\`python
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OllamaEmbeddings

# 임베딩 & 벡터스토어
embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)

# Fine-tuned 모델로 RAG 체인
llm = Ollama(model="tax-qwen")  # 커스텀 모델!

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
)

# 질문
response = qa_chain.invoke("2024년 자녀세액공제 변경사항은?")
print(response)
\`\`\`

---

## 하이브리드 전략

### 상황별 모델 선택

\`\`\`python
def get_model(question: str):
    """질문에 따라 모델 선택"""

    # 세금 관련 → 커스텀 모델
    tax_keywords = ["공제", "세액", "연말정산", "세금", "소득"]
    if any(kw in question for kw in tax_keywords):
        return Ollama(model="tax-qwen")

    # 일반 질문 → 범용 모델
    return Ollama(model="qwen2.5:7b")

# 사용
llm = get_model(user_question)
response = qa_chain.invoke(user_question)
\`\`\`

### 앙상블 (고급)

\`\`\`python
def ensemble_answer(question: str):
    """두 모델의 답변을 종합"""

    # 두 모델로 답변 생성
    custom_llm = Ollama(model="tax-qwen")
    general_llm = Ollama(model="qwen2.5:7b")

    answer1 = custom_llm.invoke(question)
    answer2 = general_llm.invoke(question)

    # 종합 프롬프트
    combine_prompt = f"""
두 AI의 답변을 검토하고 가장 정확한 답변을 작성하세요.

답변 1: {answer1}
답변 2: {answer2}

종합 답변:
"""

    return general_llm.invoke(combine_prompt)
\`\`\`
      `,
      keyPoints: [
        'Fine-tuned + RAG = 도메인 지식 + 최신 문서',
        'GGUF 변환 → Modelfile → Ollama 등록',
        '기존 RAG 코드에서 모델명만 변경하면 끝',
        '하이브리드 전략: 질문별 최적 모델 선택',
      ],
      practiceGoal: 'Fine-tuned 모델을 Ollama에 등록하고 RAG 파이프라인에 통합할 수 있다',
    }),

    // ========================================
    // Task 6: HuggingFace 배포 (35분)
    // ========================================
    createCodeTask('w5d9-huggingface-deploy', 'HuggingFace Hub 배포와 공유', 35, {
      introduction: `
## HuggingFace Hub 소개

HuggingFace Hub는 **모델 공유 플랫폼**으로, 전 세계 개발자들이 모델을 업로드하고 공유합니다.

> "내가 만든 Fine-tuned 모델을 세상과 공유!"

---

## 계정 준비

### 1. 회원가입

\`\`\`
https://huggingface.co/join
\`\`\`

### 2. Access Token 발급

\`\`\`
Settings > Access Tokens > New token
- Name: tax-qwen-upload
- Type: Write
\`\`\`

### 3. 로그인

\`\`\`python
from huggingface_hub import login

login(token="hf_your_token_here")
# 또는 CLI: huggingface-cli login
\`\`\`

---

## 모델 업로드

### LoRA Adapter 업로드

\`\`\`python
from huggingface_hub import HfApi

api = HfApi()

# 레포지토리 생성
api.create_repo(
    repo_id="your-username/tax-qwen-lora",
    repo_type="model",
    private=False  # 공개 여부
)

# 업로드
api.upload_folder(
    folder_path="./tax-qwen-lora",
    repo_id="your-username/tax-qwen-lora",
    repo_type="model"
)

print("업로드 완료!")
print("https://huggingface.co/your-username/tax-qwen-lora")
\`\`\`

---

## Model Card 작성

### README.md (필수!)

\`\`\`markdown
---
license: apache-2.0
language:
- ko
library_name: peft
base_model: Qwen/Qwen3-1.7B
tags:
- tax
- korean
- lora
- qlora
---

# Tax-Qwen-LoRA 🇰🇷

연말정산 전문 한국어 LLM (QLoRA Fine-tuned)

## 모델 설명

Qwen3-1.7B를 연말정산 Q&A 데이터로 QLoRA 파인튜닝한 모델입니다.

## 사용법

\\\`\\\`\\\`python
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer

base_model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen3-1.7B")
model = PeftModel.from_pretrained(base_model, "your-username/tax-qwen-lora")
\\\`\\\`\\\`

## 학습 데이터

- 연말정산 Q&A 500개
- 출처: 국세청 자료 기반

## 성능

| 지표 | 점수 |
|------|------|
| 정확도 | 89% |
| 일관성 | 92% |

## 라이선스

Apache 2.0 (상업적 사용 가능)
\`\`\`

---

## 다른 사람이 사용하기

### 사용 방법 안내

\`\`\`python
# 1. 패키지 설치
# pip install transformers peft accelerate

# 2. 모델 로드
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer

base_model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen3-1.7B",
    device_map="auto"
)
model = PeftModel.from_pretrained(
    base_model,
    "your-username/tax-qwen-lora"
)
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen3-1.7B")

# 3. 사용
prompt = "### 지시:\\n자녀세액공제 금액?\\n\\n### 답변:\\n"
inputs = tokenizer(prompt, return_tensors="pt")
outputs = model.generate(**inputs, max_new_tokens=200)
print(tokenizer.decode(outputs[0]))
\`\`\`

---

## 라이선스 고려사항

### 베이스 모델 라이선스 확인

\`\`\`
Qwen3: Apache 2.0 ✅
- 상업적 사용 가능
- 수정/배포 가능
- 저작권 표시 필요
\`\`\`

### 내 모델 라이선스 선택

| 라이선스 | 상업적 사용 | 설명 |
|----------|------------|------|
| Apache 2.0 | ✅ 가능 | 가장 널리 사용 |
| MIT | ✅ 가능 | 가장 자유로움 |
| CC-BY-NC | ❌ 불가 | 비상업적만 허용 |

### ⚠️ 주의사항

\`\`\`
⚠️ 학습 데이터 저작권 확인
⚠️ 민감한 정보 포함 여부
⚠️ 베이스 모델 라이선스 준수
\`\`\`
      `,
      keyPoints: [
        'HuggingFace Hub: 모델 공유 플랫폼',
        'Access Token (Write)으로 업로드 권한',
        'Model Card: README.md로 모델 설명 필수',
        '라이선스: 베이스 모델 + 학습 데이터 저작권 확인',
      ],
      practiceGoal: 'Fine-tuned 모델을 HuggingFace Hub에 업로드하고 공유할 수 있다',
    }),

    // ========================================
    // Task 7: 트러블슈팅 & 퀴즈 (25분)
    // ========================================
    createQuizTask('w5d9-troubleshooting-quiz', 'Fine-tuning 트러블슈팅 & 퀴즈', 25, {
      introduction: `
## 자주 발생하는 문제와 해결법

### 1. CUDA Out of Memory

\`\`\`
❌ 오류: CUDA out of memory

✅ 해결:
1. batch_size 줄이기: 4 → 2 → 1
2. gradient_accumulation 늘리기
3. max_seq_length 줄이기: 1024 → 512
4. gradient_checkpointing=True
\`\`\`

### 2. 학습이 안 됨 (loss 안 줄어듦)

\`\`\`
❌ 문제: loss가 계속 높음

✅ 해결:
1. learning_rate 조정: 2e-4 → 1e-4
2. 데이터 형식 확인
3. 토크나이저 설정 확인
\`\`\`

### 3. Colab 세션 끊김

\`\`\`
❌ 문제: 중간에 연결 끊김

✅ 해결:
1. Google Drive 마운트
   from google.colab import drive
   drive.mount('/content/drive')

2. 체크포인트 저장
   save_strategy="steps"
   save_steps=100
\`\`\`

### 4. 과적합 (Overfitting)

\`\`\`
❌ 문제: Train loss는 낮은데 Test loss가 높음

✅ 해결:
1. LoRA rank 낮추기 (r=8)
2. Dropout 높이기 (0.1)
3. Epoch 줄이기 (1-2)
4. 데이터 다양성 늘리기
\`\`\`

---

## 전체 파이프라인 정리

\`\`\`
[1. 데이터 준비]
    │
    ▼ Instruction Format JSON
    │
[2. 모델 로드]
    │
    ▼ BitsAndBytesConfig (4bit)
    │
[3. LoRA 설정]
    │
    ▼ LoraConfig + get_peft_model
    │
[4. 학습]
    │
    ▼ SFTTrainer.train()
    │
[5. 저장]
    │
    ▼ model.save_pretrained()
    │
[6. 테스트]
    │
    ▼ generate_answer()
    │
[7. RAG 통합]
    │
    ▼ Ollama 등록 또는 직접 사용
    │
[8. 배포]
    │
    ▼ HuggingFace Hub
\`\`\`
      `,
      questions: [
        {
          id: 'w5d9-q1',
          question: 'QLoRA에서 "Q"는 무엇을 의미하나요?',
          options: [
            'Quality (품질)',
            'Quantized (양자화)',
            'Quick (빠른)',
            'Query (쿼리)',
          ],
          correctAnswer: 1,
          explanation: 'QLoRA의 Q는 Quantized(양자화)를 의미합니다. 4bit 양자화로 메모리를 절약하면서 LoRA를 적용합니다.',
        },
        {
          id: 'w5d9-q2',
          question: 'Fine-tuning 학습 데이터의 Instruction Format에 포함되지 않는 것은?',
          options: [
            'instruction (지시)',
            'input (입력)',
            'output (출력)',
            'context (문맥)',
          ],
          correctAnswer: 3,
          explanation: 'Instruction Format은 instruction, input, output 세 가지로 구성됩니다. context는 RAG에서 사용하는 개념입니다.',
        },
        {
          id: 'w5d9-q3',
          question: 'QLoRA로 Qwen3-1.7B를 Fine-tuning할 때 필요한 최소 VRAM은?',
          options: [
            '2GB',
            '4GB',
            '8GB',
            '16GB',
          ],
          correctAnswer: 1,
          explanation: 'QLoRA는 4bit 양자화로 약 4GB VRAM만으로 1.7B 모델을 Fine-tuning할 수 있습니다.',
        },
        {
          id: 'w5d9-q4',
          question: 'LoRA에서 r (rank) 값을 높이면 어떻게 되나요?',
          options: [
            '메모리 사용량 감소, 성능 향상',
            '메모리 사용량 증가, 성능 향상',
            '메모리 사용량 감소, 성능 저하',
            '학습 속도만 빨라짐',
          ],
          correctAnswer: 1,
          explanation: 'LoRA rank를 높이면 학습 가능한 파라미터가 늘어나 성능이 향상되지만, 메모리 사용량도 증가합니다.',
        },
        {
          id: 'w5d9-q5',
          question: 'Fine-tuned 모델 + RAG 조합의 장점이 아닌 것은?',
          options: [
            '도메인 전문 지식 보유',
            '최신 문서 검색 가능',
            '학습 데이터 없이도 작동',
            '일관된 답변 스타일',
          ],
          correctAnswer: 2,
          explanation: 'Fine-tuned 모델은 반드시 학습 데이터가 필요합니다. RAG + Fine-tuning 조합의 장점은 도메인 지식과 최신 정보를 모두 활용할 수 있다는 점입니다.',
        },
      ],
    }),

    // ========================================
    // Task 8: 실습 챌린지 (50분)
    // ========================================
    createChallengeTask('w5d9-finetuning-challenge', '나만의 도메인 모델 Fine-tuning', 50, {
      introduction: `
## 🎯 실습 목표

자신만의 도메인(업무, 취미, 전문 분야)에 맞는 **Fine-tuned LLM**을 만들어보세요!

---

## 📋 과제 체크리스트

### Part 1: 데이터 준비 (20분)

- [ ] 도메인 선택 (예: 요리, 법률, 의료, 게임, 프로그래밍)
- [ ] 최소 50개 Q&A 데이터 작성
- [ ] Instruction Format JSON 파일 생성
- [ ] 품질 체크 (명확한 질문/답변, 일관된 스타일)

### Part 2: QLoRA 학습 (15분)

- [ ] Google Colab 환경 설정 (T4 GPU)
- [ ] 모델 로드 (4bit 양자화)
- [ ] LoRA 설정 및 적용
- [ ] 학습 실행 (1-3 epoch)

### Part 3: 테스트 & 평가 (10분)

- [ ] 학습 전후 비교 (동일 질문)
- [ ] 최소 5개 질문으로 테스트
- [ ] 개선점 기록

### Part 4: (선택) 공유 (5분)

- [ ] HuggingFace Hub 업로드
- [ ] Model Card 작성
- [ ] 링크 공유

---

## 💡 도메인 아이디어

| 도메인 | 예시 질문 | 데이터 소스 |
|--------|----------|------------|
| **요리** | "파스타 면 삶는 시간은?" | 레시피 사이트, 요리책 |
| **게임 공략** | "엘든링 보스 공략법?" | 위키, 공략 사이트 |
| **프로그래밍** | "Python list comprehension?" | 공식 문서, Stack Overflow |
| **운동** | "벤치프레스 정확한 자세?" | 운동 가이드, 유튜브 |
| **반려동물** | "강아지 산책 시간은?" | 수의사 Q&A, 커뮤니티 |

---

## 🏆 평가 기준

| 항목 | 배점 | 기준 |
|------|------|------|
| 데이터 품질 | 30% | 명확성, 일관성, 정확성 |
| 학습 성공 | 30% | loss 감소, 에러 없음 |
| 답변 품질 | 30% | 학습 전후 개선 정도 |
| 문서화 | 10% | Model Card, 코드 정리 |
      `,
      hints: [
        '데이터는 양보다 질! 50개 고품질이 500개 저품질보다 나음',
        'Colab 세션 끊김 대비: Drive 마운트 + 체크포인트 저장',
        'loss가 안 줄어들면 learning_rate 낮춰보기 (2e-4 → 1e-4)',
        '처음엔 작은 데이터로 빠르게 테스트, 확인 후 데이터 늘리기',
      ],
    }),
  ],
}
