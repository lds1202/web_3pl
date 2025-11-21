import React from 'react';
import { X, AlertCircle, CreditCard, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExpiryWarningModal = ({ isOpen, onClose, expiryDate, onExtend }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const calculateDays = () => {
    if (!expiryDate) return 0;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const remainingDays = calculateDays();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">열람권 만료 임박 안내</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-yellow-500" />
            </div>
            <p className="text-center text-gray-700 mb-2 text-lg font-semibold">
              열람권이 {remainingDays}일 후 만료됩니다.
            </p>
          </div>

          {/* 만료 정보 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-sm font-semibold text-yellow-900">만료일</span>
            </div>
            <p className="text-lg font-bold text-yellow-900">
              {formatDate(expiryDate)}
            </p>
          </div>

          {/* 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              만료 전 연장 시 <strong>10% 할인</strong> 혜택을 받으실 수 있습니다.
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              나중에
            </button>
            <button
              onClick={() => {
                if (onExtend) {
                  onExtend();
                } else {
                  navigate('/payment?action=extend');
                }
                onClose();
              }}
              className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              연장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiryWarningModal;

