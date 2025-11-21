// 브라우저 콘솔에서 실행할 수 있는 테스트 계정 생성 스크립트
// http://localhost:3001 에서 개발자 도구 콘솔에 붙여넣고 실행하세요

(function() {
  // crypto-js가 로드되어 있지 않으므로 간단한 해싱 함수 사용
  // 실제로는 서버에서 해싱하거나 crypto-js를 사용해야 하지만,
  // 테스트를 위해 간단한 해시 함수 사용
  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  // SHA-256 해싱 (간단한 버전, 실제로는 crypto-js 사용 권장)
  // 브라우저에서 crypto.subtle 사용
  async function hashPassword(password) {
    if (window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // 폴백: 간단한 해시
      return simpleHash(password).toString();
    }
  }

  async function createTestAccounts() {
    const warehousePassword = await hashPassword('aa');
    const customerPassword = await hashPassword('bb');

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
        password: warehousePassword,
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
        password: customerPassword,
        requiredArea: '2000',
        requiredAreaUnit: 'sqm',
        palletCount: '100',
        monthlyVolume: '5000',
        desiredDelivery: ['CJ', '롯데', '쿠팡'],
        products: ['공산품', '의류']
      }
    };

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
    console.log('창고 계정: aa@aa.com / 비밀번호: aa');
    console.log('고객사 계정: bb@bb.com / 비밀번호: bb');
    console.log('이제 로그인 페이지에서 로그인할 수 있습니다.');
    
    return {
      warehouse: testAccounts.warehouse,
      customer: testAccounts.customer
    };
  }

  // 즉시 실행
  createTestAccounts().catch(err => {
    console.error('계정 생성 중 오류:', err);
  });
})();

