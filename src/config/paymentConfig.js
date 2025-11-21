/**
 * 결제 설정 파일
 * PG사 정보는 나중에 .env 파일에서 입력
 */

export const paymentConfig = {
  // PG사 정보 (환경 변수로 관리, 나중에 입력)
  // .env 파일에 다음 형식으로 추가:
  // VITE_MERCHANT_ID=your_merchant_id
  // VITE_API_KEY=your_api_key
  // VITE_API_SECRET=your_api_secret
  // VITE_PG_PROVIDER=portone
  // VITE_TEST_MODE=true
  // VITE_PAYMENT_AMOUNT=50000
  merchantId: import.meta.env.VITE_MERCHANT_ID || '',
  apiKey: import.meta.env.VITE_API_KEY || '',
  apiSecret: import.meta.env.VITE_API_SECRET || '',
  pgProvider: import.meta.env.VITE_PG_PROVIDER || 'portone',
  
  // 테스트 모드 (기본값: true)
  isTestMode: import.meta.env.VITE_TEST_MODE !== 'false',
  
  // 결제 정보
  amount: parseInt(import.meta.env.VITE_PAYMENT_AMOUNT) || 50000,
  productName: '열람권',
  productDescription: '10회 사용 가능, 유효기간 3개월',
  
  // 열람권 정보
  viewingPassCount: 10,
  viewingPassValidityMonths: 3,
};

