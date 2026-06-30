import {
  Card,
  Text,
} from "@shopify/polaris";
import PropTypes from "prop-types";

export default function ActivityCard({
  activity,
}) {
  return (
    <Card>
      <Text>{activity}</Text>
    </Card>
  );
}

ActivityCard.propTypes = {
  activity: PropTypes.node.isRequired,
};
