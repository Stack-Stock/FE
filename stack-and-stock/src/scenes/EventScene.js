import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import EventChoice from './EventChoice';
import EventResult from './EventResult';

const EventScene = ({ eventType, onComplete }) => {
  const [stage, setStage] = useState('CHOICE');
  const [selectedResult, setSelectedResult] = useState(null);

  const eventDB = {
    LOTTERY: {
      type: 'CHOICE',
      title: '복권 판매점',
      choiceImg: 'event_lottery_choice.png',
      choiceText: '길가에 복권 가판대가 보인다. 하나 사볼까?',
      options: [
        { label: '당첨을 노린다', next: 'WIN', text: '축하합니다! 5만원에 당첨되었습니다.' },
        { label: '운이 없을 것 같다', next: 'LOSE', text: '역시... 꽝이다. 돈만 날렸네.' }
      ],
      resultImgs: { WIN: 'event_lottery_win.png', LOSE: 'event_lottery_lose.png' }
    },
    JOB: {
      type: 'CHOICE',
      title: '꿀알바 공고',
      choiceImg: 'event_job_choice.png',
      choiceText: '카페 게시판에 급구 알바 공고가 떴다. 시급이 상당한데?',
      options: [
        { label: '바로 지원하기', next: 'ACCEPT', text: '정신없었지만 일당은 넉넉히 받았다.' },
        { label: '쉬고 싶다', next: 'DECLINE', text: '집에서 쉬는 게 최고지.' }
      ],
      resultImgs: { ACCEPT: 'event_job_accept.png', DECLINE: 'event_job_decline.png' }
    },
    ILLEGAL: {
      type: 'CHOICE',
      title: '은밀한 제안',
      choiceImg: 'event_illegal_choice.png',
      choiceText: '누군가 검은 봉투를 건네며 창고로 와달라고 한다.',
      options: [
        { label: '돈이 급하니 간다', next: 'ACCEPT', text: '찝찝하지만 지갑은 두둑해졌다.' },
        { label: '무시하고 도망친다', next: 'DECLINE', text: '위험한 일에 엮이지 않는 게 상책이다.' }
      ],
      resultImgs: { ACCEPT: 'event_illegal_accept.png', DECLINE: 'event_illegal_decline.png' }
    },
    LOST_ITEM: {
      type: 'CHOICE',
      title: '분실된 지갑',
      choiceImg: 'event_lostitem_choice.png',
      choiceText: '길바닥에 두툼한 지갑이 떨어져 있다.',
      options: [
        { label: '경찰서에 신고한다', next: 'POLICE', text: '사례금을 조금 받았다. 마음이 편하다.' },
        { label: '조용히 챙긴다', next: 'KEEP', text: '돈은 벌었지만 계속 뒤가 구리다.' }
      ],
      resultImgs: { POLICE: 'event_lostitem_police.png', KEEP: 'event_lostitem_keep.png' }
    },
    BUTTON_100: {
      type: 'CHOICE',
      title: '100억 버튼',
      choiceImg: 'event_button_press.png',
      choiceText: '버튼을 누르면 100억을 준다고?? 누군가의 장난이겠지?',
      options: [
        { label: '인생은 한 방이다', next: 'SUCCESS', text: '세상에... 100억이 들어왔다!' },
        { label: '도박은 하지 않는다', next: 'FAILURE', text: '안전한 삶을 택했다.' }
      ],
      resultImgs: { SUCCESS: 'event_button_success.png', FAILURE: 'event_button_failure.png' }
    },
    ALLOWANCE: {
      type: 'SINGLE',
      title: '뜻밖의 용돈',
      image: 'event_allowance.png',
      text: '부모님께서 기특하다며 국밥 값 하라고 용돈을 주셨다.'
    },
    GOODS_SALE: {
      type: 'SINGLE',
      title: '스타 굿즈 판매',
      image: 'event_goods_sale.png',
      text: '한정판 굿즈가 드디어 팔렸다! 택배 상자에서 빛이 나는 것 같다.'
    },
    POLICE_ARREST: {
      type: 'SINGLE',
      title: '경찰 체포',
      image: 'event_police_arrest.png',
      text: '착하게 살걸... 착하게 살자...'
    }
  };

  const currentEvent = eventDB[eventType] || eventDB.ALLOWANCE;

  // 단발성 이벤트는 바로 결과창으로 점프
  if (currentEvent.type === 'SINGLE' && stage === 'CHOICE') {
    setStage('RESULT');
    setSelectedResult({ text: currentEvent.text, img: currentEvent.image });
  }

  const handleChoice = (opt) => {
    setSelectedResult({ text: opt.text, img: currentEvent.resultImgs[opt.next] });
    setStage('RESULT');
  };

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#1e3a5f', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <AnimatePresence mode="wait">
        {stage === 'CHOICE' ? (
          <EventChoice 
            key="choice" 
            data={currentEvent} 
            onSelect={handleChoice} 
          />
        ) : (
          <EventResult 
            key="result" 
            title={currentEvent.title}
            data={selectedResult} 
            onConfirm={onComplete} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventScene;