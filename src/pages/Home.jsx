import React, { useState, useEffect } from 'react';
import { Search, Building2, Users, Star, ArrowRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { warehouseData, customerData } from '../data/sampleData';
import { formatArea } from '../utils/areaConverter';
import DetailModal from '../components/DetailModal';
import ViewingPassConfirmModal from '../components/ViewingPassConfirmModal';
import ViewingPassExpiredModal from '../components/ViewingPassExpiredModal';
import ExpiryWarningModal from '../components/ExpiryWarningModal';
import NoViewingPassModal from '../components/NoViewingPassModal';
import { 
  checkViewingPass, 
  isExpired, 
  isAlreadyViewed, 
  useViewingPass,
  getViewingPassInfo,
  shouldShowExpiryWarning,
  getDisplayName
} from '../utils/viewingPassUtils';
import { isPremiumActive, getItemPremiumApplications } from '../utils/premiumUtils';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false);
  const [isExpiryWarningOpen, setIsExpiryWarningOpen] = useState(false);
  const [isNoPassModalOpen, setIsNoPassModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [pendingItemType, setPendingItemType] = useState(null);

  const [allWarehouses, setAllWarehouses] = useState(warehouseData);
  const [allCustomers, setAllCustomers] = useState(customerData);

  // 로그인 상태 확인 및 승인된 데이터 로드
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    setIsLoggedIn(!!currentUser);

    // localStorage에서 승인된 창고와 고객사 가져오기
    const approvedWarehouses = JSON.parse(localStorage.getItem('approvedWarehouses') || '[]');
    const approvedCustomers = JSON.parse(localStorage.getItem('approvedCustomers') || '[]');
    
    // sampleData와 승인된 데이터 합치기 (중복 제거)
    const existingWarehouseIds = warehouseData.map(w => w.id);
    const newWarehouses = approvedWarehouses.filter(w => w && !existingWarehouseIds.includes(w.id));
    setAllWarehouses([...warehouseData, ...newWarehouses]);

    const existingCustomerIds = customerData.map(c => c.id);
    const newCustomers = approvedCustomers.filter(c => c && !existingCustomerIds.includes(c.id));
    setAllCustomers([...customerData, ...newCustomers]);

    // 만료 전 알림 확인 (7일 전)
    if (currentUser) {
      const passInfo = getViewingPassInfo();
      if (passInfo && shouldShowExpiryWarning(passInfo)) {
        // 이미 알림을 표시했는지 확인
        const lastWarning = localStorage.getItem(`expiryWarning_${passInfo.id}`);
        const today = new Date().toDateString();
        if (lastWarning !== today) {
          setIsExpiryWarningOpen(true);
          localStorage.setItem(`expiryWarning_${passInfo.id}`, today);
        }
      }
    }
  }, []);

  // 정렬 함수
  const getSortDate = (item) => {
    if (item.approvedAt) return new Date(item.approvedAt).getTime();
    if (item.submittedAt) return new Date(item.submittedAt).getTime();
    if (typeof item.id === 'string' && item.id.includes('-')) {
      const timestamp = item.id.split('-').pop();
      return parseInt(timestamp) || 0;
    }
    return typeof item.id === 'number' ? item.id : 0;
  };

  // 프리미엄 상태 업데이트
  const warehousesWithPremium = allWarehouses.map(w => ({
    ...w,
    isPremium: isPremiumActive(w.id, 'warehouse') || w.isPremium
  }));

  const customersWithPremium = allCustomers.map(c => ({
    ...c,
    isPremium: isPremiumActive(c.id, 'customer') || c.isPremium
  }));

  // 프리미엄 창고 (활성 프리미엄만, 최근 신청 순, 모두 표시)
  const premiumWarehouses = warehousesWithPremium
    .filter(w => w.isPremium && isPremiumActive(w.id, 'warehouse'))
    .sort((a, b) => {
      const aApps = getItemPremiumApplications(a.id, 'warehouse');
      const bApps = getItemPremiumApplications(b.id, 'warehouse');
      if (aApps.length > 0 && bApps.length > 0) {
        return new Date(bApps[0].createdAt) - new Date(aApps[0].createdAt);
      }
      if (aApps.length > 0) return -1;
      if (bApps.length > 0) return 1;
      return getSortDate(b) - getSortDate(a);
    });

  // 프리미엄 고객사 (활성 프리미엄만, 최근 신청 순, 모두 표시)
  const premiumCustomers = customersWithPremium
    .filter(c => c.isPremium && isPremiumActive(c.id, 'customer'))
    .sort((a, b) => {
      const aApps = getItemPremiumApplications(a.id, 'customer');
      const bApps = getItemPremiumApplications(b.id, 'customer');
      if (aApps.length > 0 && bApps.length > 0) {
        return new Date(bApps[0].createdAt) - new Date(aApps[0].createdAt);
      }
      if (aApps.length > 0) return -1;
      if (bApps.length > 0) return 1;
      return getSortDate(b) - getSortDate(a);
    });

  // 최신 창고 6개 (프리미엄 제외, 최신순 정렬)
  const latestWarehouses = warehousesWithPremium
    .filter(w => !w.isPremium || !isPremiumActive(w.id, 'warehouse'))
    .sort((a, b) => getSortDate(b) - getSortDate(a))
    .slice(0, 6);

  // 최신 고객사 6개 (프리미엄 제외, 최신순 정렬)
  const latestCustomers = customersWithPremium
    .filter(c => !c.isPremium || !isPremiumActive(c.id, 'customer'))
    .sort((a, b) => getSortDate(b) - getSortDate(a))
    .slice(0, 6);

  const handleWarehouseSearch = () => {
    navigate('/warehouse-search');
  };

  const handleCustomerSearch = () => {
    navigate('/customer-search');
  };

  const handleWarehouseRegister = () => {
    navigate('/warehouse-register');
  };

  const handleCustomerRegister = () => {
    navigate('/customer-register');
  };

  const handleDetailView = (item, type) => {
    // 관리자 체크
    const isAdmin = localStorage.getItem('adminAuth') === 'true';
    if (isAdmin) {
      // 관리자는 열람권 없이 바로 표시
      setSelectedItem(item);
      setSelectedItemType(type);
      setIsDetailModalOpen(true);
      return;
    }

    // 로그인 확인
    if (!isLoggedIn) {
      setPendingItem(item);
      setPendingItemType(type);
      setIsNoPassModalOpen(true);
      return;
    }

    // 유효기간 확인
    const passInfo = getViewingPassInfo();
    if (passInfo && isExpired(passInfo)) {
      setPendingItem(item);
      setPendingItemType(type);
      setIsExpiredModalOpen(true);
      return;
    }

    // 이미 본 항목인지 확인
    if (isAlreadyViewed(item.id, type)) {
      // 이미 본 항목이면 열람권 소진 없이 바로 표시
      setSelectedItem(item);
      setSelectedItemType(type);
      setIsDetailModalOpen(true);
      return;
    }

    // 열람권 보유 확인
    if (!checkViewingPass()) {
      // 열람권이 없으면 모달 표시
      setPendingItem(item);
      setPendingItemType(type);
      setIsNoPassModalOpen(true);
      return;
    }

    // 열람권이 있으면 확인 모달 표시
    setPendingItem(item);
    setPendingItemType(type);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmView = () => {
    if (!pendingItem || !pendingItemType) return;

    const result = useViewingPass(
      pendingItem.id,
      pendingItemType,
      pendingItem.companyName
    );

    if (result.success) {
      setIsConfirmModalOpen(false);
      setSelectedItem(pendingItem);
      setSelectedItemType(pendingItemType);
      setIsDetailModalOpen(true);
      setPendingItem(null);
      setPendingItemType(null);
    } else {
      alert(result.message);
      if (result.expired) {
        setIsConfirmModalOpen(false);
        setIsExpiredModalOpen(true);
      }
    }
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedItem(null);
    setSelectedItemType(null);
  };

  return (
    <div className="bg-gray-50">
      {/* 배너 섹션 */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            물류대행 플랫폼
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-blue-100 max-w-4xl mx-auto">
            화주사와 물류 창고업체를 연결하는 스마트한 매칭 서비스
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <button 
              onClick={handleWarehouseSearch}
              className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold transition-colors w-full sm:w-auto"
            >
              창고 찾기
            </button>
            <button 
              onClick={handleCustomerSearch}
              className="bg-white text-primary-600 hover:bg-gray-100 px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold transition-colors w-full sm:w-auto"
            >
              고객사 찾기
            </button>
          </div>
        </div>
      </section>

      {/* 메인 섹션들 */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 창고 찾기 섹션 */}
          <div className="mb-12 md:mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
              <div className="flex items-center">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mr-2 sm:mr-3" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">창고 찾기</h2>
              </div>
              <a 
                href="/warehouse-search" 
                className="flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm sm:text-base"
              >
                전체보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>

            {/* 프리미엄 창고 광고 - 모두 표시 */}
            {premiumWarehouses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 md:mb-8">
                {premiumWarehouses.map((warehouse) => {
                  const isViewed = isAlreadyViewed(warehouse.id, 'warehouse');
                  return (
                  <div key={warehouse.id} className="bg-white rounded-lg shadow-lg p-6 border-2 border-secondary-500 relative">
                    <button
                      onClick={() => {
                        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
                        if (!currentUser) {
                          alert('프리미엄 신청을 하려면 로그인이 필요합니다.');
                          return;
                        }
                        navigate(`/premium-apply?type=warehouse&itemId=${warehouse.id}`);
                      }}
                      className="absolute top-4 right-4 bg-secondary-500 text-white px-2 py-1 rounded text-sm font-semibold hover:bg-secondary-600 transition-colors cursor-pointer"
                    >
                      프리미엄
                    </button>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{getDisplayName(warehouse, 'warehouse')}</h3>
                      {isViewed && (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          열람
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{warehouse.location} {warehouse.city} {warehouse.dong}</p>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">이용가능면적:</span> {formatArea(warehouse.availableArea)}</p>
                      <p><span className="font-semibold">총면적:</span> {formatArea(warehouse.totalArea)}</p>
                      <p><span className="font-semibold">보관방식:</span> {warehouse.temperature}</p>
                      <p><span className="font-semibold">경력:</span> {warehouse.experience}</p>
                    </div>
                    <button 
                      onClick={() => handleDetailView(warehouse, 'warehouse')}
                      className="w-full mt-4 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      자세히 보기
                    </button>
                  </div>
                  );
                })}
              </div>
            )}

            {/* 일반 창고 리스트 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {latestWarehouses.map((warehouse) => {
                const isViewed = isAlreadyViewed(warehouse.id, 'warehouse');
                return (
                <div key={warehouse.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{getDisplayName(warehouse, 'warehouse')}</h3>
                    {isViewed && (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        열람
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{warehouse.location} {warehouse.city} {warehouse.dong}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>이용가능면적: {formatArea(warehouse.availableArea)}</p>
                    <p>총면적: {formatArea(warehouse.totalArea)}</p>
                    <p>보관방식: {warehouse.temperature}</p>
                  </div>
                  <button 
                    onClick={() => handleDetailView(warehouse, 'warehouse')}
                    className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    자세히 보기
                  </button>
                </div>
                );
              })}
            </div>
          </div>

          {/* 고객사 찾기 섹션 */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
              <div className="flex items-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mr-2 sm:mr-3" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">고객사 찾기</h2>
              </div>
              <a 
                href="/customer-search" 
                className="flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm sm:text-base"
              >
                전체보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>

            {/* 프리미엄 고객사 광고 - 모두 표시 */}
            {premiumCustomers.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 md:mb-8">
                {premiumCustomers.map((customer) => {
                  const isViewed = isAlreadyViewed(customer.id, 'customer');
                  return (
                  <div key={customer.id} className="bg-white rounded-lg shadow-lg p-6 border-2 border-secondary-500 relative">
                    <button
                      onClick={() => {
                        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
                        if (!currentUser) {
                          alert('프리미엄 신청을 하려면 로그인이 필요합니다.');
                          return;
                        }
                        navigate(`/premium-apply?type=customer&itemId=${customer.id}`);
                      }}
                      className="absolute top-4 right-4 bg-secondary-500 text-white px-2 py-1 rounded text-sm font-semibold hover:bg-secondary-600 transition-colors cursor-pointer"
                    >
                      프리미엄
                    </button>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{getDisplayName(customer, 'customer')}</h3>
                      {isViewed && (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          열람
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{customer.location} {customer.city} {customer.dong}</p>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">필요면적:</span> {formatArea(customer.requiredArea)}</p>
                      <p><span className="font-semibold">월평균출고량:</span> {customer.monthlyVolume.toLocaleString()}개</p>
                      <p><span className="font-semibold">취급물품:</span> {customer.products.join(', ')}</p>
                    </div>
                    <button 
                      onClick={() => handleDetailView(customer, 'customer')}
                      className="w-full mt-4 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      자세히 보기
                    </button>
                  </div>
                  );
                })}
              </div>
            )}

            {/* 일반 고객사 리스트 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {latestCustomers.map((customer) => {
                const isViewed = isAlreadyViewed(customer.id, 'customer');
                return (
                <div key={customer.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{getDisplayName(customer, 'customer')}</h3>
                    {isViewed && (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        열람
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{customer.location} {customer.city} {customer.dong}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>필요면적: {formatArea(customer.requiredArea)}</p>
                    <p>월평균출고량: {customer.monthlyVolume.toLocaleString()}개</p>
                    <p>취급물품: {customer.products.join(', ')}</p>
                  </div>
                  <button 
                    onClick={() => handleDetailView(customer, 'customer')}
                    className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    자세히 보기
                  </button>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="bg-primary-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">지금 시작하세요</h2>
          <p className="text-lg sm:text-xl mb-6 md:mb-8 text-blue-100 max-w-2xl mx-auto">
            무료로 회원가입하고 최적의 물류 파트너를 찾아보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <button 
              onClick={handleWarehouseRegister}
              className="bg-white text-primary-600 hover:bg-gray-100 px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold transition-colors w-full sm:w-auto"
            >
              창고업체 등록
            </button>
            <button 
              onClick={handleCustomerRegister}
              className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold transition-colors w-full sm:w-auto"
            >
              고객사 등록
            </button>
          </div>
        </div>
      </section>

      {/* 상세 정보 모달 */}
      {isDetailModalOpen && selectedItem && (
        <DetailModal
          isOpen={isDetailModalOpen}
          data={selectedItem}
          type={selectedItemType}
          onClose={handleCloseModal}
        />
      )}

      {/* 열람권 소진 확인 모달 */}
      {pendingItem && (
        <ViewingPassConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
            setPendingItem(null);
            setPendingItemType(null);
          }}
          onConfirm={handleConfirmView}
          currentCount={getViewingPassInfo()?.remainingCount || 0}
          itemName={pendingItem.companyName}
          itemType={pendingItemType}
        />
      )}

      {/* 열람권 만료 안내 모달 */}
      <ViewingPassExpiredModal
        isOpen={isExpiredModalOpen}
        onClose={() => {
          setIsExpiredModalOpen(false);
          setPendingItem(null);
          setPendingItemType(null);
        }}
        expiryDate={getViewingPassInfo()?.expiryDate}
      />

      {/* 만료 전 알림 모달 (7일 전) */}
      <ExpiryWarningModal
        isOpen={isExpiryWarningOpen}
        onClose={() => setIsExpiryWarningOpen(false)}
        expiryDate={getViewingPassInfo()?.expiryDate}
        onExtend={() => {
          setIsExpiryWarningOpen(false);
          navigate('/payment?action=extend');
        }}
      />

      {/* 열람권 없음 안내 모달 */}
      <NoViewingPassModal
        isOpen={isNoPassModalOpen}
        onClose={() => {
          setIsNoPassModalOpen(false);
          setPendingItem(null);
          setPendingItemType(null);
        }}
        onLogin={() => {
          setIsNoPassModalOpen(false);
          navigate('/login');
        }}
        onSignup={() => {
          setIsNoPassModalOpen(false);
          navigate('/warehouse-register');
        }}
      />
    </div>
  );
};

export default Home;