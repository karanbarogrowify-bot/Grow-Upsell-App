import { BlockStack } from "@shopify/polaris";
import MessageCard from "./MessageCard";

export default function MessageList() {
  const messages = [
    {
      title: "Ships in 24 Hours",
      type: "Shipping",
      status: "Active",
    },
    {
      title: "Secure Checkout",
      type: "Trust Badge",
      status: "Active",
    },
  ];

  return (
    <BlockStack gap="300">
      {messages.map((message, index) => (
        <MessageCard
          key={index}
          {...message}
        />
      ))}
    </BlockStack>
  );
}