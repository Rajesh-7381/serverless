const HTTP = require("./httpStatus");
const MESSAGE = require("../constants/messages");

const send = (
  res,
  {
    status = HTTP.OK,
    success = true,
    message = MESSAGE.SUCCESS,
    data = null,
    errors = null,
    meta = null,
  } = {}
) => {
  return res.status(status).json({
    success,
    status,
    message,
    data,
    errors,
    meta,
    timestamp: new Date().toISOString(),
  });
};

const success = (
  res,
  data = null,
  message = MESSAGE.SUCCESS,
  status = HTTP.OK
) => {
  return send(res, {
    success: true,
    status,
    message,
    data,
  });
};

const created = (
  res,
  data = null,
  message = MESSAGE.CREATED
) => {
  return send(res, {
    success: true,
    status: HTTP.CREATED,
    message,
    data,
  });
};

const warning = (
  res,
  message = MESSAGE.WARNING,
  data = null
) => {
  return send(res, {
    success: false,
    status: HTTP.OK,
    message,
    data,
  });
};

const error = (
  res,
  message = MESSAGE.INTERNAL_SERVER_ERROR,
  status = HTTP.INTERNAL_SERVER_ERROR,
  errors = null
) => {
  return send(res, {
    success: false,
    status,
    message,
    errors,
  });
};

const validation = (
  res,
  errors,
  message = MESSAGE.VALIDATION_FAILED
) => {
  return send(res, {
    success: false,
    status: HTTP.UNPROCESSABLE_ENTITY,
    message,
    errors,
  });
};

const pagination = (
  res,
  data,
  meta,
  message = MESSAGE.FETCHED
) => {
  return send(res, {
    success: true,
    status: HTTP.OK,
    message,
    data,
    meta,
  });
};

const notFound = (
  res,
  message = MESSAGE.NOT_FOUND
) => {
  return send(res, {
    success: false,
    status: HTTP.NOT_FOUND,
    message,
  });
};

const unauthorized = (
  res,
  message = MESSAGE.UNAUTHORIZED
) => {
  return send(res, {
    success: false,
    status: HTTP.UNAUTHORIZED,
    message,
  });
};

const forbidden = (
  res,
  message = MESSAGE.FORBIDDEN
) => {
  return send(res, {
    success: false,
    status: HTTP.FORBIDDEN,
    message,
  });
};

const badRequest = (
  res,
  message = MESSAGE.BAD_REQUEST
) => {
  return send(res, {
    success: false,
    status: HTTP.BAD_REQUEST,
    message,
  });
};

const conflict = (
  res,
  message = MESSAGE.CONFLICT
) => {
  return send(res, {
    success: false,
    status: HTTP.CONFLICT,
    message,
  });
};

const paramMissing = (param) => ({
  success: false,
  status: HTTP.BAD_REQUEST,
  message: `${param} is required`,
});

module.exports = {
  send,
  success,
  created,
  warning,
  error,
  validation,
  pagination,
  notFound,
  unauthorized,
  forbidden,
  badRequest,
  conflict,
  paramMissing,
};