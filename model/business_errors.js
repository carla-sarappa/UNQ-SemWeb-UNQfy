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

  static unlessResultExists(results) {
    if (!results[0]) {
      throw new EntityNotFoundException('Entity not found.');
    }
    return results[0];
  }
}

class RelatedEntityNotFoundException extends BusinessException {
  constructor(message) {
    super(message);
  }
}

class EntityAlreadyExistsException extends BusinessException {
  constructor(message) {
    super(message);
  }

  static ifNameAlreadyExists(entities, name) {
    const entityName = entities
      .find(e => e.name.toLowerCase() === name.toLowerCase());

    if (entityName) throw new EntityAlreadyExistsException(
      `${name} already exists.`
    );
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
  EntityAlreadyExistsException,
  InvalidArgumentException
};