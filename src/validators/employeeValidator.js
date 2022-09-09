const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validators = {};

validators.createEmployeeValidator = Joi.object({
  userId: Joi.objectId().required().messages({
    "any.required": "O campo userId é obrigatório ",
    "string.empty": "O campo userId é obrigatório",
    "string.pattern.name": "O campo userId precisa ser do tipo objectId",
  }),
  salary: Joi.number().required().min(1500).messages({
    "any.required": "O campo salário é obrigatório",
    "number.base": "O campo salario precisa ser númerico",
    "number.min": "O salário precisa ser de no mínimo R$ 1.500,00",
  }),
  position: Joi.string().min(2).max(20).required().messages({
    "any.required": "O campo posição é obrigatório ",
    "string.empty": "O campo posição é obrigatório",
    "string.min": "O campo posição precisa de no mínimo 2 caracteres",
    "string.max": "O campo posição pode ter no máximo 20 caracteres",
  }),
});

validators.updateEmployeeValidator = Joi.object({
  salary: Joi.number().required().min(1500).messages({
    "any.required": "O campo salário é obrigatório",
    "number.base": "O campo salario precisa ser númerico",
    "number.min": "O salário precisa ser de no mínimo R$ 1.500,00",
  }),
  position: Joi.string().min(2).max(20).required().messages({
    "any.required": "O campo posição é obrigatório ",
    "string.empty": "O campo posição é obrigatório",
    "string.min": "O campo posição precisa de no mínimo 2 caracteres",
    "string.max": "O campo posição pode ter no máximo 20 caracteres",
  }),
});

module.exports = validators;
