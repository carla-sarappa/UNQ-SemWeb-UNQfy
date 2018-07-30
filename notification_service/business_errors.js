class BusinessException {
  constructor(message) {
    this.errorType = 'user error';
    this.message = message;
  }
}

class EntityNotFoundException extends BusinessException {
  constructor(message) {
    super(message);
  }

  static unlessExists(result) {
    if (!result) {
      throw new EntityNotFoundException('Entity not found.');
    }
    return result;
  }
}

class RelatedEntityNotFoundException extends BusinessException {
  constructor(message) {
    super(message);
  }

  static unlessExists(result) {
    if (!result) {
      throw new RelatedEntityNotFoundException('Entity not found.');
    }
    return result;
  }
}

class InvalidArgumentException extends BusinessException {

  constructor(message) {
    super(message);
  }

  static unlessHasFields(argument, fieldList) {
    const missingField = fieldList.find( field => argument[field] === undefined);
    if (missingField) {
      throw new InvalidArgumentException(`Field ${missingField} is missing.`);
    }
  }
}

module.exports = {
  EntityNotFoundException,
  RelatedEntityNotFoundException,
  InvalidArgumentException
};