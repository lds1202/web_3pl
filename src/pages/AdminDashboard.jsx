import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Package,
  LogOut,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { warehouseData, customerData } from '../data/sampleData';
import { pendingWarehouses, pendingCustomers } from '../data/pendingData';
import DetailModal from '../components/DetailModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [warehouses, setWarehouses] = useState(warehouseData);
  const [customers, setCustomers] = useState(customerData);
  const [pendingWarehouseList, setPendingWarehouseList] = useState(pendingWarehouses);
  const [pendingCustomerList, setPendingCustomerList] = useState(pendingCustomers);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    // 관리자 인증 확인
    const isAdmin = localStorage.getItem('adminAuth');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    
    // localStorage에서 승인된 창고와 고객사 불러오기
    const approvedWarehouses = JSON.parse(localStorage.getItem('approvedWarehouses') || '[]');
    const approvedCustomers = JSON.parse(localStorage.getItem('approvedCustomers') || '[]');
    
    // 승인된 창고/고객사를 warehouses/customers 상태에 추가 (중복 제거)
    setWarehouses(prev => {
      const existingIds = prev.map(w => w.id);
      const newWarehouses = approvedWarehouses.filter(w => !existingIds.includes(w.id));
      return [...prev, ...newWarehouses];
    });
    
    setCustomers(prev => {
      const existingIds = prev.map(c => c.id);
      const newCustomers = approvedCustomers.filter(c => !existingIds.includes(c.id));
      return [...prev, ...newCustomers];
    });
    
    // localStorage에서 모든 사용자 데이터 불러오기
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // users에서 pending 상태인 창고와 고객사 추출
    const pendingWarehousesFromUsers = allUsers.filter(user => 
      user.userType === 'warehouse' && 
      (user.status === 'pending' || !user.status) // status가 pending이거나 없으면 대기 중
    );
    
    const pendingCustomersFromUsers = allUsers.filter(user => 
      user.userType === 'customer' && 
      (user.status === 'pending' || !user.status) // status가 pending이거나 없으면 대기 중
    );
    
    // localStorage에서 대기 중인 데이터 불러오기
    const storedPendingWarehouses = JSON.parse(localStorage.getItem('pendingWarehouses') || '[]');
    const storedPendingCustomers = JSON.parse(localStorage.getItem('pendingCustomers') || '[]');
    
    // 기존 pendingData와 합치기 (중복 제거 - id 기준)
    const allPendingWarehouses = [
      ...pendingWarehouses,
      ...pendingWarehousesFromUsers,
      ...storedPendingWarehouses.filter(sw => 
        !pendingWarehouses.find(pw => pw.id === sw.id) &&
        !pendingWarehousesFromUsers.find(pw => pw.id === sw.id)
      )
    ];
    
    const allPendingCustomers = [
      ...pendingCustomers,
      ...pendingCustomersFromUsers,
      ...storedPendingCustomers.filter(sc => 
        !pendingCustomers.find(pc => pc.id === sc.id) &&
        !pendingCustomersFromUsers.find(pc => pc.id === sc.id)
      )
    ];
    
    setPendingWarehouseList(allPendingWarehouses);
    setPendingCustomerList(allPendingCustomers);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const handleDeleteWarehouse = (id) => {
    if (window.confirm('정말로 이 창고를 삭제하시겠습니까?')) {
      setWarehouses(prev => prev.filter(w => w.id !== id));
    }
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('정말로 이 고객사를 삭제하시겠습니까?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  // 창고 승인
  const handleApproveWarehouse = (pendingWarehouse) => {
    if (window.confirm('이 창고를 승인하시겠습니까?')) {
      // users 배열에서 해당 사용자의 status 업데이트
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => 
        user.id === pendingWarehouse.id 
          ? { ...user, status: 'approved' }
          : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // pendingWarehouses에서도 제거
      const pendingWarehouses = JSON.parse(localStorage.getItem('pendingWarehouses') || '[]');
      const updatedPending = pendingWarehouses.filter(w => w.id !== pendingWarehouse.id);
      localStorage.setItem('pendingWarehouses', JSON.stringify(updatedPending));
      
      // 승인된 창고 데이터 준비 (창고 찾기에서 사용할 형식으로 변환)
      // 비밀번호 필드는 제외
      const { password, ...warehouseWithoutPassword } = pendingWarehouse;
      const approvedWarehouse = {
        ...warehouseWithoutPassword,
        id: `w-${Date.now()}`, // 새로운 ID 생성
        isPremium: false,
        premiumLevel: 0,
        status: 'approved',
        submittedAt: pendingWarehouse.submittedAt || new Date().toISOString(), // 신청일
        approvedAt: new Date().toISOString(), // 승인일
        // 필요한 필드 정규화
        temperature: Array.isArray(pendingWarehouse.storageTypes) 
          ? pendingWarehouse.storageTypes.join('/') 
          : pendingWarehouse.temperature || (typeof pendingWarehouse.storageTypes === 'string' ? pendingWarehouse.storageTypes : '상온'),
        delivery: Array.isArray(pendingWarehouse.deliveryCompanies) 
          ? pendingWarehouse.deliveryCompanies 
          : (Array.isArray(pendingWarehouse.delivery) ? pendingWarehouse.delivery : []),
        solution: Array.isArray(pendingWarehouse.solutions) 
          ? pendingWarehouse.solutions.join(', ') 
          : (pendingWarehouse.solution || ''),
        experience: typeof pendingWarehouse.experience === 'string' 
          ? pendingWarehouse.experience 
          : (pendingWarehouse.experience ? `${pendingWarehouse.experience}년` : ''),
        products: Array.isArray(pendingWarehouse.products) 
          ? pendingWarehouse.products 
          : [],
        totalArea: parseFloat(pendingWarehouse.totalArea) || 0,
        availableArea: parseFloat(pendingWarehouse.availableArea) || 0,
        palletCount: parseFloat(pendingWarehouse.palletCount) || 0,
        // 기본 필드 보장
        city: pendingWarehouse.city || '',
        dong: pendingWarehouse.dong || '',
        phone: pendingWarehouse.phone || '',
        email: pendingWarehouse.email || ''
      };
      
      // 승인된 창고를 localStorage에 저장 (창고 찾기에서 사용)
      const approvedWarehouses = JSON.parse(localStorage.getItem('approvedWarehouses') || '[]');
      approvedWarehouses.push(approvedWarehouse);
      localStorage.setItem('approvedWarehouses', JSON.stringify(approvedWarehouses));
      
      setWarehouses(prev => [...prev, approvedWarehouse]);
      
      // 대기 목록에서 제거
      setPendingWarehouseList(prev => prev.filter(w => w.id !== pendingWarehouse.id));
      
      alert('창고가 승인되었습니다.');
    }
  };

  // 창고 거부
  const handleRejectWarehouse = (id) => {
    if (window.confirm('이 창고 등록을 거부하시겠습니까?')) {
      // users 배열에서 해당 사용자의 status 업데이트
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => 
        user.id === id 
          ? { ...user, status: 'rejected' }
          : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // pendingWarehouses에서도 제거
      const pendingWarehouses = JSON.parse(localStorage.getItem('pendingWarehouses') || '[]');
      const updatedPending = pendingWarehouses.filter(w => w.id !== id);
      localStorage.setItem('pendingWarehouses', JSON.stringify(updatedPending));
      
      setPendingWarehouseList(prev => prev.filter(w => w.id !== id));
      alert('창고 등록이 거부되었습니다.');
    }
  };

  // 고객사 승인
  const handleApproveCustomer = (pendingCustomer) => {
    if (window.confirm('이 고객사를 승인하시겠습니까?')) {
      // users 배열에서 해당 사용자의 status 업데이트
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => 
        user.id === pendingCustomer.id 
          ? { ...user, status: 'approved' }
          : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // pendingCustomers에서도 제거
      const pendingCustomers = JSON.parse(localStorage.getItem('pendingCustomers') || '[]');
      const updatedPending = pendingCustomers.filter(c => c.id !== pendingCustomer.id);
      localStorage.setItem('pendingCustomers', JSON.stringify(updatedPending));
      
      // 승인된 고객사 데이터 준비 (고객사 찾기에서 사용할 형식으로 변환)
      // 비밀번호 필드는 제외
      const { password, ...customerWithoutPassword } = pendingCustomer;
      const approvedCustomer = {
        ...customerWithoutPassword,
        id: `c-${Date.now()}`, // 새로운 ID 생성
        status: 'approved',
        submittedAt: pendingCustomer.submittedAt || new Date().toISOString(), // 신청일
        approvedAt: new Date().toISOString(), // 승인일
        // 필요한 필드 정규화
        requiredArea: parseFloat(pendingCustomer.requiredArea) || 0,
        monthlyVolume: parseFloat(pendingCustomer.monthlyVolume) || 0,
        palletCount: parseFloat(pendingCustomer.palletCount) || 0,
        desiredDelivery: Array.isArray(pendingCustomer.desiredDelivery) 
          ? pendingCustomer.desiredDelivery 
          : pendingCustomer.delivery || []
      };
      
      // 승인된 고객사를 localStorage에 저장 (고객사 찾기에서 사용)
      const approvedCustomers = JSON.parse(localStorage.getItem('approvedCustomers') || '[]');
      approvedCustomers.push(approvedCustomer);
      localStorage.setItem('approvedCustomers', JSON.stringify(approvedCustomers));
      
      setCustomers(prev => [...prev, approvedCustomer]);
      
      // 대기 목록에서 제거
      setPendingCustomerList(prev => prev.filter(c => c.id !== pendingCustomer.id));
      
      alert('고객사가 승인되었습니다.');
    }
  };

  // 고객사 거부
  const handleRejectCustomer = (id) => {
    if (window.confirm('이 고객사 등록을 거부하시겠습니까?')) {
      // users 배열에서 해당 사용자의 status 업데이트
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => 
        user.id === id 
          ? { ...user, status: 'rejected' }
          : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // pendingCustomers에서도 제거
      const pendingCustomers = JSON.parse(localStorage.getItem('pendingCustomers') || '[]');
      const updatedPending = pendingCustomers.filter(c => c.id !== id);
      localStorage.setItem('pendingCustomers', JSON.stringify(updatedPending));
      
      setPendingCustomerList(prev => prev.filter(c => c.id !== id));
      alert('고객사 등록이 거부되었습니다.');
    }
  };

  // 상세보기 핸들러
  const handleViewDetails = (item, type) => {
    setSelectedItem(item);
    setSelectedItemType(type);
    setIsDetailModalOpen(true);
  };

  const stats = {
    totalWarehouses: warehouses.length,
    totalCustomers: customers.length,
    premiumWarehouses: warehouses.filter(w => w.isPremium).length,
    totalArea: warehouses.reduce((sum, w) => sum + w.totalArea, 0),
    availableArea: warehouses.reduce((sum, w) => sum + w.availableArea, 0),
    totalMonthlyVolume: customers.reduce((sum, c) => sum + c.monthlyVolume, 0),
    pendingWarehouses: pendingWarehouseList.length,
    pendingCustomers: pendingCustomerList.length
  };

  const regionStats = warehouses.reduce((acc, warehouse) => {
    acc[warehouse.location] = (acc[warehouse.location] || 0) + 1;
    return acc;
  }, {});

  const topRegions = Object.entries(regionStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 탭 네비게이션 */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              개요
            </button>
            <button
              onClick={() => setActiveTab('warehouses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'warehouses'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              창고 관리
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'customers'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              고객사 관리
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              검토 중인 항목 ({stats.pendingWarehouses + stats.pendingCustomers})
            </button>
          </nav>
        </div>

        {/* 개요 탭 */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Building2 className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">총 창고 수</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalWarehouses}개</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">총 고객사 수</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalCustomers}개</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">프리미엄 창고</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.premiumWarehouses}개</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">총 면적</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalArea.toLocaleString()}㎡
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 통계 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">면적 현황</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">총 면적</span>
                    <span className="font-medium">{stats.totalArea.toLocaleString()}㎡</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">이용가능 면적</span>
                    <span className="font-medium text-green-600">{stats.availableArea.toLocaleString()}㎡</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">이용률</span>
                    <span className="font-medium">
                      {((stats.availableArea / stats.totalArea) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">지역별 창고 현황</h3>
                <div className="space-y-2">
                  {topRegions.map(([region, count]) => (
                    <div key={region} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{region}</span>
                      </div>
                      <span className="font-medium">{count}개</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 월 평균 출고량 */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">고객사 월 평균 출고량</h3>
              <div className="text-3xl font-bold text-primary-600">
                {stats.totalMonthlyVolume.toLocaleString()}개
              </div>
            </div>
          </div>
        )}

        {/* 창고 관리 탭 */}
        {activeTab === 'warehouses' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">창고 관리</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      회사명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      지역
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      면적
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      보관방식
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      프리미엄
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      신청일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      승인일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      연락처
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {warehouses.sort((a, b) => {
                    const getSortDate = (item) => {
                      if (item.approvedAt) return new Date(item.approvedAt).getTime();
                      if (item.submittedAt) return new Date(item.submittedAt).getTime();
                      if (typeof item.id === 'string' && item.id.includes('-')) {
                        const timestamp = item.id.split('-').pop();
                        return parseInt(timestamp) || 0;
                      }
                      return typeof item.id === 'number' ? item.id : 0;
                    };
                    return getSortDate(b) - getSortDate(a);
                  }).map((warehouse) => (
                    <tr key={warehouse.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {warehouse.companyName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{warehouse.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {warehouse.availableArea.toLocaleString()}㎡ / {warehouse.totalArea.toLocaleString()}㎡
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{warehouse.temperature}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {warehouse.isPremium ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            프리미엄
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            일반
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {warehouse.submittedAt 
                            ? new Date(warehouse.submittedAt).toLocaleDateString('ko-KR')
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {warehouse.approvedAt 
                            ? new Date(warehouse.approvedAt).toLocaleDateString('ko-KR')
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>{warehouse.phone}</div>
                          <div className="text-gray-500">{warehouse.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewDetails(warehouse, 'warehouse')}
                            className="text-primary-600 hover:text-primary-900"
                            title="자세히 보기"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteWarehouse(warehouse.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 고객사 관리 탭 */}
        {activeTab === 'customers' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">고객사 관리</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      회사명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      지역
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      필요면적
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      월 출고량
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      취급물품
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      신청일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      승인일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      연락처
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.sort((a, b) => {
                    const getSortDate = (item) => {
                      if (item.approvedAt) return new Date(item.approvedAt).getTime();
                      if (item.submittedAt) return new Date(item.submittedAt).getTime();
                      if (typeof item.id === 'string' && item.id.includes('-')) {
                        const timestamp = item.id.split('-').pop();
                        return parseInt(timestamp) || 0;
                      }
                      return typeof item.id === 'number' ? item.id : 0;
                    };
                    return getSortDate(b) - getSortDate(a);
                  }).map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.companyName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.requiredArea.toLocaleString()}㎡
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.monthlyVolume.toLocaleString()}개
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.products.join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.submittedAt 
                            ? new Date(customer.submittedAt).toLocaleDateString('ko-KR')
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.approvedAt 
                            ? new Date(customer.approvedAt).toLocaleDateString('ko-KR')
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>{customer.phone}</div>
                          <div className="text-gray-500">{customer.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewDetails(customer, 'customer')}
                            className="text-primary-600 hover:text-primary-900"
                            title="자세히 보기"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 검토 중인 항목 탭 */}
        {activeTab === 'pending' && (
          <div className="space-y-8">
            {/* 검토 중인 창고 */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">검토 중인 창고 ({pendingWarehouseList.length}개)</h3>
                </div>
              </div>
              {pendingWarehouseList.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  검토 중인 창고가 없습니다.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          회사명
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          지역
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          면적
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          보관방식
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          신청일
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          액션
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingWarehouseList.sort((a, b) => {
                        const getSortDate = (item) => {
                          if (item.submittedAt) return new Date(item.submittedAt).getTime();
                          if (typeof item.id === 'string' && item.id.includes('-')) {
                            const timestamp = item.id.split('-').pop();
                            return parseInt(timestamp) || 0;
                          }
                          return typeof item.id === 'number' ? item.id : 0;
                        };
                        return getSortDate(b) - getSortDate(a);
                      }).map((warehouse) => (
                        <tr key={warehouse.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {warehouse.companyName}
                            </div>
                            <div className="text-sm text-gray-500">{warehouse.representative}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{warehouse.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {warehouse.availableArea.toLocaleString()}㎡ / {warehouse.totalArea.toLocaleString()}㎡
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{warehouse.temperature}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {warehouse.submittedAt 
                                ? new Date(warehouse.submittedAt).toLocaleDateString('ko-KR')
                                : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleApproveWarehouse(warehouse)}
                                className="text-green-600 hover:text-green-900 flex items-center"
                                title="승인"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                승인
                              </button>
                              <button 
                                onClick={() => handleRejectWarehouse(warehouse.id)}
                                className="text-red-600 hover:text-red-900 flex items-center"
                                title="거부"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                거부
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 검토 중인 고객사 */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">검토 중인 고객사 ({pendingCustomerList.length}개)</h3>
                </div>
              </div>
              {pendingCustomerList.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  검토 중인 고객사가 없습니다.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          회사명
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          지역
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          필요면적
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          월 출고량
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          취급물품
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          신청일
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          액션
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingCustomerList.sort((a, b) => {
                        const getSortDate = (item) => {
                          if (item.submittedAt) return new Date(item.submittedAt).getTime();
                          if (typeof item.id === 'string' && item.id.includes('-')) {
                            const timestamp = item.id.split('-').pop();
                            return parseInt(timestamp) || 0;
                          }
                          return typeof item.id === 'number' ? item.id : 0;
                        };
                        return getSortDate(b) - getSortDate(a);
                      }).map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.companyName}
                            </div>
                            <div className="text-sm text-gray-500">{customer.representative}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{customer.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {customer.requiredArea.toLocaleString()}㎡
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {customer.monthlyVolume.toLocaleString()}개
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {customer.products.join(', ')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {customer.submittedAt 
                                ? new Date(customer.submittedAt).toLocaleDateString('ko-KR')
                                : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleApproveCustomer(customer)}
                                className="text-green-600 hover:text-green-900 flex items-center"
                                title="승인"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                승인
                              </button>
                              <button 
                                onClick={() => handleRejectCustomer(customer.id)}
                                className="text-red-600 hover:text-red-900 flex items-center"
                                title="거부"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                거부
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 상세보기 모달 */}
      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedItem}
        type={selectedItemType}
      />
    </div>
  );
};

export default AdminDashboard;
