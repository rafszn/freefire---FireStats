function getPositionNumber(position) {
  const match = position.match(/#(\d+)/);
  return match ? match[1] : null;
}

module.exports = getPositionNumber;
