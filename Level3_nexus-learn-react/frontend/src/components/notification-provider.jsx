import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/authStore";

export function NotificationProvider({ children }) {
  const socket = useSocket();
  const status = useAuthStore((s) => s.status);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (status !== "authenticated" || !socket) return;

    function handleNewNotification(notification) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast(notification.title, {
        description: notification.body || undefined,
        action: notification.link
          ? { label: "View", onClick: () => navigate(notification.link) }
          : undefined,
      });
    }

    socket.on("notification:new", handleNewNotification);
    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socket, status, queryClient, navigate]);

  return children;
}
