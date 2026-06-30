import {
  Card,
  Text,
  BlockStack,
} from "@shopify/polaris";
import PropTypes from "prop-types";

export default function StatsCard({
  title,
  value,
}) {
  return (
    <Card>
      <BlockStack gap="200">
        <Text variant="bodyMd" tone="subdued">
          {title}
        </Text>

        <Text variant="heading2xl">
          {value}
        </Text>
      </BlockStack>
    </Card>
  );
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
