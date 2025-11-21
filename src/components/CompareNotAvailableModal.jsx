import React from 'react';
import { X, AlertCircle, Eye } from 'lucide-react';

const CompareNotAvailableModal = ({ 
  isOpen, 
  onClose, 
  notViewedItems 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">비교 불가 안내</h2>
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
            <p className="text-center text-gray-700 mb-2">
              비교하려면 두 업체 모두
            </p>
            <p className="text-center text-gray-700 font-semibold">
              열람권을 사용해서 본 업체여야 합니다.
            </p>
          </div>

          {/* 아직 열람하지 않은 업체 목록 */}
          {notViewedItems && notViewedItems.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                아직 열람하지 않은 업체:
              </p>
              <ul className="space-y-1">
                {notViewedItems.map((item, index) => (
                  <li key={index} className="text-sm text-yellow-800 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    {item.name} ({item.type === 'warehouse' ? '창고' : '고객사'})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              먼저 각 업체를 열람한 후<br />
              비교 기능을 이용하세요.
            </p>
          </div>

          {/* 버튼 */}
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareNotAvailableModal;

