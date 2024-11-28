const createSuccess = ({ msg, data = null }) => {
  return {
    status: 1,
    message: msg,
    data: data,
  };
};

const createError = (msg, data = null) => {
  return {
    status: 0,
    message: msg,
    data: data,
  };
};

module.exports = {
  createSuccess,
  createError,
};
