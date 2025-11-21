import React, { useState } from 'react';
import { X, Phone, Mail, CreditCard, Star } from 'lucide-react';

const ContactModal = ({ isOpen, onClose, contactInfo, type }) => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 실제로는 로그인 상태 확인

  const plans = [
    { id: 'single', name: '1회 열람', price: 50, description: '1회만 연락처 열람 가능' },
    { id: 'pack10', name: '10회 패키지', price: 3000, description: '10회 연락처 열람 가능 (1회당 300원)' },
    { id: 'unlimited', name: '무제한 월정액', price: 9900, description: '한 달간 무제한 열람 가능' }
  ];

  if (!isOpen) return null;

  const handlePurchase = () => {
    if (!selectedPlan) return;
    // 실제로는 결제 시스템 연동
    alert('결제가 완료되었습니다!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">연락처 열람</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 연락처 정보 미리보기 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              {type === 'warehouse' ? '창고 정보' : '고객사 정보'}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-gray-600">전화번호: ***-****-****</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-gray-600">이메일: ***@****.com</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              연락처를 보려면 결제가 필요합니다.
            </p>
          </div>

          {/* 로그인 체크 */}
          {!isLoggedIn ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
              <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                로그인하기
              </button>
            </div>
          ) : (
            <>
              {/* 결제 옵션 */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">결제 옵션 선택</h3>
                <div className="space-y-3">
                  {plans.map(plan => (
                    <label
                      key={plan.id}
                      className={`block p-4 border rounded-lg cursor-pointer transition-colors ${selectedPlan === plan.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="plan"
                            value={plan.id}
                            checked={selectedPlan === plan.id}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{plan.name}</div>
                            <div className="text-sm text-gray-600">{plan.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary-600">
                            {plan.price.toLocaleString()}원
                          </div>
                          {plan.id === 'unlimited' && (
                            <div className="text-xs text-gray-500">월정액</div>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 결제 버튼 */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={!selectedPlan}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  결제하기
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
