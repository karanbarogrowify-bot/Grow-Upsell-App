import PropTypes from "prop-types";

export default function MessageCard({
  title,
  status,
}) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{status}</p>
    </div>
  );
}

MessageCard.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};