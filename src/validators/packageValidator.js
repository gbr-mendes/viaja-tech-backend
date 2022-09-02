const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validators = {};

validators.createPackageValidator = Joi.object({
  title: Joi.string().min(5).max(30).required().messages({
    "any.required": "O campo título é obrigatório ",
    "string.empty": "O campo título é obrigatório",
    "string.min": "O campo título precisa de no mínimo 5 caracteres",
    "string.max": "O campo título pode ter no máximo 30 caracteres",
  }),
  description: Joi.string().min(15).required().messages({
    "any.required": "O campo descrição é obrigatório ",
    "string.empty": "O campo descrição é obrigatório",
    "string.min": "O campo descrição precisa de no mínimo 15 caracteres",
  }),
  valuePerDay: Joi.number().required().min(200).messages({
    "any.required": 'O campo "valor por dia" é obrigatório',
    "number.base": 'O campo "valor por dia" precisa ser númerico',
    "number.min": 'O "valor por dia" precisa ser de no mínimo R$ 200,00',
  }),
});

validators.getPackageByIdValidator = Joi.object({
  packageId: Joi.objectId().required().messages({
    "any.required": "O campo id é obrigatório ",
    "string.empty": "O campo id é obrigatório",
    "string.pattern.name": "O campo id precisa ser do tipo objectId",
  }),
});

validators.updatePackageValidator = Joi.object({
  packageId: Joi.objectId().messages({
    "any.required": "O campo id é obrigatório ",
    "string.empty": "O campo id é obrigatório",
    "string.pattern.name": "O campo id precisa ser do tipo objectId",
  }),
  title: Joi.string().min(5).max(30).messages({
    "string.empty": "O campo título é obrigatório",
    "string.min": "O campo título precisa de no mínimo 5 caracteres",
    "string.max": "O campo título pode ter no máximo 30 caracteres",
  }),
  description: Joi.string().min(15).messages({
    "string.empty": "O campo descrição é obrigatório",
    "string.min": "O campo descrição precisa de no mínimo 15 caracteres",
  }),
  valuePerDay: Joi.number().min(200).messages({
    "number.base": 'O campo "valor por dia" precisa ser númerico',
    "number.min": 'O "valor por dia" precisa ser de no mínimo R$ 200,00',
  }),
});

validators.getPackageByIdValidator = Joi.object({
  packageId: Joi.objectId().messages({
    "any.required": "O campo id é obrigatório ",
    "string.empty": "O campo id é obrigatório",
    "string.pattern.name": "O campo id precisa ser do tipo objectId",
  }),
});

module.exports = validators;
