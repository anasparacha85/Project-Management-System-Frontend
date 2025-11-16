import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../Slices/NotificationSLice";

export const SocketContext = createContext();


export const SocketProvider = ({ children }) => {
  const { user,token } = useSelector((state) => state.User);
  const dispatch = useDispatch();
const [first, setfirst] = useState("first")
 const socket = io(import.meta.env.VITE_LOCAL_API_URL, {
    withCredentials: true,
    transports: ["websocket"],
    auth: {
      token: token, // ✔ token must be sent here
    },
  });

 useEffect(() => {
    if (!user?._id) return;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    // receiving notifications
    socket.on("new-notification", (data) => {
      console.log("📩 New notification received:", data);
      dispatch(addNotification(data));
    });

    return () => {
      socket.off("connect");
      socket.off("new-notification");
    };
  }, [user?._id]);



  return <SocketContext.Provider value={{socket,first}}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const contextvalue = useContext(SocketContext);
  if (!contextvalue) {
    throw new Error("useSocket must be inside StoreContextProvider");
  }
  return contextvalue;
};

