module.exports = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().getTime(),
  };
};
