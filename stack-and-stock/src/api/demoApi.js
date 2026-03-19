// src/api/demoApi.js
// 💡 백엔드를 대체하는 5일짜리 데모 시나리오 엔진

let demoState = {
  runId: 9999,
  currentDayNo: 1,
  cashBalance: 1000000,
  apRemaining: 2,
  holdings: []
};

// 5일 치 시나리오 주가 데이터
const demoPrices = {
  1: [ { stockId: 1, company: '현소차', currentPrice: 50000, priceChange: 0, returnPct: 0, priceHistory: [{ dayNo: 1, closePrice: 50000 }] },
       { stockId: 2, company: '네일버', currentPrice: 80000, priceChange: 0, returnPct: 0, priceHistory: [{ dayNo: 1, closePrice: 80000 }] } ],
  2: [ { stockId: 1, company: '현소차', currentPrice: 55000, priceChange: 5000, returnPct: 0.1, priceHistory: [{ dayNo: 1, closePrice: 50000 }, { dayNo: 2, closePrice: 55000 }] },
       { stockId: 2, company: '네일버', currentPrice: 76000, priceChange: -4000, returnPct: -0.05, priceHistory: [{ dayNo: 1, closePrice: 80000 }, { dayNo: 2, closePrice: 76000 }] } ],
  3: [ { stockId: 1, company: '현소차', currentPrice: 62000, priceChange: 7000, returnPct: 0.12, priceHistory: [{ dayNo: 1, closePrice: 50000 }, { dayNo: 2, closePrice: 55000 }, { dayNo: 3, closePrice: 62000 }] },
       { stockId: 2, company: '네일버', currentPrice: 70000, priceChange: -6000, returnPct: -0.07, priceHistory: [{ dayNo: 1, closePrice: 80000 }, { dayNo: 2, closePrice: 76000 }, { dayNo: 3, closePrice: 70000 }] } ],
  4: [ { stockId: 1, company: '현소차', currentPrice: 40000, priceChange: -22000, returnPct: -0.35, priceHistory: [{ dayNo: 1, closePrice: 50000 }, { dayNo: 2, closePrice: 55000 }, { dayNo: 3, closePrice: 62000 }, { dayNo: 4, closePrice: 40000 }] }, // 떡락 이벤트!
       { stockId: 2, company: '네일버', currentPrice: 75000, priceChange: 5000, returnPct: 0.07, priceHistory: [{ dayNo: 1, closePrice: 80000 }, { dayNo: 2, closePrice: 76000 }, { dayNo: 3, closePrice: 70000 }, { dayNo: 4, closePrice: 75000 }] } ],
  5: [ { stockId: 1, company: '현소차', currentPrice: 41000, priceChange: 1000, returnPct: 0.02, priceHistory: [{ dayNo: 1, closePrice: 50000 }, { dayNo: 2, closePrice: 55000 }, { dayNo: 3, closePrice: 62000 }, { dayNo: 4, closePrice: 40000 }, { dayNo: 5, closePrice: 41000 }] },
       { stockId: 2, company: '네일버', currentPrice: 88000, priceChange: 13000, returnPct: 0.17, priceHistory: [{ dayNo: 1, closePrice: 80000 }, { dayNo: 2, closePrice: 76000 }, { dayNo: 3, closePrice: 70000 }, { dayNo: 4, closePrice: 75000 }, { dayNo: 5, closePrice: 88000 }] } ],
};

export const demoApi = {
  startGame: async () => {
    // 상태 초기화
    demoState = { runId: 9999, currentDayNo: 1, cashBalance: 1000000, apRemaining: 2, holdings: [] };
    return { runId: demoState.runId, dayNo: 1, cashBalance: 1000000, apRemaining: 2 };
  },

  getDailyStart: async (runId) => {
    const day = demoState.currentDayNo;
    return {
      portfolio: { currentDayNo: day, cashBalance: demoState.cashBalance, holdings: demoState.holdings },
      tradingScreen: { stocks: demoPrices[day] || demoPrices[5] },
      daySummary: day > 1 ? { message: "어제는 힘든 하루였습니다..." } : null,
      articleArchive: { articles: [] },
      hasRandomEvent: false,
      hasInspiration: false
    };
  },

  executeAction: async (payload) => {
    if (payload.actionType === 'SLEEP') {
      demoState.currentDayNo += 1;
      demoState.apRemaining = 2; // 다음 날 행동력 리셋
      return { cashBalance: demoState.cashBalance, apRemaining: demoState.apRemaining, message: "다음 날이 되었습니다." };
    }
    
    demoState.apRemaining = Math.max(0, demoState.apRemaining - 1);
    let msg = "정보를 획득했습니다! (데모)";
    if (payload.actionType === 'INFO_PAPER') msg = "신문: 내일 현소차가 엄청난 발표를 할지도 모릅니다!";
    
    return { cashBalance: demoState.cashBalance, apRemaining: demoState.apRemaining, message: msg };
  },

  executeTrade: async (tradeRequest) => {
    const day = demoState.currentDayNo;
    const todayPrices = demoPrices[day] || demoPrices[5];

    tradeRequest.orders.forEach(order => {
      const stock = todayPrices.find(s => s.stockId === order.stockId);
      if (!stock) return;

      if (order.side === 'BUY') {
        const cost = stock.currentPrice * order.quantity;
        demoState.cashBalance -= cost;
        const existing = demoState.holdings.find(h => h.stockId === stock.stockId);
        if (existing) {
          existing.quantity += order.quantity;
        } else {
          demoState.holdings.push({ stockId: stock.stockId, company: stock.company, quantity: order.quantity, avgCost: stock.currentPrice });
        }
      } else if (order.side === 'SELL') {
        const existing = demoState.holdings.find(h => h.stockId === stock.stockId);
        if (existing) {
          existing.quantity -= order.quantity;
          if (existing.quantity <= 0) demoState.holdings = demoState.holdings.filter(h => h.stockId !== stock.stockId);
        }
        // 데모 모드는 편의상 즉시 정산 (혹은 T+3 무시)
        demoState.cashBalance += (stock.currentPrice * order.quantity); 
      }
    });

    return { success: true };
  },

  getCurrentPortfolio: async () => {
    return { cashBalance: demoState.cashBalance, holdings: demoState.holdings };
  }
};