import { useEffect, useState } from 'react';

const NotificationBell = ({ userRole }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  // Animation flags for bell and badge
  const [animateBell, setAnimateBell] = useState(false);
  const [animateBadge, setAnimateBadge] = useState(false);

  // Trigger a brief animation whenever unread count changes (>0)
  useEffect(() => {
    if (unreadCount > 0) {
      setAnimateBell(true);
      setAnimateBadge(true);
      const t = setTimeout(() => {
        setAnimateBell(false);
        setAnimateBadge(false);
      }, 700);
      return () => clearTimeout(t);
    }
  }, [unreadCount]);

  useEffect(() => {
    if (userRole) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userRole]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem(`${userRole}Token`);
      if (!token) return;
      
      console.log('Fetching notifications for role:', userRole);
      const response = await fetch(`http://localhost:5000/api/notifications/${userRole}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Notifications response:', data);
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } else {
        console.error('Failed to fetch notifications:', data.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem(`${userRole}Token`);
      if (!token) return;
      
      await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem(`${userRole}Token`);
      if (!token) return;
      
      await fetch(`http://localhost:5000/api/notifications/${userRole}/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div 
        onClick={() => userRole && setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          cursor: userRole ? 'pointer' : 'default',
          padding: '8px',
          borderRadius: '50%',
          transition: 'background-color 0.2s',
          backgroundColor: unreadCount > 0 ? '#e3f2fd' : 'transparent'
        }}
      >
        <i className={`fa fa-bell ${animateBell ? 'bell-wiggle' : ''}`} style={{ fontSize: '18px' }}></i>
        {userRole && unreadCount > 0 && (
          <span className={`notif-badge ${animateBadge ? 'badge-pop' : ''}`} style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: '#ff4444',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unreadCount}
          </span>
        )}
      </div>

      {userRole && isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          width: '300px',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h4 style={{ margin: 0, fontSize: '16px' }}>Notifications</h4>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => !notification.isRead && markAsRead(notification._id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    backgroundColor: !notification.isRead ? '#e3f2fd' : 'white',
                    borderLeft: !notification.isRead ? '3px solid #007bff' : 'none'
                  }}
                >
                  <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600 }}>
                    {notification.title}
                  </h5>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666', whiteSpace: 'pre-line' }}>
                    {notification.message.length > 150 ? notification.message.substring(0, 150) + '...' : notification.message}
                  </p>
                  <small style={{ color: '#999', fontSize: '11px' }}>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;