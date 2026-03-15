// 산업군 목록
export const INDUSTRIES = ['전체', 'IT', '반도체', '자동차', '바이오', '게임', '엔터', '금융', '식품', '화학', '건설'];

// 초기 가격을 기반으로 50일 치의 랜덤 주가 변동 데이터를 생성하는 함수
const generateHistory = (basePrice) => {
  let current = basePrice;
  const history = [current];
  for (let i = 1; i <= 50; i++) {
    // 하루에 -5% ~ +5% 변동
    let change = current * (Math.random() * 0.1 - 0.05); 
    current = Math.max(100, Math.floor((current + change) / 100) * 100); // 100원 단위 절사, 최소 100원
    history.push(current);
  }
  return history;
};

// 30개 회사 더미 데이터 생성
export const STOCK_LIST = [
  // IT
  { id: 1, industry: 'IT', name: '네이벼', code: 'NAVER', history: generateHistory(185000) },
  { id: 2, industry: 'IT', name: '카카5', code: 'KAKAO', history: generateHistory(45000) },
  { id: 3, industry: 'IT', name: '토오스', code: 'TOSS', history: generateHistory(60000) },
  // 반도체
  { id: 4, industry: '반도체', name: '삼송전자', code: 'SAMSUNG', history: generateHistory(72000) },
  { id: 5, industry: '반도체', name: 'SK하1닉스', code: 'HYNIX', history: generateHistory(145000) },
  { id: 6, industry: '반도체', name: '한미반도체', code: 'HANMI', history: generateHistory(85000) },
  // 자동차
  { id: 7, industry: '자동차', name: '현대차차', code: 'HYUNDAI', history: generateHistory(215000) },
  { id: 8, industry: '자동차', name: '기아아', code: 'KIA', history: generateHistory(115000) },
  { id: 9, industry: '자동차', name: '테슬라(짭)', code: 'TSLA_KR', history: generateHistory(300000) },
  // 바이오
  { id: 10, industry: '바이오', name: '셀트리온온', code: 'CELL', history: generateHistory(180000) },
  { id: 11, industry: '바이오', name: '삼바', code: 'SAMBA', history: generateHistory(800000) },
  { id: 12, industry: '바이오', name: '신풍제약', code: 'SINPUNG', history: generateHistory(15000) },
  // 게임
  { id: 13, industry: '게임', name: '엔씨소프트', code: 'NC', history: generateHistory(200000) },
  { id: 14, industry: '게임', name: '넥슨지티', code: 'NEXON', history: generateHistory(15000) },
  { id: 15, industry: '게임', name: '크래프톤', code: 'KRAFTON', history: generateHistory(250000) },
  // 엔터
  { id: 16, industry: '엔터', name: '하이브브', code: 'HYBE', history: generateHistory(220000) },
  { id: 17, industry: '엔터', name: 'JYP엔터', code: 'JYP', history: generateHistory(85000) },
  { id: 18, industry: '엔터', name: 'SM엔터', code: 'SM', history: generateHistory(95000) },
  // 금융
  { id: 19, industry: '금융', name: 'KB금융', code: 'KB', history: generateHistory(65000) },
  { id: 20, industry: '금융', name: '신한지주', code: 'SHINHAN', history: generateHistory(45000) },
  { id: 21, industry: '금융', name: '카카오뱅크', code: 'KAKAOB', history: generateHistory(25000) },
  // 식품
  { id: 22, industry: '식품', name: '농심', code: 'NONGSIM', history: generateHistory(400000) },
  { id: 23, industry: '식품', name: '삼양식품', code: 'SAMYANG', history: generateHistory(200000) },
  { id: 24, industry: '식품', name: '오리온', code: 'ORION', history: generateHistory(110000) },
  // 화학
  { id: 25, industry: '화학', name: 'LG화학', code: 'LG_CHEM', history: generateHistory(450000) },
  { id: 26, industry: '화학', name: '금호석유', code: 'KUMHO', history: generateHistory(130000) },
  { id: 27, industry: '화학', name: '롯데케미칼', code: 'LOTTE', history: generateHistory(120000) },
  // 건설
  { id: 28, industry: '건설', name: '현대건설', code: 'HYUNDAI_C', history: generateHistory(35000) },
  { id: 29, industry: '건설', name: 'GS건설', code: 'GS', history: generateHistory(15000) },
  { id: 30, industry: '건설', name: '대우건설', code: 'DAEWOO', history: generateHistory(4000) },
];