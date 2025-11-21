// 검토 중인 창고 데이터
export const pendingWarehouses = [
  {
    id: 'pending-w-1',
    companyName: '신규창고업체A',
    location: '서울',
    representative: '김신규',
    phone: '02-1111-2222',
    email: 'new@warehouse-a.com',
    totalArea: 2000,
    warehouseCount: 2,
    warehouseArea: 1500,
    availableArea: 1200,
    temperature: '상온/냉장',
    delivery: ['CJ', '롯데'],
    solution: 'E카운트',
    experience: '3년',
    products: ['공산품', '전자제품'],
    submittedAt: '2024-01-15T10:30:00Z',
    status: 'pending' // pending, approved, rejected
  },
  {
    id: 'pending-w-2',
    companyName: '부산신규물류',
    location: '부산',
    representative: '박물류',
    phone: '051-3333-4444',
    email: 'busan@newlogistics.com',
    totalArea: 3500,
    warehouseCount: 3,
    warehouseArea: 2800,
    availableArea: 2000,
    temperature: '상온/냉동',
    delivery: ['쿠팡', 'CJ'],
    solution: '셀메이트',
    experience: '5년',
    products: ['식품', '생활용품'],
    submittedAt: '2024-01-16T14:20:00Z',
    status: 'pending'
  },
  {
    id: 'pending-w-3',
    companyName: '경기창고센터',
    location: '경기',
    representative: '이경기',
    phone: '031-5555-6666',
    email: 'gyeonggi@warehouse.com',
    totalArea: 1500,
    warehouseCount: 1,
    warehouseArea: 1500,
    availableArea: 800,
    temperature: '상온',
    delivery: ['롯데', '기타'],
    solution: '수기',
    experience: '2년',
    products: ['의류', '화장품'],
    submittedAt: '2024-01-17T09:15:00Z',
    status: 'pending'
  }
];

// 검토 중인 고객사 데이터
export const pendingCustomers = [
  {
    id: 'pending-c-1',
    companyName: '신규전자회사',
    location: '서울',
    representative: '최신규',
    phone: '02-7777-8888',
    email: 'new@electronics.com',
    requiredArea: 800,
    monthlyVolume: 2000,
    products: ['전자제품', 'IT용품'],
    desiredDelivery: ['CJ', '쿠팡'],
    submittedAt: '2024-01-15T11:45:00Z',
    status: 'pending'
  },
  {
    id: 'pending-c-2',
    companyName: '개인사업자 정씨',
    location: '인천',
    representative: '정개인',
    phone: '032-9999-0000',
    email: 'jung@personal.com',
    requiredArea: 300,
    monthlyVolume: 800,
    products: ['공산품'],
    desiredDelivery: ['롯데'],
    submittedAt: '2024-01-16T16:30:00Z',
    status: 'pending'
  },
  {
    id: 'pending-c-3',
    companyName: '대구식품회사',
    location: '대구',
    representative: '한대구',
    phone: '053-1111-2222',
    email: 'daegu@food.com',
    requiredArea: 1200,
    monthlyVolume: 3500,
    products: ['식품', '건강식품'],
    desiredDelivery: ['CJ', '롯데', '쿠팡'],
    submittedAt: '2024-01-17T13:20:00Z',
    status: 'pending'
  }
];




