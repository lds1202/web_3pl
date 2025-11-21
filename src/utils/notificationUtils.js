/**
 * 알림 관리 유틸리티
 */

/**
 * 알림 생성
 */
export const createNotification = (userId, type, title, message) => {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  
  const notification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString()
  };

  notifications.push(notification);
  localStorage.setItem('notifications', JSON.stringify(notifications));
  
  // 브라우저 알림 (권한이 있는 경우)
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/favicon.ico'
    });
  }

  return notification;
};

/**
 * 알림 권한 요청
 */
export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return Notification.permission === 'granted';
};

/**
 * 읽지 않은 알림 개수 조회
 */
export const getUnreadNotificationCount = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser) return 0;

  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  return notifications.filter(n => n.userId === currentUser.id && !n.read).length;
};

