import {
  Card,
  Button,
} from "@shopify/polaris";
import PropTypes from "prop-types";

export default function QuickAction({
  label,
}) {
  return (
    <Card>
      <Button
        fullWidth
        variant="primary"
      >
        {label}
      </Button>
    </Card>
  );
}

QuickAction.propTypes = {
  label: PropTypes.string.isRequired,
};
