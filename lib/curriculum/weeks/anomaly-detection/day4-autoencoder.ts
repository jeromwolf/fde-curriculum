// Week 15 Day 4: Autoencoder 이상탐지
import type { Task } from '../../types'

export const day4Tasks: Task[] = [
  {
    id: 'p2w7d4t1',
    type: 'video',
    title: 'Autoencoder 개념',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# Autoencoder 이상탐지

## Autoencoder란?

입력을 압축했다가 복원하는 신경망
- Encoder: 입력 → 잠재 공간 (차원 축소)
- Decoder: 잠재 공간 → 복원

\`\`\`
입력 (n차원)
    ↓
[Encoder]
    ↓
잠재 공간 (k차원, k << n)
    ↓
[Decoder]
    ↓
복원 (n차원)
\`\`\`

## 이상탐지 원리

\`\`\`
1. 정상 데이터로만 학습
2. 정상 패턴 학습 → 잘 복원
3. 이상 데이터 → 복원 못함 (오차 큼)

재구성 오차 = ||입력 - 복원||²
이상치: 재구성 오차 > 임계값
\`\`\`

## 구조

\`\`\`python
import tensorflow as tf
from tensorflow.keras import layers, Model

class Autoencoder(Model):
    def __init__(self, input_dim, latent_dim=8):
        super().__init__()

        # Encoder
        self.encoder = tf.keras.Sequential([
            layers.Dense(32, activation='relu'),
            layers.Dense(16, activation='relu'),
            layers.Dense(latent_dim, activation='relu')
        ])

        # Decoder
        self.decoder = tf.keras.Sequential([
            layers.Dense(16, activation='relu'),
            layers.Dense(32, activation='relu'),
            layers.Dense(input_dim, activation='sigmoid')  # 0-1 범위
        ])

    def call(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded
\`\`\`

## 장점

| 장점 | 설명 |
|------|------|
| 비선형 | 복잡한 패턴 학습 |
| 비지도 | 레이블 불필요 |
| 유연성 | 이미지, 시계열 등 다양한 데이터 |
| 표현 학습 | 잠재 공간 활용 가능 |
`,
      objectives: [
        'Autoencoder 구조를 이해한다',
        '이상탐지 원리를 설명할 수 있다',
        '재구성 오차의 의미를 이해한다'
      ],
      keyPoints: [
        'Encoder-Decoder 구조',
        '정상 데이터로만 학습',
        '재구성 오차로 이상 판단',
        '비선형 패턴 학습 가능'
      ]
    }
  },
  {
    id: 'p2w7d4t2',
    type: 'video',
    title: 'Autoencoder 구현',
    duration: 25,
    content: {
      videoUrl: 'https://www.youtube.com/watch?v=placeholder',
      transcript: `# Autoencoder 구현

## 전체 파이프라인

\`\`\`python
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, Model
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

# 1. 데이터 준비 (정상 데이터만)
X_normal = X[y == 0]  # 정상만 학습

# 0-1 스케일링 (sigmoid 출력 위해)
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X_normal)

# 학습/검증 분할
X_train, X_val = train_test_split(X_scaled, test_size=0.2, random_state=42)

# 2. 모델 정의
input_dim = X_train.shape[1]
latent_dim = max(2, input_dim // 4)  # 차원 축소

autoencoder = Autoencoder(input_dim, latent_dim)
autoencoder.compile(optimizer='adam', loss='mse')

# 3. 학습
history = autoencoder.fit(
    X_train, X_train,  # 입력 = 타겟
    epochs=50,
    batch_size=32,
    validation_data=(X_val, X_val),
    verbose=1
)

# 학습 곡선
plt.plot(history.history['loss'], label='Train')
plt.plot(history.history['val_loss'], label='Val')
plt.xlabel('Epoch')
plt.ylabel('MSE Loss')
plt.legend()
plt.show()
\`\`\`

## 이상탐지

\`\`\`python
# 4. 재구성 오차 계산
X_all_scaled = scaler.transform(X)  # 전체 데이터
reconstructed = autoencoder.predict(X_all_scaled)

# MSE (각 샘플별)
mse = np.mean((X_all_scaled - reconstructed) ** 2, axis=1)

# 5. 임계값 결정 (정상 데이터 기준)
normal_mse = mse[y == 0]
threshold = np.percentile(normal_mse, 95)  # 95th percentile

print(f"정상 MSE 평균: {normal_mse.mean():.6f}")
print(f"정상 MSE 최대: {normal_mse.max():.6f}")
print(f"임계값 (95%): {threshold:.6f}")

# 6. 이상 판단
predictions = (mse > threshold).astype(int)
print(f"이상치 탐지: {predictions.sum()}")

# 시각화
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
plt.hist(mse[y==0], bins=50, alpha=0.7, label='Normal')
plt.hist(mse[y==1], bins=50, alpha=0.7, label='Anomaly')
plt.axvline(threshold, color='r', linestyle='--', label='Threshold')
plt.legend()
plt.title('Reconstruction Error Distribution')

plt.subplot(1, 2, 2)
plt.scatter(range(len(mse)), mse, c=y, cmap='coolwarm', alpha=0.5)
plt.axhline(threshold, color='r', linestyle='--')
plt.xlabel('Sample')
plt.ylabel('MSE')
plt.title('Reconstruction Error per Sample')
plt.tight_layout()
\`\`\`

## 변형 Autoencoder

\`\`\`python
# Variational Autoencoder (VAE)
# 잠재 공간이 정규분포를 따르도록

# Denoising Autoencoder
# 노이즈 추가된 입력 복원
X_noisy = X_train + 0.1 * np.random.normal(size=X_train.shape)
autoencoder.fit(X_noisy, X_train, ...)

# LSTM Autoencoder (시계열)
# Sequential 패턴 학습
\`\`\`
`,
      objectives: [
        'Autoencoder를 구현할 수 있다',
        '이상탐지 파이프라인을 구축할 수 있다',
        '임계값을 결정할 수 있다'
      ],
      keyPoints: [
        '정상 데이터로만 학습',
        'MinMaxScaler (0-1)',
        'MSE로 재구성 오차 계산',
        '95th percentile로 임계값'
      ]
    }
  },
  {
    id: 'p2w7d4t3',
    type: 'code',
    title: '실습: Autoencoder 이상탐지',
    duration: 45,
    content: {
      instructions: `# Autoencoder 이상탐지 실습

## 목표
Autoencoder로 이상탐지 시스템을 구축하세요.

## 요구사항
1. 정상 데이터로 Autoencoder 학습
2. 재구성 오차 계산
3. 임계값 결정
4. 이상탐지 수행
5. 성능 평가

(참고: TensorFlow 없이 sklearn MLPRegressor로 대체 가능)
`,
      starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import precision_score, recall_score, f1_score

np.random.seed(42)

# 정상 데이터 (다변량 정규분포)
n_normal = 800
X_normal = np.random.multivariate_normal(
    mean=[0, 0, 0, 0, 0],
    cov=np.eye(5) * 0.5 + 0.5 * np.ones((5, 5)),
    size=n_normal
)

# 이상치 (다른 분포)
n_outliers = 40
X_outliers = np.random.uniform(low=-3, high=3, size=(n_outliers, 5))

# 합치기
X = np.vstack([X_normal, X_outliers])
y = np.array([0]*n_normal + [1]*n_outliers)

print(f"전체: {len(X)}, 이상치: {y.sum()}")

# TODO: Autoencoder 이상탐지
`,
      solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score

np.random.seed(42)

n_normal = 800
X_normal = np.random.multivariate_normal(
    mean=[0, 0, 0, 0, 0],
    cov=np.eye(5) * 0.5 + 0.5 * np.ones((5, 5)),
    size=n_normal
)

n_outliers = 40
X_outliers = np.random.uniform(low=-3, high=3, size=(n_outliers, 5))

X = np.vstack([X_normal, X_outliers])
y = np.array([0]*n_normal + [1]*n_outliers)

# 1. 데이터 준비 (정상만)
print("=== 1. 데이터 준비 ===")
X_train_normal = X_normal  # 정상 데이터만 학습

scaler = MinMaxScaler()
X_train_scaled = scaler.fit_transform(X_train_normal)
X_all_scaled = scaler.transform(X)

X_train, X_val = train_test_split(X_train_scaled, test_size=0.2, random_state=42)
print(f"학습: {len(X_train)}, 검증: {len(X_val)}")

# 2. Autoencoder (MLPRegressor로 근사)
print("\\n=== 2. Autoencoder 학습 ===")
# 입력 → 압축 → 복원을 단일 MLP로 근사
autoencoder = MLPRegressor(
    hidden_layer_sizes=(16, 4, 16),  # Bottleneck 구조
    activation='relu',
    solver='adam',
    max_iter=500,
    random_state=42,
    early_stopping=True,
    validation_fraction=0.2
)
autoencoder.fit(X_train, X_train)  # 입력 = 타겟 (자기 복원)
print(f"최종 Loss: {autoencoder.loss_:.6f}")

# 3. 재구성 오차 계산
print("\\n=== 3. 재구성 오차 ===")
reconstructed = autoencoder.predict(X_all_scaled)
mse = np.mean((X_all_scaled - reconstructed) ** 2, axis=1)

print(f"정상 MSE 평균: {mse[y==0].mean():.6f}")
print(f"이상 MSE 평균: {mse[y==1].mean():.6f}")

# 4. 임계값 결정
print("\\n=== 4. 임계값 결정 ===")
normal_mse = mse[y == 0]
for p in [90, 95, 99]:
    thresh = np.percentile(normal_mse, p)
    pred = (mse > thresh).astype(int)
    prec = precision_score(y, pred)
    rec = recall_score(y, pred)
    print(f"{p}th percentile ({thresh:.6f}): Precision={prec:.2f}, Recall={rec:.2f}")

# 5. 최종 성능 평가
print("\\n=== 5. 최종 성능 ===")
threshold = np.percentile(normal_mse, 95)
predictions = (mse > threshold).astype(int)

print(f"Precision: {precision_score(y, predictions):.4f}")
print(f"Recall: {recall_score(y, predictions):.4f}")
print(f"F1: {f1_score(y, predictions):.4f}")
print(f"ROC-AUC: {roc_auc_score(y, mse):.4f}")

print(f"\\n탐지된 이상치: {predictions.sum()}")
print(f"실제 이상치 중 탐지: {((predictions == 1) & (y == 1)).sum()}/{y.sum()}")
`,
      hints: [
        '정상 데이터로만 학습',
        'hidden_layer_sizes=(16, 4, 16) bottleneck',
        'MSE = np.mean((X - reconstructed)**2, axis=1)',
        '95th percentile로 임계값'
      ]
    }
  },
  {
    id: 'p2w7d4t4',
    type: 'quiz',
    title: 'Day 4 퀴즈: Autoencoder',
    duration: 10,
    content: {
      questions: [
        {
          question: 'Autoencoder 이상탐지에서 학습 데이터는?',
          options: ['전체 데이터', '이상치만', '정상 데이터만', '레이블된 데이터'],
          answer: 2,
          explanation: 'Autoencoder는 정상 데이터로만 학습합니다. 이렇게 하면 모델이 정상 패턴만 학습하여 정상 데이터는 잘 복원하고, 학습하지 않은 이상 패턴은 복원하지 못해 오차가 커집니다.'
        },
        {
          question: '재구성 오차가 높으면 의미는?',
          options: ['정상', '이상치', '학습 실패', '과적합'],
          answer: 1,
          explanation: '재구성 오차(Reconstruction Error)가 높다는 것은 모델이 해당 데이터를 잘 복원하지 못한다는 의미입니다. 정상 데이터로 학습했으므로, 복원 오차가 큰 데이터는 학습되지 않은 이상 패턴입니다.'
        },
        {
          question: 'Bottleneck 구조의 목적은?',
          options: ['속도 향상', '차원 축소 후 복원', '오버피팅 증가', '손실 감소'],
          answer: 1,
          explanation: 'Bottleneck(병목) 구조는 중간 레이어의 차원을 입력보다 작게 만들어 데이터를 압축했다가 복원하게 합니다. 이를 통해 데이터의 핵심 특징만 학습하고, 노이즈나 이상 패턴은 학습하지 않습니다.'
        }
      ]
    }
  }
]
