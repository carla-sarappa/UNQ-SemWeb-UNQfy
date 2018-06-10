const ERRORS = {
  RESOURCE_ALREADY_EXISTS:{
    status: 409,
    errorCode: 'RESOURCE_ALREADY_EXISTS'
  },
  RELATED_RESOURCE_NOT_FOUND: {
    status: 404,
    errorCode: 'RELATED_RESOURCE_NOT_FOUND'
  },
  RESOURCE_NOT_FOUND: {
    status: 404,
    errorCode: 'RESOURCE_NOT_FOUND'
  },
  BAD_REQUEST:{
    status: 400,
    errorCode: 'BAD_REQUEST'
  },
  INTERNAL_SERVER_ERROR:{
    status: 500,
    errorCode: 'INTERNAL_SERVER_ERROR'
  }
};

function buildJsonErrorFrom(error) {
  if (error.errorType) {
    return ERRORS[error.errorCode] || ERRORS.INTERNAL_SERVER_ERROR;
  }

  return ERRORS.INTERNAL_SERVER_ERROR;
}

module.exports = {
  buildJsonErrorFrom: buildJsonErrorFrom,
  ERRORS: ERRORS
};