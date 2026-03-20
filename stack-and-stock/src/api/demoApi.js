// src/api/demoApi.js

let demoState = {
  runId: 9999,
  currentDayNo: 1,
  cashBalance: 1000000,
  apRemaining: 2,
  holdings: [],
  actionsDone: [],
  eventResolved: false,
};

const demoArticles = [
  {
    dayNo: 1,
    stockId: 1,
    title: "현소차·키야 美판매 3천만대 눈앞",
    story:
      "현대차와 기아가 미국 시장에서 39년간 누적 판매 2930만대를 기록하며 올해 3000만대 달성을 앞두고 있다는 소식이다. 브랜드 가치와 시장 점유율 측면에서 의미 있는 이정표로 평가될 수 있다.",
    url: "https://www.mk.co.kr/article/11272318",
    publishedAt: "2025-03-24T17:51:09",
  },
  {
    dayNo: 2,
    stockId: 1,
    title: "日 관세협상 타결에 … 현소차 주가 훨훨",
    story:
      "미국과 일본의 관세 협상 타결 소식이 현대차에 긍정적으로 작용했다. 한국 자동차 업체들도 향후 비슷한 수준의 관세율 적용 가능성이 높아졌다는 의미로 해석되어 투자 심리가 개선되었다.",
    url: "https://www.mk.co.kr/article/11375860",
    publishedAt: "2025-07-23T18:02:34",
  },
  {
    dayNo: 3,
    stockId: 1,
    title: "“깐부즈 막내 출격”…31만원 뚫은 현소차, 2가지 무기 더 있다는데",
    story:
      "현소차는 미국 행정부의 로봇 산업 육성 정책 발표로 보스턴다이나믹스의 가치가 재조명받았고, 자율주행 기술 협업 가능성이 호재로 작용하며 투자 심리가 개선되었습니다.",
    url: "https://www.mk.co.kr/article/11485559",
    publishedAt: "2025-12-05T21:13:52",
  },
];

const demoPrices = {
  1: [
    {
      stockId: 1,
      company: "현소차",
      currentPrice: 82568,
      priceChange: 2568,
      returnPct: 0.0321,
      priceHistory: [{ dayNo: 1, closePrice: 82568 }],
    },
    {
      stockId: 2,
      company: "아뭐래퍼시픽",
      currentPrice: 49265,
      priceChange: -735,
      returnPct: -0.0147,
      priceHistory: [{ dayNo: 1, closePrice: 49265 }],
    },
    {
      stockId: 3,
      company: "네일버",
      currentPrice: 60173,
      priceChange: 173,
      returnPct: 0.0029,
      priceHistory: [{ dayNo: 1, closePrice: 60173 }],
    },
    {
      stockId: 4,
      company: "두미약품",
      currentPrice: 98150,
      priceChange: -1850,
      returnPct: -0.0185,
      priceHistory: [{ dayNo: 1, closePrice: 98150 }],
    },
    {
      stockId: 5,
      company: "산양식품",
      currentPrice: 35126,
      priceChange: 126,
      returnPct: 0.0036,
      priceHistory: [{ dayNo: 1, closePrice: 35126 }],
    },
    {
      stockId: 6,
      company: "SK바이닉스",
      currentPrice: 76207,
      priceChange: 1207,
      returnPct: 0.0161,
      priceHistory: [{ dayNo: 1, closePrice: 76207 }],
    },
    {
      stockId: 7,
      company: "SPC사립",
      currentPrice: 24625,
      priceChange: -375,
      returnPct: -0.015,
      priceHistory: [{ dayNo: 1, closePrice: 24625 }],
    },
    {
      stockId: 8,
      company: "현소로템",
      currentPrice: 45090,
      priceChange: 90,
      returnPct: 0.002,
      priceHistory: [{ dayNo: 1, closePrice: 45090 }],
    },
    {
      stockId: 9,
      company: "에이비알",
      currentPrice: 30186,
      priceChange: 186,
      returnPct: 0.0062,
      priceHistory: [{ dayNo: 1, closePrice: 30186 }],
    },
    {
      stockId: 10,
      company: "삼송전자",
      currentPrice: 70462,
      priceChange: 462,
      returnPct: 0.0066,
      priceHistory: [{ dayNo: 1, closePrice: 70462 }],
    },
    {
      stockId: 11,
      company: "두화",
      currentPrice: 30099,
      priceChange: 99,
      returnPct: 0.0033,
      priceHistory: [{ dayNo: 1, closePrice: 30099 }],
    },
    {
      stockId: 12,
      company: "코코아뱅크",
      currentPrice: 19812,
      priceChange: -188,
      returnPct: -0.0094,
      priceHistory: [{ dayNo: 1, closePrice: 19812 }],
    },
    {
      stockId: 13,
      company: "SK이놈베이션",
      currentPrice: 50585,
      priceChange: 585,
      returnPct: 0.0117,
      priceHistory: [{ dayNo: 1, closePrice: 50585 }],
    },
    {
      stockId: 14,
      company: "넘심",
      currentPrice: 40712,
      priceChange: 712,
      returnPct: 0.0178,
      priceHistory: [{ dayNo: 1, closePrice: 40712 }],
    },
    {
      stockId: 15,
      company: "코코아페이",
      currentPrice: 14977,
      priceChange: -23,
      returnPct: -0.0015,
      priceHistory: [{ dayNo: 1, closePrice: 14977 }],
    },
    {
      stockId: 16,
      company: "MG CNS",
      currentPrice: 44829,
      priceChange: -171,
      returnPct: -0.0038,
      priceHistory: [{ dayNo: 1, closePrice: 44829 }],
    },
    {
      stockId: 17,
      company: "구름웍스",
      currentPrice: 7882,
      priceChange: -118,
      returnPct: -0.0147,
      priceHistory: [{ dayNo: 1, closePrice: 7882 }],
    },
    {
      stockId: 18,
      company: "YGG PLUS",
      currentPrice: 4987,
      priceChange: -13,
      returnPct: -0.0025,
      priceHistory: [{ dayNo: 1, closePrice: 4987 }],
    },
    {
      stockId: 19,
      company: "하이파이브",
      currentPrice: 85833,
      priceChange: 833,
      returnPct: 0.0098,
      priceHistory: [{ dayNo: 1, closePrice: 85833 }],
    },
    {
      stockId: 20,
      company: "NG화학",
      currentPrice: 95988,
      priceChange: 988,
      returnPct: 0.0104,
      priceHistory: [{ dayNo: 1, closePrice: 95988 }],
    },
    {
      stockId: 21,
      company: "HL천도",
      currentPrice: 35700,
      priceChange: 700,
      returnPct: 0.02,
      priceHistory: [{ dayNo: 1, closePrice: 35700 }],
    },
    {
      stockId: 22,
      company: "코코아",
      currentPrice: 40208,
      priceChange: 208,
      returnPct: 0.0052,
      priceHistory: [{ dayNo: 1, closePrice: 40208 }],
    },
    {
      stockId: 23,
      company: "OCI홀띵스",
      currentPrice: 55555,
      priceChange: 555,
      returnPct: 0.0101,
      priceHistory: [{ dayNo: 1, closePrice: 55555 }],
    },
    {
      stockId: 24,
      company: "코스모스",
      currentPrice: 40224,
      priceChange: 224,
      returnPct: 0.0056,
      priceHistory: [{ dayNo: 1, closePrice: 40224 }],
    },
    {
      stockId: 25,
      company: "두화솔루션",
      currentPrice: 30069,
      priceChange: 69,
      returnPct: 0.0023,
      priceHistory: [{ dayNo: 1, closePrice: 30069 }],
    },
    {
      stockId: 26,
      company: "SJ ENM",
      currentPrice: 44617,
      priceChange: -383,
      returnPct: -0.0085,
      priceHistory: [{ dayNo: 1, closePrice: 44617 }],
    },
    {
      stockId: 27,
      company: "에구프로",
      currentPrice: 12112,
      priceChange: 112,
      returnPct: 0.0094,
      priceHistory: [{ dayNo: 1, closePrice: 12112 }],
    },
    {
      stockId: 28,
      company: "온리온",
      currentPrice: 40480,
      priceChange: 480,
      returnPct: 0.012,
      priceHistory: [{ dayNo: 1, closePrice: 40480 }],
    },
    {
      stockId: 29,
      company: "삼송화재",
      currentPrice: 90629,
      priceChange: 629,
      returnPct: 0.007,
      priceHistory: [{ dayNo: 1, closePrice: 90629 }],
    },
    {
      stockId: 30,
      company: "키야",
      currentPrice: 75780,
      priceChange: 780,
      returnPct: 0.0104,
      priceHistory: [{ dayNo: 1, closePrice: 75780 }],
    },
  ],
  2: [
    {
      stockId: 1,
      company: "현소차",
      currentPrice: 88067,
      priceChange: 5499,
      returnPct: 0.0666,
      priceHistory: [
        { dayNo: 1, closePrice: 82568 },
        { dayNo: 2, closePrice: 88067 },
      ],
    },
    {
      stockId: 2,
      company: "아뭐래퍼시픽",
      currentPrice: 48555,
      priceChange: -710,
      returnPct: -0.0144,
      priceHistory: [
        { dayNo: 1, closePrice: 49265 },
        { dayNo: 2, closePrice: 48555 },
      ],
    },
    {
      stockId: 3,
      company: "네일버",
      currentPrice: 61129,
      priceChange: 956,
      returnPct: 0.0159,
      priceHistory: [
        { dayNo: 1, closePrice: 60173 },
        { dayNo: 2, closePrice: 61129 },
      ],
    },
    {
      stockId: 4,
      company: "두미약품",
      currentPrice: 98100,
      priceChange: -50,
      returnPct: -0.0005,
      priceHistory: [
        { dayNo: 1, closePrice: 98150 },
        { dayNo: 2, closePrice: 98100 },
      ],
    },
    {
      stockId: 5,
      company: "산양식품",
      currentPrice: 35301,
      priceChange: 175,
      returnPct: 0.005,
      priceHistory: [
        { dayNo: 1, closePrice: 35126 },
        { dayNo: 2, closePrice: 35301 },
      ],
    },
    {
      stockId: 6,
      company: "SK바이닉스",
      currentPrice: 75345,
      priceChange: -862,
      returnPct: -0.0113,
      priceHistory: [
        { dayNo: 1, closePrice: 76207 },
        { dayNo: 2, closePrice: 75345 },
      ],
    },
    {
      stockId: 7,
      company: "SPC사립",
      currentPrice: 24767,
      priceChange: 142,
      returnPct: 0.0058,
      priceHistory: [
        { dayNo: 1, closePrice: 24625 },
        { dayNo: 2, closePrice: 24767 },
      ],
    },
    {
      stockId: 8,
      company: "현소로템",
      currentPrice: 45432,
      priceChange: 342,
      returnPct: 0.0076,
      priceHistory: [
        { dayNo: 1, closePrice: 45090 },
        { dayNo: 2, closePrice: 45432 },
      ],
    },
    {
      stockId: 9,
      company: "에이비알",
      currentPrice: 30179,
      priceChange: -7,
      returnPct: -0.0002,
      priceHistory: [
        { dayNo: 1, closePrice: 30186 },
        { dayNo: 2, closePrice: 30179 },
      ],
    },
    {
      stockId: 10,
      company: "삼송전자",
      currentPrice: 70356,
      priceChange: -106,
      returnPct: -0.0015,
      priceHistory: [
        { dayNo: 1, closePrice: 70462 },
        { dayNo: 2, closePrice: 70356 },
      ],
    },
    {
      stockId: 11,
      company: "두화",
      currentPrice: 30261,
      priceChange: 162,
      returnPct: 0.0054,
      priceHistory: [
        { dayNo: 1, closePrice: 30099 },
        { dayNo: 2, closePrice: 30261 },
      ],
    },
    {
      stockId: 12,
      company: "코코아뱅크",
      currentPrice: 19718,
      priceChange: -94,
      returnPct: -0.0047,
      priceHistory: [
        { dayNo: 1, closePrice: 19812 },
        { dayNo: 2, closePrice: 19718 },
      ],
    },
    {
      stockId: 13,
      company: "SK이놈베이션",
      currentPrice: 51035,
      priceChange: 450,
      returnPct: 0.0089,
      priceHistory: [
        { dayNo: 1, closePrice: 50585 },
        { dayNo: 2, closePrice: 51035 },
      ],
    },
    {
      stockId: 14,
      company: "넘심",
      currentPrice: 39979,
      priceChange: -733,
      returnPct: -0.018,
      priceHistory: [
        { dayNo: 1, closePrice: 40712 },
        { dayNo: 2, closePrice: 39979 },
      ],
    },
    {
      stockId: 15,
      company: "코코아페이",
      currentPrice: 15072,
      priceChange: 95,
      returnPct: 0.0064,
      priceHistory: [
        { dayNo: 1, closePrice: 14977 },
        { dayNo: 2, closePrice: 15072 },
      ],
    },
    {
      stockId: 16,
      company: "MG CNS",
      currentPrice: 45120,
      priceChange: 291,
      returnPct: 0.0065,
      priceHistory: [
        { dayNo: 1, closePrice: 44829 },
        { dayNo: 2, closePrice: 45120 },
      ],
    },
    {
      stockId: 17,
      company: "구름웍스",
      currentPrice: 7971,
      priceChange: 89,
      returnPct: 0.0113,
      priceHistory: [
        { dayNo: 1, closePrice: 7882 },
        { dayNo: 2, closePrice: 7971 },
      ],
    },
    {
      stockId: 18,
      company: "YGG PLUS",
      currentPrice: 4895,
      priceChange: -92,
      returnPct: -0.0183,
      priceHistory: [
        { dayNo: 1, closePrice: 4987 },
        { dayNo: 2, closePrice: 4895 },
      ],
    },
    {
      stockId: 19,
      company: "하이파이브",
      currentPrice: 86373,
      priceChange: 540,
      returnPct: 0.0063,
      priceHistory: [
        { dayNo: 1, closePrice: 85833 },
        { dayNo: 2, closePrice: 86373 },
      ],
    },
    {
      stockId: 20,
      company: "NG화학",
      currentPrice: 97341,
      priceChange: 1353,
      returnPct: 0.0141,
      priceHistory: [
        { dayNo: 1, closePrice: 95988 },
        { dayNo: 2, closePrice: 97341 },
      ],
    },
    {
      stockId: 21,
      company: "HL천도",
      currentPrice: 35389,
      priceChange: -311,
      returnPct: -0.0087,
      priceHistory: [
        { dayNo: 1, closePrice: 35700 },
        { dayNo: 2, closePrice: 35389 },
      ],
    },
    {
      stockId: 22,
      company: "코코아",
      currentPrice: 39576,
      priceChange: -632,
      returnPct: -0.0157,
      priceHistory: [
        { dayNo: 1, closePrice: 40208 },
        { dayNo: 2, closePrice: 39576 },
      ],
    },
    {
      stockId: 23,
      company: "OCI홀띵스",
      currentPrice: 55932,
      priceChange: 377,
      returnPct: 0.0068,
      priceHistory: [
        { dayNo: 1, closePrice: 55555 },
        { dayNo: 2, closePrice: 55932 },
      ],
    },
    {
      stockId: 24,
      company: "코스모스",
      currentPrice: 40268,
      priceChange: 44,
      returnPct: 0.0011,
      priceHistory: [
        { dayNo: 1, closePrice: 40224 },
        { dayNo: 2, closePrice: 40268 },
      ],
    },
    {
      stockId: 25,
      company: "두화솔루션",
      currentPrice: 29948,
      priceChange: -121,
      returnPct: -0.004,
      priceHistory: [
        { dayNo: 1, closePrice: 30069 },
        { dayNo: 2, closePrice: 29948 },
      ],
    },
    {
      stockId: 26,
      company: "SJ ENM",
      currentPrice: 44358,
      priceChange: -259,
      returnPct: -0.0058,
      priceHistory: [
        { dayNo: 1, closePrice: 44617 },
        { dayNo: 2, closePrice: 44358 },
      ],
    },
    {
      stockId: 27,
      company: "에구프로",
      currentPrice: 12394,
      priceChange: 282,
      returnPct: 0.0233,
      priceHistory: [
        { dayNo: 1, closePrice: 12112 },
        { dayNo: 2, closePrice: 12394 },
      ],
    },
    {
      stockId: 28,
      company: "온리온",
      currentPrice: 40480,
      priceChange: 0,
      returnPct: 0,
      priceHistory: [
        { dayNo: 1, closePrice: 40480 },
        { dayNo: 2, closePrice: 40480 },
      ],
    },
    {
      stockId: 29,
      company: "삼송화재",
      currentPrice: 89985,
      priceChange: -644,
      returnPct: -0.0071,
      priceHistory: [
        { dayNo: 1, closePrice: 90629 },
        { dayNo: 2, closePrice: 89985 },
      ],
    },
    {
      stockId: 30,
      company: "키야",
      currentPrice: 77356,
      priceChange: 1576,
      returnPct: 0.0208,
      priceHistory: [
        { dayNo: 1, closePrice: 75780 },
        { dayNo: 2, closePrice: 77356 },
      ],
    },
  ],
  3: [
    {
      stockId: 1,
      company: "현소차",
      currentPrice: 95764,
      priceChange: 7697,
      returnPct: 0.0874,
      priceHistory: [
        { dayNo: 1, closePrice: 82568 },
        { dayNo: 2, closePrice: 88067 },
        { dayNo: 3, closePrice: 95764 },
      ],
    },
    {
      stockId: 2,
      company: "아뭐래퍼시픽",
      currentPrice: 48482,
      priceChange: -73,
      returnPct: -0.0015,
      priceHistory: [
        { dayNo: 1, closePrice: 49265 },
        { dayNo: 2, closePrice: 48555 },
        { dayNo: 3, closePrice: 48482 },
      ],
    },
    {
      stockId: 3,
      company: "네일버",
      currentPrice: 60028,
      priceChange: -1101,
      returnPct: -0.018,
      priceHistory: [
        { dayNo: 1, closePrice: 60173 },
        { dayNo: 2, closePrice: 61129 },
        { dayNo: 3, closePrice: 60028 },
      ],
    },
    {
      stockId: 4,
      company: "두미약품",
      currentPrice: 98492,
      priceChange: 392,
      returnPct: 0.004,
      priceHistory: [
        { dayNo: 1, closePrice: 98150 },
        { dayNo: 2, closePrice: 98100 },
        { dayNo: 3, closePrice: 98492 },
      ],
    },
    {
      stockId: 5,
      company: "산양식품",
      currentPrice: 35188,
      priceChange: -113,
      returnPct: -0.0032,
      priceHistory: [
        { dayNo: 1, closePrice: 35126 },
        { dayNo: 2, closePrice: 35301 },
        { dayNo: 3, closePrice: 35188 },
      ],
    },
    {
      stockId: 6,
      company: "SK바이닉스",
      currentPrice: 75149,
      priceChange: -196,
      returnPct: -0.0026,
      priceHistory: [
        { dayNo: 1, closePrice: 76207 },
        { dayNo: 2, closePrice: 75345 },
        { dayNo: 3, closePrice: 75149 },
      ],
    },
    {
      stockId: 7,
      company: "SPC사립",
      currentPrice: 24801,
      priceChange: 34,
      returnPct: 0.0014,
      priceHistory: [
        { dayNo: 1, closePrice: 24625 },
        { dayNo: 2, closePrice: 24767 },
        { dayNo: 3, closePrice: 24801 },
      ],
    },
    {
      stockId: 8,
      company: "현소로템",
      currentPrice: 45559,
      priceChange: 127,
      returnPct: 0.0028,
      priceHistory: [
        { dayNo: 1, closePrice: 45090 },
        { dayNo: 2, closePrice: 45432 },
        { dayNo: 3, closePrice: 45559 },
      ],
    },
    {
      stockId: 9,
      company: "에이비알",
      currentPrice: 30601,
      priceChange: 422,
      returnPct: 0.014,
      priceHistory: [
        { dayNo: 1, closePrice: 30186 },
        { dayNo: 2, closePrice: 30179 },
        { dayNo: 3, closePrice: 30601 },
      ],
    },
    {
      stockId: 10,
      company: "삼송전자",
      currentPrice: 70912,
      priceChange: 556,
      returnPct: 0.0079,
      priceHistory: [
        { dayNo: 1, closePrice: 70462 },
        { dayNo: 2, closePrice: 70356 },
        { dayNo: 3, closePrice: 70912 },
      ],
    },
    {
      stockId: 11,
      company: "두화",
      currentPrice: 30300,
      priceChange: 39,
      returnPct: 0.0013,
      priceHistory: [
        { dayNo: 1, closePrice: 30099 },
        { dayNo: 2, closePrice: 30261 },
        { dayNo: 3, closePrice: 30300 },
      ],
    },
    {
      stockId: 12,
      company: "코코아뱅크",
      currentPrice: 19542,
      priceChange: -176,
      returnPct: -0.0089,
      priceHistory: [
        { dayNo: 1, closePrice: 19812 },
        { dayNo: 2, closePrice: 19718 },
        { dayNo: 3, closePrice: 19542 },
      ],
    },
    {
      stockId: 13,
      company: "SK이놈베이션",
      currentPrice: 50412,
      priceChange: -623,
      returnPct: -0.0122,
      priceHistory: [
        { dayNo: 1, closePrice: 50585 },
        { dayNo: 2, closePrice: 51035 },
        { dayNo: 3, closePrice: 50412 },
      ],
    },
    {
      stockId: 14,
      company: "넘심",
      currentPrice: 40098,
      priceChange: 119,
      returnPct: 0.003,
      priceHistory: [
        { dayNo: 1, closePrice: 40712 },
        { dayNo: 2, closePrice: 39979 },
        { dayNo: 3, closePrice: 40098 },
      ],
    },
    {
      stockId: 15,
      company: "코코아페이",
      currentPrice: 15308,
      priceChange: 236,
      returnPct: 0.0157,
      priceHistory: [
        { dayNo: 1, closePrice: 14977 },
        { dayNo: 2, closePrice: 15072 },
        { dayNo: 3, closePrice: 15308 },
      ],
    },
    {
      stockId: 16,
      company: "MG CNS",
      currentPrice: 45142,
      priceChange: 22,
      returnPct: 0.0005,
      priceHistory: [
        { dayNo: 1, closePrice: 44829 },
        { dayNo: 2, closePrice: 45120 },
        { dayNo: 3, closePrice: 45142 },
      ],
    },
    {
      stockId: 17,
      company: "구름웍스",
      currentPrice: 7960,
      priceChange: -11,
      returnPct: -0.0013,
      priceHistory: [
        { dayNo: 1, closePrice: 7882 },
        { dayNo: 2, closePrice: 7971 },
        { dayNo: 3, closePrice: 7960 },
      ],
    },
    {
      stockId: 18,
      company: "YGG PLUS",
      currentPrice: 4926,
      priceChange: 31,
      returnPct: 0.0064,
      priceHistory: [
        { dayNo: 1, closePrice: 4987 },
        { dayNo: 2, closePrice: 4895 },
        { dayNo: 3, closePrice: 4926 },
      ],
    },
    {
      stockId: 19,
      company: "하이파이브",
      currentPrice: 84870,
      priceChange: -1503,
      returnPct: -0.0174,
      priceHistory: [
        { dayNo: 1, closePrice: 85833 },
        { dayNo: 2, closePrice: 86373 },
        { dayNo: 3, closePrice: 84870 },
      ],
    },
    {
      stockId: 20,
      company: "NG화학",
      currentPrice: 96980,
      priceChange: -361,
      returnPct: -0.0037,
      priceHistory: [
        { dayNo: 1, closePrice: 95988 },
        { dayNo: 2, closePrice: 97341 },
        { dayNo: 3, closePrice: 96980 },
      ],
    },
    {
      stockId: 21,
      company: "HL천도",
      currentPrice: 37119,
      priceChange: 1730,
      returnPct: 0.0489,
      priceHistory: [
        { dayNo: 1, closePrice: 35700 },
        { dayNo: 2, closePrice: 35389 },
        { dayNo: 3, closePrice: 37119 },
      ],
    },
    {
      stockId: 22,
      company: "코코아",
      currentPrice: 39469,
      priceChange: -107,
      returnPct: -0.0027,
      priceHistory: [
        { dayNo: 1, closePrice: 40208 },
        { dayNo: 2, closePrice: 39576 },
        { dayNo: 3, closePrice: 39469 },
      ],
    },
    {
      stockId: 23,
      company: "OCI홀띵스",
      currentPrice: 56184,
      priceChange: 252,
      returnPct: 0.0045,
      priceHistory: [
        { dayNo: 1, closePrice: 55555 },
        { dayNo: 2, closePrice: 55932 },
        { dayNo: 3, closePrice: 56184 },
      ],
    },
    {
      stockId: 24,
      company: "코스모스",
      currentPrice: 41037,
      priceChange: 769,
      returnPct: 0.0191,
      priceHistory: [
        { dayNo: 1, closePrice: 40224 },
        { dayNo: 2, closePrice: 40268 },
        { dayNo: 3, closePrice: 41037 },
      ],
    },
    {
      stockId: 25,
      company: "두화솔루션",
      currentPrice: 30346,
      priceChange: 398,
      returnPct: 0.0133,
      priceHistory: [
        { dayNo: 1, closePrice: 30069 },
        { dayNo: 2, closePrice: 29948 },
        { dayNo: 3, closePrice: 30346 },
      ],
    },
    {
      stockId: 26,
      company: "SJ ENM",
      currentPrice: 43590,
      priceChange: -768,
      returnPct: -0.0173,
      priceHistory: [
        { dayNo: 1, closePrice: 44617 },
        { dayNo: 2, closePrice: 44358 },
        { dayNo: 3, closePrice: 43590 },
      ],
    },
    {
      stockId: 27,
      company: "에구프로",
      currentPrice: 12847,
      priceChange: 453,
      returnPct: 0.0366,
      priceHistory: [
        { dayNo: 1, closePrice: 12112 },
        { dayNo: 2, closePrice: 12394 },
        { dayNo: 3, closePrice: 12847 },
      ],
    },
    {
      stockId: 28,
      company: "온리온",
      currentPrice: 39265,
      priceChange: -1215,
      returnPct: -0.03,
      priceHistory: [
        { dayNo: 1, closePrice: 40480 },
        { dayNo: 2, closePrice: 40480 },
        { dayNo: 3, closePrice: 39265 },
      ],
    },
    {
      stockId: 29,
      company: "삼송화재",
      currentPrice: 89328,
      priceChange: -657,
      returnPct: -0.0073,
      priceHistory: [
        { dayNo: 1, closePrice: 90629 },
        { dayNo: 2, closePrice: 89985 },
        { dayNo: 3, closePrice: 89328 },
      ],
    },
    {
      stockId: 30,
      company: "키야",
      currentPrice: 79266,
      priceChange: 1910,
      returnPct: 0.0247,
      priceHistory: [
        { dayNo: 1, closePrice: 75780 },
        { dayNo: 2, closePrice: 77356 },
        { dayNo: 3, closePrice: 79266 },
      ],
    },
  ],
};

const eventsPool = {
  1: {
    eventId: 1,
    title: "🍀 행운의 복권",
    description: "복권을 사보시겠습니까? (5% 확률 당첨)",
    choices: [
      { id: 1, text: "산다 (-5,000원)", cost: 5000 },
      { id: 2, text: "안 산다", cost: 0 },
    ],
  },
  10: {
    eventId: 10,
    title: "🎁 프론트 전용 특별 이벤트",
    description: "프론트엔드에만 존재하는 10번 이벤트입니다.",
    choices: [
      { id: 1, text: "선택 A", cost: 0 },
      { id: 2, text: "선택 B", cost: 0 },
    ],
  },
};

export const demoApi = {
  startGame: async () => {
    demoState = {
      runId: 9999,
      currentDayNo: 1,
      cashBalance: 1000000,
      apRemaining: 2,
      holdings: [],
      actionsDone: [],
      eventResolved: false,
    };
    return {
      runId: demoState.runId,
      dayNo: 1,
      cashBalance: 1000000,
      apRemaining: 2,
    };
  },

  getDailyStart: async (runId) => {
    const day = demoState.currentDayNo;
    const isEventDay = day === 2 && !demoState.eventResolved;
    const visibleArticles = demoArticles.filter((a) => a.dayNo < day);
    return {
      portfolio: {
        currentDayNo: day,
        cashBalance: demoState.cashBalance,
        holdings: demoState.holdings,
      },
      tradingScreen: { stocks: demoPrices[day] || demoPrices[3] },
      daySummary:
        day > 1 ? { message: "어제는 정말 긴박한 하루였습니다!" } : null,
      articleArchive: { articles: visibleArticles },
      hasRandomEvent: isEventDay,
      randomEventId: isEventDay ? 10 : null, // 💡 2일차 10번 이벤트 강제 발생
      hasInspiration: false,
    };
  },

  getRandomEvent: async (runId) => {
    const day = demoState.currentDayNo;
    return eventsPool[day === 2 ? 10 : 1];
  },

  resolveRandomEvent: async (payload) => {
    const { choiceId } = payload;
    demoState.eventResolved = true;
    if (demoState.currentDayNo === 2)
      return {
        success: true,
        message: "10번 이벤트가 종료되었습니다.",
        cashBalance: demoState.cashBalance,
      };
    if (choiceId === 1) {
      demoState.cashBalance -= 5000;
      if (Math.random() < 0.05) {
        demoState.cashBalance += 100000;
        return {
          success: true,
          message: "🎊 복권 당첨! 10만원 획득!",
          cashBalance: demoState.cashBalance,
        };
      }
      return {
        success: true,
        message: "꽝! 다음 기회에...",
        cashBalance: demoState.cashBalance,
      };
    }
    return {
      success: true,
      message: "이벤트를 무사히 마쳤습니다.",
      cashBalance: demoState.cashBalance,
    };
  },

  executeAction: async (payload) => {
    const action = payload.actionType;
    
    // 💡 잠자기(SLEEP) 액션 처리 로직
    if (action === "SLEEP") {
      // 💡 [핵심 추가] 데모 모드는 3일 차 밤에 잠을 자면 2번(일반 성공) 엔딩으로 직행!
      if (demoState.currentDayNo >= 3) {
        return {
          endingType: 2, // 2번: 성공 - 성실한 투자자 엔딩
          cashBalance: demoState.cashBalance,
          apRemaining: 0,
          message: "데모 플레이가 성공적으로 종료되었습니다.",
        };
      }

      // 1일 차, 2일 차일 경우에는 정상적으로 다음 날로 넘어갑니다.
      demoState.currentDayNo += 1;
      demoState.apRemaining = 2;
      demoState.actionsDone = [];
      demoState.eventResolved = false;
      return {
        cashBalance: demoState.cashBalance,
        apRemaining: 2,
        message: "다음 날이 되었습니다.",
      };
    }
    const isAlreadyDone = demoState.actionsDone.includes(action);
    if (!isAlreadyDone) {
      const costs = { INFO_PAPER: 2, INFO_PHONE: 0, INFO_TV: 1 };
      const cost = costs[action] ?? 1;
      if (demoState.apRemaining < cost)
        return {
          cashBalance: demoState.cashBalance,
          apRemaining: demoState.apRemaining,
          message: "행동력이 부족합니다!",
          isError: true,
        };
      demoState.apRemaining -= cost;
      demoState.actionsDone.push(action);
    }
    const day = demoState.currentDayNo;
    const dayMessages = newsData[day] || newsData[1];
    return {
      cashBalance: demoState.cashBalance,
      apRemaining: demoState.apRemaining,
      message: dayMessages[action],
    };
  },

  executeTrade: async (tradeRequest) => {
    if (demoState.apRemaining < 1)
      return { success: false, message: "행동력이 부족합니다!" };
    demoState.apRemaining -= 1;
    const day = demoState.currentDayNo;
    const todayPrices = demoPrices[day] || demoPrices[3];
    tradeRequest.orders.forEach((order) => {
      const stock = todayPrices.find((s) => s.stockId === order.stockId);
      if (!stock) return;
      if (order.side === "BUY") {
        const cost = stock.currentPrice * order.quantity;
        demoState.cashBalance -= cost;
        const existing = demoState.holdings.find(
          (h) => h.stockId === stock.stockId,
        );
        if (existing) {
          const totalQty = existing.quantity + order.quantity;
          existing.avgCost = Math.floor(
            (existing.avgCost * existing.quantity + cost) / totalQty,
          );
          existing.quantity = totalQty;
        } else {
          demoState.holdings.push({
            stockId: stock.stockId,
            company: stock.company,
            quantity: order.quantity,
            avgCost: stock.currentPrice,
          });
        }
      } else if (order.side === "SELL") {
        const existing = demoState.holdings.find(
          (h) => h.stockId === stock.stockId,
        );
        if (existing) {
          existing.quantity -= order.quantity;
          if (existing.quantity <= 0)
            demoState.holdings = demoState.holdings.filter(
              (h) => h.stockId !== stock.stockId,
            );
        }
        demoState.cashBalance += stock.currentPrice * order.quantity;
      }
    });
    return {
      success: true,
      cashBalance: demoState.cashBalance,
      holdings: [...demoState.holdings],
      apRemaining: demoState.apRemaining,
    };
  },

  getCurrentPortfolio: async () => {
    return { cashBalance: demoState.cashBalance, holdings: demoState.holdings };
  },
};

const newsData = {
  1: {
    INFO_PAPER:
      "현소차와 키야가 올해 미국 시장에서 누적 판매 3000만대 기록을 달성할 것으로 보인다. 현소차그룹은 미국 진출 39년 만의 성과를 보이며 주요 업체로 자리매김했다.",
    INFO_TV:
      "국내 자동차 업체가 해외 주요 시장에서 지속적인 판매 성과를 보이고 있으며, 올해 상징적인 수치를 달성할 것으로 예상됩니다.",
    INFO_PHONE:
      "자동차 쪽 미국에서 엄청 팔렸다던데 ㄷㄷ 누적으로 몇천만대라는데 진짜임? 모빌리티 업종 봐봐",
  },
  2: {
    INFO_PAPER:
      "미국과 일본의 관세 협상이 타결되면서 현소차와 키야에 대한 투자심리가 개선되고 있다. 향후 한미 간 관세 협상에도 긍정적 선례가 될 것이라는 기대감이 형성 중이다.",
    INFO_TV:
      "미국과 일본의 관세 협상이 타결되었습니다. 일본이 관세율을 크게 낮추면서 글로벌 자동차 산업에 긍정적 신호로 받아들여지고 있습니다.",
    INFO_PHONE:
      "미일 관세 협상 타결됐대ㄷㄷ 자동차 쪽 분위기 괜찮아진다는 소문? ㅋㅋ",
  },
  3: {
    INFO_PAPER:
      "현소차가 로봇과 자율주행이라는 두 가지 모멘텀에 주목받고 있습니다. 브루클린다이나믹스의 가치가 재평가되고 있으며 빅테크 협업 가능성도 호재입니다.",
    INFO_TV:
      "미국 행정부가 로봇 산업 육성 의지를 공식 밝혔습니다. 국내 완성차 업체 중 로봇 사업과 자율주행 기술을 보유한 곳들이 관심을 받고 있습니다.",
    INFO_PHONE:
      "미국에서 로봇 산업 밀어준다는데 ㄷㄷ 자율주행 쪽도 뭔가 움직임 있다던데? 모빌리티 테마 핫하네 ㅋㅋ",
  },
};
