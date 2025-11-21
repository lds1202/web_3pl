import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, CreditCard, Building2, Users } from 'lucide-react';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = () => {
    const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (currentUser) {
      const userNotifications = stored
        .filter(n => n.userId === currentUser.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(userNotifications);
    }
  };

  const markAsRead = (notificationId) => {
    const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = stored.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updated));
    loadNotifications();
  };

  const deleteNotification = (notificationId) => {
    const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = stored.filter(n => n.id !== notificationId);
    localStorage.setItem('notifications', JSON.stringify(updated));
    loadNotifications();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'purchase':
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'expiry':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'new_company':
        return <Building2 className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-[90vh] flex flex-col my-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">알림 센터</h2>
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 알림 목록 */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>알림이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-5 rounded-lg border ${
                    notification.read
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className={`font-semibold text-base ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </p>
                        <div className="flex gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 hover:bg-blue-100 rounded transition-colors"
                              title="읽음 표시"
                            >
                              읽음
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-800 px-2 py-1 hover:bg-red-100 rounded transition-colors"
                            title="삭제"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 닫기 버튼 (오른쪽 하단) */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;

