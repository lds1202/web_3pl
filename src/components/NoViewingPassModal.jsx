import React from 'react';
import { X, CreditCard, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NoViewingPassModal = ({ isOpen, onClose, onLogin, onSignup }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const isLoggedIn = !!currentUser;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <h2 className="text-lg font-bold text-gray-900">열람권 안내</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-4 text-center">
          {!isLoggedIn ? (
            <>
              <p className="text-gray-700 mb-4">
                상세 정보를 보시려면 <strong>로그인</strong>이 필요합니다.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onClose();
                    if (onLogin) {
                      onLogin();
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  로그인
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onSignup) {
                      onSignup();
                    } else {
                      navigate('/warehouse-register');
                    }
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  회원가입
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <CreditCard className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                <p className="text-gray-700 mb-2">
                  보유 중인 <strong>열람권이 없습니다</strong>.
                </p>
                <p className="text-sm text-gray-600">
                  상세 정보를 보시려면 열람권을 구매해주세요.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate('/payment');
                }}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                열람권 구매하기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoViewingPassModal;

