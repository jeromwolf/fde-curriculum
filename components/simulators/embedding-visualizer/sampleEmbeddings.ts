// Sample Embedding Datasets

import type { EmbeddingDataset } from './types'

// 단어 임베딩 (Word2Vec 스타일)
export const wordEmbeddings: EmbeddingDataset = {
  name: '단어 임베딩',
  description: 'Word2Vec 스타일의 단어 벡터 - 유사한 단어가 가깝게 위치',
  categories: ['동물', '음식', '국가', '직업', '감정'],
  points: [
    // 동물
    { id: 'dog', text: '개', category: '동물', coordinates: { x: 2.1, y: 1.5, z: 0.8 } },
    { id: 'cat', text: '고양이', category: '동물', coordinates: { x: 2.3, y: 1.2, z: 0.6 } },
    { id: 'lion', text: '사자', category: '동물', coordinates: { x: 2.5, y: 1.8, z: 1.2 } },
    { id: 'tiger', text: '호랑이', category: '동물', coordinates: { x: 2.4, y: 1.9, z: 1.1 } },
    { id: 'bird', text: '새', category: '동물', coordinates: { x: 1.8, y: 1.3, z: 1.5 } },

    // 음식
    { id: 'apple', text: '사과', category: '음식', coordinates: { x: -1.2, y: 2.1, z: -0.5 } },
    { id: 'banana', text: '바나나', category: '음식', coordinates: { x: -1.0, y: 2.3, z: -0.3 } },
    { id: 'pizza', text: '피자', category: '음식', coordinates: { x: -1.5, y: 1.8, z: -0.8 } },
    { id: 'rice', text: '밥', category: '음식', coordinates: { x: -1.3, y: 1.5, z: -1.0 } },
    { id: 'kimchi', text: '김치', category: '음식', coordinates: { x: -1.4, y: 1.6, z: -0.9 } },

    // 국가
    { id: 'korea', text: '한국', category: '국가', coordinates: { x: 0.2, y: -1.8, z: 2.1 } },
    { id: 'japan', text: '일본', category: '국가', coordinates: { x: 0.4, y: -1.6, z: 2.3 } },
    { id: 'usa', text: '미국', category: '국가', coordinates: { x: -0.3, y: -2.0, z: 1.8 } },
    { id: 'france', text: '프랑스', category: '국가', coordinates: { x: -0.1, y: -1.5, z: 1.5 } },
    { id: 'china', text: '중국', category: '국가', coordinates: { x: 0.5, y: -1.9, z: 2.0 } },

    // 직업
    { id: 'doctor', text: '의사', category: '직업', coordinates: { x: -2.0, y: -0.5, z: -1.5 } },
    { id: 'teacher', text: '선생님', category: '직업', coordinates: { x: -1.8, y: -0.3, z: -1.2 } },
    { id: 'engineer', text: '엔지니어', category: '직업', coordinates: { x: -2.2, y: -0.8, z: -1.8 } },
    { id: 'artist', text: '예술가', category: '직업', coordinates: { x: -1.5, y: -0.1, z: -1.0 } },
    { id: 'chef', text: '요리사', category: '직업', coordinates: { x: -1.6, y: -0.4, z: -1.3 } },

    // 감정
    { id: 'happy', text: '행복', category: '감정', coordinates: { x: 1.0, y: 0.5, z: -2.0 } },
    { id: 'sad', text: '슬픔', category: '감정', coordinates: { x: 0.8, y: -0.2, z: -2.3 } },
    { id: 'angry', text: '분노', category: '감정', coordinates: { x: 1.2, y: -0.5, z: -2.1 } },
    { id: 'love', text: '사랑', category: '감정', coordinates: { x: 1.1, y: 0.8, z: -1.8 } },
    { id: 'fear', text: '두려움', category: '감정', coordinates: { x: 0.9, y: -0.3, z: -2.5 } },
  ]
}

// 문장 임베딩 (Sentence Transformers 스타일)
export const sentenceEmbeddings: EmbeddingDataset = {
  name: '문장 임베딩',
  description: '문장 유사도를 보여주는 BERT 기반 임베딩',
  categories: ['기술', '스포츠', '여행', '음악'],
  points: [
    // 기술
    { id: 's1', text: '인공지능이 미래를 바꾼다', category: '기술', coordinates: { x: 3.0, y: 2.5, z: 1.0 } },
    { id: 's2', text: 'AI가 세상을 변화시킨다', category: '기술', coordinates: { x: 2.9, y: 2.6, z: 1.1 } },
    { id: 's3', text: '머신러닝 알고리즘 개발', category: '기술', coordinates: { x: 2.7, y: 2.2, z: 0.8 } },
    { id: 's4', text: '딥러닝으로 이미지 인식', category: '기술', coordinates: { x: 2.8, y: 2.4, z: 0.9 } },

    // 스포츠
    { id: 's5', text: '축구 경기에서 골을 넣다', category: '스포츠', coordinates: { x: -2.5, y: 1.8, z: 2.0 } },
    { id: 's6', text: '야구 시즌이 시작되다', category: '스포츠', coordinates: { x: -2.3, y: 2.0, z: 1.8 } },
    { id: 's7', text: '올림픽 금메달 획득', category: '스포츠', coordinates: { x: -2.6, y: 1.5, z: 2.2 } },
    { id: 's8', text: '마라톤 완주 성공', category: '스포츠', coordinates: { x: -2.4, y: 1.7, z: 1.9 } },

    // 여행
    { id: 's9', text: '파리 에펠탑 여행', category: '여행', coordinates: { x: 0.5, y: -2.0, z: -1.5 } },
    { id: 's10', text: '일본 온천 여행 계획', category: '여행', coordinates: { x: 0.7, y: -1.8, z: -1.3 } },
    { id: 's11', text: '제주도 해변 휴가', category: '여행', coordinates: { x: 0.6, y: -2.2, z: -1.7 } },
    { id: 's12', text: '유럽 배낭 여행기', category: '여행', coordinates: { x: 0.4, y: -1.9, z: -1.4 } },

    // 음악
    { id: 's13', text: 'BTS 콘서트 후기', category: '음악', coordinates: { x: -0.8, y: 0.5, z: -2.5 } },
    { id: 's14', text: '클래식 음악 감상', category: '음악', coordinates: { x: -1.0, y: 0.3, z: -2.8 } },
    { id: 's15', text: '기타 연주 배우기', category: '음악', coordinates: { x: -0.9, y: 0.7, z: -2.3 } },
    { id: 's16', text: '피아노 레슨 시작', category: '음악', coordinates: { x: -1.1, y: 0.4, z: -2.6 } },
  ]
}

// 유사도 계산 예시
export const similarityExamples: EmbeddingDataset = {
  name: '유사도 계산',
  description: '코사인 유사도로 가장 가까운 단어 찾기',
  categories: ['왕', '여왕', '남자', '여자'],
  points: [
    // 유명한 Word2Vec 예제: King - Man + Woman = Queen
    { id: 'king', text: '왕', category: '왕', coordinates: { x: 2.0, y: 2.0, z: 0 } },
    { id: 'queen', text: '여왕', category: '여왕', coordinates: { x: 2.0, y: -2.0, z: 0 } },
    { id: 'man', text: '남자', category: '남자', coordinates: { x: -2.0, y: 2.0, z: 0 } },
    { id: 'woman', text: '여자', category: '여자', coordinates: { x: -2.0, y: -2.0, z: 0 } },
    // 중간 결과
    { id: 'result', text: '왕-남자+여자=?', category: '여왕', coordinates: { x: 2.0, y: -1.9, z: 0.1 }, metadata: { note: 'King - Man + Woman ≈ Queen' } },
  ]
}

export const sampleDatasets = {
  words: wordEmbeddings,
  sentences: sentenceEmbeddings,
  similarity: similarityExamples,
}

export type DatasetKey = keyof typeof sampleDatasets
