// 테스트용 계정 생성 스크립트
// 브라우저 콘솔에서 실행하거나, Node.js 환경에서 localStorage를 시뮬레이션하여 실행

const CryptoJS = require('crypto-js');

// 비밀번호 해싱 함수
const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

// 테스트 계정 데이터
const testAccounts = {
  warehouse: {
    id: 'warehouse-test-aa',
    userType: 'warehouse',
    status: 'pending',
    submittedAt: new Date().toISOString(),
    companyName: '테스트창고AA',
    businessNumber: '123-45-67890',
    representative: '홍길동',
    phone: '02-1234-5678',
    contactPerson: '김담당',
    contactPhone: '010-1234-5678',
    email: 'aa@aa.com',
    password: hashPassword('aa'),
    location: '서울',
    city: '강남구',
    dong: '역삼동',
    totalArea: '5000',
    totalAreaUnit: 'sqm',
    warehouseCount: '2',
    warehouseArea: '4000',
    warehouseAreaUnit: 'sqm',
    availableArea: '3000',
    availableAreaUnit: 'sqm',
    palletCount: '150',
    experience: '5',
    storageTypes: ['상온', '냉장'],
    deliveryCompanies: ['CJ', '롯데'],
    otherDeliveryCompany: '',
    solutions: ['E카운트'],
    otherSolution: '',
    products: ['공산품', '전자제품']
  },
  customer: {
    id: 'customer-test-bb',
    userType: 'customer',
    status: 'pending',
    submittedAt: new Date().toISOString(),
    companyName: '테스트고객사BB',
    location: '서울',
    city: '강남구',
    dong: '역삼동',
    representative: '이대표',
    phone: '02-9876-5432',
    contactPerson: '박담당',
    contactPhone: '010-9876-5432',
    email: 'bb@bb.com',
    password: hashPassword('bb'),
    requiredArea: '2000',
    requiredAreaUnit: 'sqm',
    palletCount: '100',
    monthlyVolume: '5000',
    desiredDelivery: ['CJ', '롯데', '쿠팡'],
    products: ['공산품', '의류']
  }
};

// 브라우저 환경에서 실행할 수 있는 코드
if (typeof window !== 'undefined' && window.localStorage) {
  // 기존 사용자 데이터 가져오기
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  
  // 기존 테스트 계정 제거 (중복 방지)
  const filteredUsers = existingUsers.filter(u => 
    u.id !== testAccounts.warehouse.id && u.id !== testAccounts.customer.id
  );
  
  // 새 테스트 계정 추가
  filteredUsers.push(testAccounts.warehouse);
  filteredUsers.push(testAccounts.customer);
  
  localStorage.setItem('users', JSON.stringify(filteredUsers));
  
  // pending 목록에도 추가
  const pendingWarehouses = JSON.parse(localStorage.getItem('pendingWarehouses') || '[]');
  const pendingCustomers = JSON.parse(localStorage.getItem('pendingCustomers') || '[]');
  
  // 기존 테스트 데이터 제거
  const filteredPendingWarehouses = pendingWarehouses.filter(w => w.id !== testAccounts.warehouse.id);
  const filteredPendingCustomers = pendingCustomers.filter(c => c.id !== testAccounts.customer.id);
  
  filteredPendingWarehouses.push(testAccounts.warehouse);
  filteredPendingCustomers.push(testAccounts.customer);
  
  localStorage.setItem('pendingWarehouses', JSON.stringify(filteredPendingWarehouses));
  localStorage.setItem('pendingCustomers', JSON.stringify(filteredPendingCustomers));
  
  console.log('✅ 테스트 계정 생성 완료!');
  console.log('창고 계정: aa@aa.com / aa');
  console.log('고객사 계정: bb@bb.com / bb');
} else {
  console.log('브라우저 환경에서 실행해주세요.');
  console.log('테스트 계정 데이터:', testAccounts);
}

