import MessageFilters from "../components/Messages/MessageFilters";
import MessageTable from "../components/Messages/MessageTable";
import { useState } from "react";
import { useOutletContext } from "react-router";
import MessageForm from "../components/Messages/MessageForm";

export default function Messages() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const { messages, setMessages } = useOutletContext();

  const handleSaveMessage = (newMessage) => {
    setMessages((currentMessages) =>
      editingMessage
        ? currentMessages.map((message) =>
            message.id === newMessage.id ? newMessage : message,
          )
        : [...currentMessages, newMessage],
    );
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMessage(null);
  };

  return (
    <div style={{ padding: "24px" }}>
      {isFormOpen && (
        <MessageForm
          onSave={handleSaveMessage}
          onClose={handleCloseForm}
          initialMessage={editingMessage}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            Checkout Messages
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "8px",
            }}
          >
            Create and manage checkout messages
          </p>
        </div>

        <button
            onClick={() => {
              setEditingMessage(null);
              setIsFormOpen(true);
            }}
            style={{
                background: "#111827",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "12px 18px",
                cursor: "pointer",
            }}
            >
            + Create Message
        </button>
      </div>

      <MessageFilters />
      <MessageTable
        messages={messages}
        onEdit={(message) => {
          setEditingMessage(message);
          setIsFormOpen(true);
        }}
        onDelete={(messageId) => {
          setMessages((currentMessages) =>
            currentMessages.filter((message) => message.id !== messageId),
          );
        }}
      />
    </div>
  );
}
