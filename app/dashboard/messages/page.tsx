"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Bell,
  FileText,
  Mail,
  Paperclip,
  Search,
  Send,
  User,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import "@/components/styles/dashboard-messages.css";

type ThreadFilter = "all" | "unread" | "drafts";

interface ContactRecord {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

interface ConversationRecord {
  id: string;
  contact_id: string;
  subject: string | null;
  listing_id: string | null;
  last_message_at: string | null;
  is_archived: boolean;
  created_at: string;
  contacts: ContactRecord | ContactRecord[] | null;
}

interface MessageAttachment {
  id: string;
  bucket: string;
  object_path: string;
  file_name: string;
  content_type: string | null;
  byte_size: number | null;
  created_at: string;
}

interface MessageRecord {
  id: string;
  conversation_id: string;
  direction: "inbound" | "outbound";
  source:
    | "contact_page"
    | "contact_agent"
    | "email_webhook"
    | "admin_console"
    | "system";
  status: "draft" | "queued" | "sent" | "delivered" | "failed";
  from_email: string | null;
  to_email: string | null;
  subject: string | null;
  body_text: string | null;
  is_read: boolean;
  failed_reason: string | null;
  created_at: string;
  message_attachments?: MessageAttachment[];
}

interface NotificationRecord {
  id: string;
  admin_user_id: string;
  type: string;
  conversation_id: string | null;
  message_id: string | null;
  title: string | null;
  body: string | null;
  is_read: boolean;
  created_at: string;
}

interface DraftRecord {
  id: string;
  subject: string | null;
  body_text: string | null;
  updated_at: string;
}

interface ConversationSummary {
  id: string;
  contactId: string;
  contactName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  subject: string;
  lastMessageAt: string;
  latestPreview: string;
  latestDirection: "inbound" | "outbound";
  unreadCount: number;
  hasDraft: boolean;
  listingId: string | null;
}

function toArrayContact(
  contact: ContactRecord | ContactRecord[] | null
): ContactRecord | null {
  if (!contact) return null;
  return Array.isArray(contact) ? contact[0] ?? null : contact;
}

function timeLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function normalizeFileName(name: string) {
  return name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");
}

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [threadFilter, setThreadFilter] = useState<ThreadFilter>("all");
  const [adminUserId, setAdminUserId] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [activeDraft, setActiveDraft] = useState<DraftRecord | null>(null);

  const [composerSubject, setComposerSubject] = useState("");
  const [composerBody, setComposerBody] = useState("");
  const [queuedAttachments, setQueuedAttachments] = useState<File[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

  const selectedConversation = useMemo(
    () => conversations.find((item) => item.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId]
  );

  const unreadNotifications = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications]
  );

  const filteredConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return conversations.filter((item) => {
      const byFilter =
        threadFilter === "all"
          ? true
          : threadFilter === "unread"
          ? item.unreadCount > 0
          : item.hasDraft;

      if (!q) return byFilter;

      const indexed = [
        item.contactName,
        item.contactEmail ?? "",
        item.contactPhone ?? "",
        item.subject,
        item.latestPreview,
      ]
        .join(" ")
        .toLowerCase();

      return byFilter && indexed.includes(q);
    });
  }, [conversations, searchQuery, threadFilter]);

  useEffect(() => {
    void initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedConversationId || !adminUserId) return;
    void loadConversationMessages(selectedConversationId, adminUserId);
    void loadDraft(selectedConversationId, adminUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId, adminUserId]);

  const initializeData = async () => {
    setLoading(true);
    setStatusMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setStatusMessage("Could not identify logged-in admin user.");
      setLoading(false);
      return;
    }

    setAdminUserId(user.id);
    setAdminEmail(user.email ?? null);

    await Promise.all([loadConversations(user.id), loadNotifications(user.id)]);
    setLoading(false);
  };

  const loadConversations = async (userId: string) => {
    const { data: conversationRows, error: conversationError } = await supabase
      .from("conversations")
      .select(
        "id, contact_id, subject, listing_id, last_message_at, is_archived, created_at, contacts(id, full_name, email, phone)"
      )
      .eq("is_archived", false)
      .order("last_message_at", { ascending: false, nullsFirst: false });

    if (conversationError || !conversationRows) {
      setStatusMessage("Could not load conversations.");
      return;
    }

    const rows = conversationRows as unknown as ConversationRecord[];
    const conversationIds = rows.map((row) => row.id);

    if (!conversationIds.length) {
      setConversations([]);
      setSelectedConversationId(null);
      return;
    }

    const [{ data: messagesRows }, { data: draftsRows }] = await Promise.all([
      supabase
        .from("messages")
        .select(
          "id, conversation_id, direction, subject, body_text, is_read, created_at"
        )
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: false }),
      supabase
        .from("message_drafts")
        .select("conversation_id")
        .eq("admin_user_id", userId)
        .in("conversation_id", conversationIds),
    ]);

    const latestByConversation = new Map<string, MessageRecord>();
    const unreadByConversation = new Map<string, number>();

    (messagesRows as unknown as MessageRecord[] | null)?.forEach((row) => {
      if (!latestByConversation.has(row.conversation_id)) {
        latestByConversation.set(row.conversation_id, row);
      }
      if (row.direction === "inbound" && !row.is_read) {
        unreadByConversation.set(
          row.conversation_id,
          (unreadByConversation.get(row.conversation_id) ?? 0) + 1
        );
      }
    });

    const draftConversations = new Set(
      (draftsRows as { conversation_id: string }[] | null)?.map(
        (item) => item.conversation_id
      ) ?? []
    );

    const summaries = rows.map((row) => {
      const latest = latestByConversation.get(row.id);
      const contact = toArrayContact(row.contacts);
      const contactName =
        contact?.full_name?.trim() ||
        contact?.email?.trim() ||
        contact?.phone?.trim() ||
        "Unknown Contact";
      return {
        id: row.id,
        contactId: row.contact_id,
        contactName,
        contactEmail: contact?.email ?? null,
        contactPhone: contact?.phone ?? null,
        subject: row.subject || latest?.subject || "General enquiry",
        lastMessageAt: row.last_message_at || row.created_at,
        latestPreview: latest?.body_text || "No messages yet",
        latestDirection: latest?.direction ?? "inbound",
        unreadCount: unreadByConversation.get(row.id) ?? 0,
        hasDraft: draftConversations.has(row.id),
        listingId: row.listing_id,
      } satisfies ConversationSummary;
    });

    setConversations(summaries);
    setSelectedConversationId((prev) => {
      if (prev && summaries.some((item) => item.id === prev)) return prev;
      return summaries[0]?.id ?? null;
    });
  };

  const loadConversationMessages = async (
    conversationId: string,
    userId: string
  ) => {
    const { data: rows, error } = await supabase
      .from("messages")
      .select(
        "id, conversation_id, direction, source, status, from_email, to_email, subject, body_text, is_read, failed_reason, created_at, message_attachments(id, bucket, object_path, file_name, content_type, byte_size, created_at)"
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error || !rows) {
      setStatusMessage("Could not load messages for this contact.");
      return;
    }

    const normalized = rows as unknown as MessageRecord[];
    setMessages(normalized);

    const unreadInboundIds = normalized
      .filter((row) => row.direction === "inbound" && !row.is_read)
      .map((row) => row.id);

    if (unreadInboundIds.length) {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .in("id", unreadInboundIds);
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("admin_user_id", userId)
        .eq("conversation_id", conversationId)
        .eq("is_read", false);
      await Promise.all([loadConversations(userId), loadNotifications(userId)]);
    }
  };

  const loadNotifications = async (userId: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        "id, admin_user_id, type, conversation_id, message_id, title, body, is_read, created_at"
      )
      .eq("admin_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(40);

    if (error || !data) return;
    setNotifications(data as unknown as NotificationRecord[]);
  };

  const loadDraft = async (conversationId: string, userId: string) => {
    const { data } = await supabase
      .from("message_drafts")
      .select("id, subject, body_text, updated_at")
      .eq("conversation_id", conversationId)
      .eq("admin_user_id", userId)
      .maybeSingle();

    const row = data as DraftRecord | null;
    const fallbackSubject =
      conversations.find((item) => item.id === conversationId)?.subject ?? "";
    setActiveDraft(row);
    setComposerSubject(row?.subject ?? fallbackSubject);
    setComposerBody(row?.body_text ?? "");
  };

  const saveDraft = async () => {
    if (!adminUserId || !selectedConversationId) return;
    const content = composerBody.trim();
    const subject = composerSubject.trim();

    if (!content && !subject) {
      await supabase
        .from("message_drafts")
        .delete()
        .eq("conversation_id", selectedConversationId)
        .eq("admin_user_id", adminUserId);
      setActiveDraft(null);
      await loadConversations(adminUserId);
      return;
    }

    const { data, error } = await supabase
      .from("message_drafts")
      .upsert(
        {
          conversation_id: selectedConversationId,
          admin_user_id: adminUserId,
          subject: subject || null,
          body_text: content || null,
        },
        {
          onConflict: "conversation_id,admin_user_id",
        }
      )
      .select("id, subject, body_text, updated_at")
      .single();

    if (error) {
      setStatusMessage("Could not save draft.");
      return;
    }

    setActiveDraft(data as DraftRecord);
    await loadConversations(adminUserId);
    setStatusMessage("Draft saved.");
  };

  const onAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setQueuedAttachments((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeQueuedAttachment = (index: number) => {
    setQueuedAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (!adminUserId || !selectedConversation) return;

    const body = composerBody.trim();
    const subject = composerSubject.trim() || selectedConversation.subject;
    if (!body && !queuedAttachments.length) {
      setStatusMessage("Type a message or attach a file.");
      return;
    }
    if (!selectedConversation.contactEmail) {
      setStatusMessage("This contact has no email address.");
      return;
    }

    setSending(true);
    setStatusMessage("");

    const { data: insertedMessage, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: selectedConversation.id,
        direction: "outbound",
        source: "admin_console",
        status: "queued",
        admin_user_id: adminUserId,
        from_email: adminEmail,
        to_email: selectedConversation.contactEmail,
        subject: subject || null,
        body_text: body || null,
        is_read: true,
      })
      .select("id")
      .single();

    if (messageError || !insertedMessage) {
      setSending(false);
      setStatusMessage("Could not queue this email reply.");
      return;
    }

    const messageId = (insertedMessage as { id: string }).id;

    for (const file of queuedAttachments) {
      const safeName = normalizeFileName(file.name);
      const objectPath = `conversation/${selectedConversation.id}/${crypto.randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("message-attachments")
        .upload(objectPath, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) continue;

      await supabase.from("message_attachments").insert({
        message_id: messageId,
        bucket: "message-attachments",
        object_path: objectPath,
        file_name: file.name,
        content_type: file.type || null,
        byte_size: file.size,
      });
    }

    await supabase
      .from("message_drafts")
      .delete()
      .eq("conversation_id", selectedConversation.id)
      .eq("admin_user_id", adminUserId);

    setComposerBody("");
    setQueuedAttachments([]);
    setActiveDraft(null);
    setSending(false);

    await Promise.all([
      loadConversations(adminUserId),
      loadConversationMessages(selectedConversation.id, adminUserId),
    ]);
    setStatusMessage(
      "Reply queued. Your email worker/provider can now send it to the contact."
    );
  };

  const openAttachment = async (attachment: MessageAttachment) => {
    const { data, error } = await supabase.storage
      .from(attachment.bucket)
      .createSignedUrl(attachment.object_path, 60 * 5);
    if (error || !data?.signedUrl) {
      setStatusMessage("Could not open attachment.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const markNotificationRead = async (notificationId: string) => {
    if (!adminUserId) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("admin_user_id", adminUserId);
    await loadNotifications(adminUserId);
  };

  return (
    <div className="dashboard-overview">
      <div className="messages-layout">
        <aside className="messages-threads">
          <div className="messages-threads-header">
            <h3>Message Inbox</h3>
            <div className="messages-search">
              <Search size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contact, subject, message..."
              />
            </div>
            <div className="messages-filter-row">
              <button
                className={threadFilter === "all" ? "active" : ""}
                onClick={() => setThreadFilter("all")}
              >
                All
              </button>
              <button
                className={threadFilter === "unread" ? "active" : ""}
                onClick={() => setThreadFilter("unread")}
              >
                Unread
              </button>
              <button
                className={threadFilter === "drafts" ? "active" : ""}
                onClick={() => setThreadFilter("drafts")}
              >
                Drafts
              </button>
            </div>
          </div>

          <div className="messages-thread-list">
            {loading ? (
              <div className="messages-empty">Loading conversations...</div>
            ) : filteredConversations.length ? (
              filteredConversations.map((thread) => (
                <button
                  key={thread.id}
                  className={`thread-item ${
                    selectedConversationId === thread.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedConversationId(thread.id)}
                >
                  <div className="thread-top">
                    <p className="thread-name">{thread.contactName}</p>
                    <span className="thread-time">{timeLabel(thread.lastMessageAt)}</span>
                  </div>
                  <p className="thread-subject">{thread.subject}</p>
                  <p className="thread-preview">{thread.latestPreview}</p>
                  <div className="thread-tags">
                    {thread.unreadCount > 0 && (
                      <span className="tag unread">{thread.unreadCount} new</span>
                    )}
                    {thread.hasDraft && <span className="tag draft">draft</span>}
                    {thread.listingId && <span className="tag listing">listing</span>}
                  </div>
                </button>
              ))
            ) : (
              <div className="messages-empty">No matching conversations.</div>
            )}
          </div>
        </aside>

        <section className="messages-chat">
          {selectedConversation ? (
            <>
              <header className="chat-header">
                <div>
                  <h4>{selectedConversation.contactName}</h4>
                  <p>
                    {selectedConversation.contactEmail || "No email"}{" "}
                    {selectedConversation.contactPhone
                      ? `• ${selectedConversation.contactPhone}`
                      : ""}
                  </p>
                </div>
                <div className="chat-header-icons">
                  <Mail size={16} />
                  <span>Email thread</span>
                </div>
              </header>

              <div className="chat-messages">
                {messages.length ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`bubble ${
                        message.direction === "outbound" ? "outbound" : "inbound"
                      }`}
                    >
                      <div className="bubble-meta">
                        <span>
                          {message.direction === "inbound"
                            ? selectedConversation.contactName
                            : "Admin"}
                        </span>
                        <span>{timeLabel(message.created_at)}</span>
                      </div>
                      {message.subject && (
                        <p className="bubble-subject">{message.subject}</p>
                      )}
                      <p className="bubble-text">{message.body_text || "Attachment only"}</p>
                      {message.message_attachments?.length ? (
                        <div className="bubble-attachments">
                          {message.message_attachments.map((attachment) => (
                            <button
                              key={attachment.id}
                              onClick={() => openAttachment(attachment)}
                            >
                              <Paperclip size={14} />
                              {attachment.file_name}
                            </button>
                          ))}
                        </div>
                      ) : null}
                      {message.status === "failed" && (
                        <p className="bubble-error">
                          Failed: {message.failed_reason || "Unknown provider error"}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="messages-empty">
                    No messages yet for this contact.
                  </div>
                )}
              </div>

              <div className="composer">
                <input
                  type="text"
                  value={composerSubject}
                  onChange={(e) => setComposerSubject(e.target.value)}
                  placeholder="Email subject"
                />
                <textarea
                  value={composerBody}
                  onChange={(e) => setComposerBody(e.target.value)}
                  placeholder="Type your reply. It will be queued as outbound email."
                  rows={4}
                />
                {queuedAttachments.length > 0 && (
                  <div className="queued-files">
                    {queuedAttachments.map((file, index) => (
                      <span key={`${file.name}-${index}`}>
                        <Paperclip size={13} />
                        {file.name}
                        <button onClick={() => removeQueuedAttachment(index)}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="composer-actions">
                  <label className="attach-btn">
                    <Paperclip size={16} />
                    Attach
                    <input
                      type="file"
                      multiple
                      onChange={onAttachmentChange}
                      hidden
                    />
                  </label>
                  <button className="secondary-btn" onClick={saveDraft}>
                    <FileText size={16} />
                    Save Draft
                  </button>
                  <button
                    className="primary-btn"
                    onClick={sendMessage}
                    disabled={sending}
                  >
                    <Send size={16} />
                    {sending ? "Queueing..." : "Send Reply"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="messages-empty full">
              Select a contact conversation to start chatting.
            </div>
          )}
        </section>

        <aside className="messages-notifications">
          <div className="notifications-header">
            <h4>Notifications</h4>
            <span>{unreadNotifications} unread</span>
          </div>
          <div className="notifications-list">
            {notifications.length ? (
              notifications.map((item) => (
                <button
                  key={item.id}
                  className={`notification-item ${item.is_read ? "" : "unread"}`}
                  onClick={async () => {
                    if (item.conversation_id) {
                      setSelectedConversationId(item.conversation_id);
                    }
                    await markNotificationRead(item.id);
                  }}
                >
                  <div className="notification-top">
                    <Bell size={14} />
                    <span>{item.type}</span>
                  </div>
                  <p>{item.title || "Notification"}</p>
                  <small>{timeLabel(item.created_at)}</small>
                </button>
              ))
            ) : (
              <div className="messages-empty">No notifications.</div>
            )}
          </div>

          {activeDraft && (
            <div className="draft-info">
              <div className="draft-info-top">
                <User size={14} />
                <span>Draft loaded</span>
              </div>
              <p>Updated {timeLabel(activeDraft.updated_at)}</p>
            </div>
          )}
        </aside>
      </div>

      {statusMessage && <p className="messages-status">{statusMessage}</p>}
    </div>
  );
}
