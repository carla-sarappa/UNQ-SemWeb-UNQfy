class BusinessException {
  constructor(message, errorCode) {
    this.errorType = 'user error';
    this.message = message;
    this.errorCode = errorCode;
  }
}

class EntityNotFoundException extends BusinessException {
  constructor(message) {
    super(message, 'RESOURCE_NOT_FOUND');
  }

  static unlessResultExists(results) {
    if (!results[0]) {
      throw new EntityNotFoundException('Entity not found.');
    }
    return results[0];
  }
}

class RelatedEntityNotFoundException extends BusinessException {
  constructor(message) {
    super(message, 'RELATED_RESOURCE_NOT_FOUND');
  }
}

class EntityAlreadyExistsException extends BusinessException {
  constructor(message) {
    super(message, 'RESOURCE_ALREADY_EXISTS');
  }

  static ifNameAlreadyExists(entities, name) {
    const entityName = entities
      .find(e => e.name.toLowerCase() === name.toLowerCase());

    if (entityName) throw new EntityAlreadyExistsException(
      `${entityName} already exists.`
    );
  }
}

class InvalidArgumentException extends BusinessException {

  constructor(message) {
    super(message, 'BAD_REQUEST');
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
  EntityAlreadyExistsException,
  InvalidArgumentException
};