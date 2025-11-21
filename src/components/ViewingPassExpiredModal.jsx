import React from 'react';
import { X, AlertCircle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ViewingPassExpiredModal = ({ isOpen, onClose, expiryDate }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">열람권 만료 안내</h2>
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
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <p className="text-center text-gray-700 mb-2">
              열람권이 만료되었습니다.
            </p>
          </div>

          {/* 만료 정보 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="space-y-2 text-sm">
              {expiryDate && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">만료일</span>
                    <span className="font-semibold text-gray-900">{formatDate(expiryDate)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              만료된 열람권은 사용할 수 없습니다.<br />
              새로운 열람권을 구매하시겠습니까?
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              닫기
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('/payment');
              }}
              className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              열람권 구매
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewingPassExpiredModal;

