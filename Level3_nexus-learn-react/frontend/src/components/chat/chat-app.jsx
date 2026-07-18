import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, Plus, Loader2, X } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/hooks/useAuth";
import { conversationService } from "@/services/conversationService";
import { cn } from "@/lib/utils";

function otherParticipant(conversation, myId) {
  return conversation.participants.find((p) => p._id !== myId) || conversation.participants[0];
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function ContactPicker({ onPick, onClose }) {
  const { data, isLoading } = useQuery({
    queryKey: ["conversations", "contacts"],
    queryFn: conversationService.contacts,
  });
  const contacts = data?.data?.contacts || [];

  return (
    <div className="absolute inset-0 z-10 flex flex-col rounded-lg bg-surface">
      <div className="flex items-center justify-between border-b border-border p-3">
        <p className="text-sm font-semibold">Start a conversation</p>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <Loader2 className="mx-auto mt-6 size-5 animate-spin text-muted-foreground" />
        ) : contacts.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">
            No one available to message yet.
          </p>
        ) : (
          contacts.map((c) => (
            <button
              key={c._id}
              onClick={() => onPick(c._id)}
              className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-glass"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full gradient-signature text-sm font-semibold text-white">
                {c.name[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs capitalize text-muted-foreground">{c.role}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export function ChatApp() {
  const { user } = useAuth();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  const { data: conversationsData } = useQuery({
    queryKey: ["conversations"],
    queryFn: conversationService.list,
  });
  const conversations = conversationsData?.data?.conversations || [];
  const activeConversation = conversations.find((c) => c._id === activeId);

  // Load history + join the socket room whenever the active conversation changes.
  useEffect(() => {
    if (!activeId || !socket) return;

    let cancelled = false;

    socket.emit("conversation:join", activeId);
    conversationService.messages(activeId).then((res) => {
      if (!cancelled) setMessages(res.data.messages);
    });
    conversationService.markRead(activeId).then(() => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    return () => {
      cancelled = true;
    };
  }, [activeId, socket, queryClient]);

  // Listen for new messages in real time.
  useEffect(() => {
    if (!socket) return;

    function handleNewMessage(message) {
      if (message.conversation === activeId) {
        setMessages((prev) => [...prev, message]);
      }
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }

    socket.on("message:new", handleNewMessage);
    return () => socket.off("message:new", handleNewMessage);
  }, [socket, activeId, queryClient]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handlePickContact(participantId) {
    conversationService.start(participantId).then((res) => {
      setShowPicker(false);
      setMessages([]);
      queryClient.invalidateQueries({ queryKey: ["conversations"] }).then(() => {
        setActiveId(res.data.conversation._id);
      });
    });
  }

  function handleSend(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !activeId || !socket) return;

    setSending(true);
    socket.emit("message:send", { conversationId: activeId, text }, (ack) => {
      setSending(false);
      if (ack?.ok) setDraft("");
    });
  }

  return (
    <div className="grid h-[calc(100vh-160px)] grid-cols-1 gap-4 md:grid-cols-[280px_1fr]">
      <GlassCard className="relative flex flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border p-3">
          <p className="text-sm font-semibold">Conversations</p>
          <Button size="sm" variant="ghost" onClick={() => setShowPicker(true)}>
            <Plus className="size-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-1.5">
          {conversations.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No conversations yet.
            </p>
          ) : (
            conversations.map((c) => {
              const other = otherParticipant(c, user?._id);
              return (
                <button
                  key={c._id}
                  onClick={() => {
                    setActiveId(c._id);
                    setMessages([]);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md p-2.5 text-left",
                    activeId === c._id ? "bg-primary/10" : "hover:bg-glass"
                  )}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full gradient-signature text-sm font-semibold text-white">
                    {other?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{other?.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.lastMessageText || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {showPicker && (
          <ContactPicker onPick={handlePickContact} onClose={() => setShowPicker(false)} />
        )}
      </GlassCard>

      <GlassCard className="flex flex-col overflow-hidden p-0">
        {!activeConversation ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Select a conversation, or start a new one.
          </div>
        ) : (
          <>
            <div className="border-b border-border p-3">
              <p className="text-sm font-semibold">
                {otherParticipant(activeConversation, user?._id)?.name}
              </p>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => {
                const mine = m.sender._id === user?._id;
                return (
                  <div key={m._id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                        mine ? "gradient-signature text-white" : "glass"
                      )}
                    >
                      <p>{m.text}</p>
                      <p
                        className={cn(
                          "mt-1 text-[10px]",
                          mine ? "text-white/70" : "text-muted-foreground"
                        )}
                      >
                        {formatTime(m.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSend} className="flex gap-2 border-t border-border p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:border-accent"
              />
              <Button type="submit" size="icon" disabled={sending || !draft.trim()}>
                {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </form>
          </>
        )}
      </GlassCard>
    </div>
  );
}
