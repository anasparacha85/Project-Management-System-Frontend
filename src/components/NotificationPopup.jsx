import { useSelector, useDispatch } from "react-redux";
import { addNotification, markAllAsRead, resetNotificationCount, resetNotifications, setNotifications } from "../Slices/NotificationSLice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ApiServices from "../ApiService/ApiService";

const NotificationPopup = ({ onClose }) => {
  const { list } = useSelector((state) => state.Notification);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(list,"======");
  
  const handleNotificationClick=async(notificationId,link)=>{
    try {
      await ApiServices.MarkAsReadNotification(notificationId); 
      navigate(link);
      dispatch(resetNotificationCount());
      onClose();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } 
  }

  return (
    <div className="absolute right-5 top-14 w-96 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg">Notifications</h2>
        <button
          className="text-sm text-blue-600"
          onClick={() => dispatch(markAllAsRead())}
        >
          Mark all read
        </button>

      </div>

      <div className="max-h-80 overflow-y-auto">
        {list.length>0?list?.map((n, index) => (
          <div
            key={index}
            onClick={() => handleNotificationClick(n._id,n.link)}
            className={`p-3  my-2 hover:bg-gray-200 ${n.isRead?'bg-gray-100':'bg-gray-300'} cursor-pointer border-b border-gray-100`}
          >
            <p className="font-medium">{n?.title}</p>
            <p className="text-sm text-gray-600">{n?.message}</p>
          </div>
        )):<div>No Notification Yet</div>}
      </div>
    </div>
  );
};

export default NotificationPopup;
