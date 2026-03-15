// 💡 나중에 API 연동 시, 백엔드에서 이와 동일한 구조의 JSON을 보내주도록 맞추면 됩니다.

// 1. 초기 더미 예수금
export const DUMMY_MONEY = 2500000;

// 2. 일일 정산 더미 데이터
export const DUMMY_SETTLEMENT = {
  totalChange: 15281,
  cashChange: 0,
  stockChange: 15281
};

// 3. 보유 주식 더미 데이터 (종목ID: { 수량, 평단가 })
export const DUMMY_HOLDINGS = {
  1: { quantity: 5, avgPrice: 190000 },  // 네이벼
  4: { quantity: 10, avgPrice: 70000 }   // 삼송전자
};

// 4. 거래 내역 로그 더미 데이터 (전체 누적 로그)
export const DUMMY_TRADE_LOGS = [
  { id: 1, day: 2, stockId: 4, stockName: '삼송전자', quantity: 10, price: 70000, type: 'BUY' },
  { id: 2, day: 5, stockId: 1, stockName: '네이벼', quantity: 5, price: 190000, type: 'BUY' },
  { id: 3, day: 9, stockId: 4, stockName: '삼송전자', quantity: 2, price: 75000, type: 'SELL' }
];

// 5. 기사 아카이브 더미 데이터
export const DUMMY_ARCHIVE_DATA = {
  9: [
    { stock: '네이벼', realDate: '2022.10.15', realTitle: '판교 데이터센터 화재로 서비스 먹통 사태 발생', reason: '카카오와 네이버 등 주요 IT 서비스가 마비되며 플랫폼 신뢰도가 급락, 투자 심리가 크게 위축되었습니다.', impact: 'BAD' },
    { stock: '삼송전자', realDate: '2023.01.06', realTitle: '삼성전자 4분기 어닝 쇼크... 영업이익 69% 급감', reason: '글로벌 경기 침체로 인한 반도체 수요 감소가 실적에 반영되며 주가가 크게 하락했습니다.', impact: 'BAD' }
  ],
  8: [
    { stock: '에코프로(짭)', realDate: '2023.07.26', realTitle: '2차전지 광풍... 에코프로 장중 150만원 돌파', reason: '개인 투자자들의 매수세가 몰리며 2차전지 관련주가 비정상적인 폭등을 기록했습니다.', impact: 'GOOD' }
  ]
};