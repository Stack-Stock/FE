import React, { useState } from 'react';
import SchoolTransition from '../components/SchoolTransition'; // 💡 새로 만든 등교씬 임포트
import EventScene from './EventScene';                         // 💡 수정된 이벤트씬 임포트
import '../styles/UIComponents.css'; 

const EventTestPage = ({ onBack }) => {
  // 💡 상태를 3단계로 나눕니다: 메뉴 화면 -> 등교 연출 화면 -> 이벤트 화면
  const [testState, setTestState] = useState('MENU'); 
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 💡 9개의 테스트 버튼 리스트 구성
  const eventList = [
    { id: 'LOTTERY', name: '복권 (선택형/확률)' },
    { id: 'JOB', name: '꿀알바 (선택형)' },
    { id: 'ILLEGAL', name: '은밀한 알바 (선택형)' },
    { id: 'LOST_ITEM', name: '습득물 (선택형)' },
    { id: 'BUTTON_100', name: '백억 버튼 (선택형/확률)' },
    { id: 'ALLOWANCE', name: '뜻밖의 용돈 (단발형)' },
    { id: 'GOODS_SALE', name: '스타 굿즈 판매 (단발형)' },
    { id: 'POLICE_ARREST', name: '경찰 체포 (단발형)' },
    { id: 'NORMAL_DAY', name: '평범한 등교 (단발형/아무일 없음)' } // ✅ 9번째 추가!
  ];

  // 1️⃣ 메뉴에서 버튼을 클릭했을 때 (바로 이벤트로 안 가고 트랜지션 켬)
  const handleStartTest = (eventId) => {
    setSelectedEvent(eventId);
    setTestState('TRANSITION'); // 💡 등교 씬 시작!
  };

  // 2️⃣ 등교 씬(SchoolTransition)의 연출이 끝났을 때 호출됨
  const handleTransitionComplete = () => {
    if (selectedEvent === 'NORMAL_DAY') {
      // 평범한 날이면 이벤트 씬을 띄울 필요 없이 바로 종료 처리
      alert("평범한 등교 완료! (실제 게임에선 바로 오후 세션으로 넘어갑니다)");
      setTestState('MENU'); 
    } else {
      // 이벤트가 있는 날이면 파란 배경의 EventScene으로 전환
      setTestState('EVENT'); 
    }
  };

  // 3️⃣ 이벤트 씬(EventScene)에서 선택/결과 확인이 끝났을 때
  const handleEventComplete = (result) => {
    console.log("이벤트 종료. 결과:", result);
    alert("이벤트 종료! 메뉴로 돌아갑니다.");
    setTestState('MENU');
  };

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#1e3a5f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      
      {/* 1단계: 9개의 버튼이 있는 테스트 메뉴 화면 */}
      {testState === 'MENU' && (
        <>
          <h1 style={{ color: '#fff', marginBottom: '40px', fontSize: '36px', textShadow: '2px 2px 0 #000' }}>
            이벤트 씬 테스트 페이지
          </h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '800px' }}>
            {eventList.map(evt => (
              <button 
                key={evt.id} 
                className="retro-block"
                onClick={() => handleStartTest(evt.id)}
                style={{ 
                  padding: '20px', fontSize: '18px', cursor: 'pointer',
                  backgroundColor: evt.id === 'NORMAL_DAY' ? '#2ed573' : '#34495e', // 평범한 날은 초록색
                  color: '#fff', border: '4px solid #000', boxShadow: '4px 4px 0 #000'
                }}
              >
                {evt.name}
              </button>
            ))}
          </div>

          <button 
            className="retro-block"
            onClick={onBack} 
            style={{ marginTop: '50px', padding: '15px 40px', backgroundColor: '#e74c3c', color: '#fff', fontSize: '20px', border: '4px solid #000', cursor: 'pointer', boxShadow: '4px 4px 0 #000' }}
          >
            메인으로 돌아가기
          </button>
        </>
      )}

      {/* 2단계: 학교 가는 길 연출 화면 */}
      {testState === 'TRANSITION' && (
        <SchoolTransition targetEvent={selectedEvent} onComplete={handleTransitionComplete} />
      )}

      {/* 3단계: 실제 이벤트 발생 화면 */}
      {testState === 'EVENT' && (
        <EventScene eventType={selectedEvent} onComplete={handleEventComplete} />
      )}

    </div>
  );
};

export default EventTestPage;