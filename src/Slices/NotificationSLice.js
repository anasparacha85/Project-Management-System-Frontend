import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    unreadCount: 0,
  },
  reducers: {
     setNotifications: (state, action) => {
      state.list = action.payload;        // overwrite
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    },
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAllAsRead: (state) => {
      state.unreadCount = 0;
    },
    resetNotifications: (state) => {
      state.list = [];
      state.unreadCount = 0;
    },
    resetNotificationCount: (state) => {
      state.unreadCount = 0;
  },
}
});

export const { addNotification, markAllAsRead, setNotifications, resetNotifications ,resetNotificationCount} = notificationSlice.actions;
export default notificationSlice.reducer;
