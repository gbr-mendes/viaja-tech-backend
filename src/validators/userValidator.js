const Joi = require('joi')
const { cpf } = require('cpf-cnpj-validator')

const validators = {}

const cpfValidation = (value, helpers) => {
    const isValid = cpf.isValid(value)

    if (isValid) {
        return value
    } else {
        return helpers.error("any.invalid")
    }
};

validators.createUserValidator = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'any.required': 'O campo nome é obrigatório ',
            'string.empty': 'O campo nome é obrigatório',
            'string.min': 'O campo nome precisa de no mínimo 2 caracteres',
            'string.max': 'O campo nome pode ter no máximo 50 caracteres',
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'O campo email é obrigatório',
            'any.required': 'O campo email é obrigatório',
            'string.email': 'Por favor, informe um email válido'
        }),
    phone: Joi.string()
        .min(14)
        .max(15)
        .required()
        .messages({
            'any.required': 'O campo telefone é obrigatório ',
            'string.empty': 'O campo telefone é obrigatório',
            'string.min': 'O campo telefone precisa de no mínimo 14 caracteres',
            'string.max': 'O campo telefone pode ter no máximo 15 caracteres',
        }),

    cpf: Joi.string()
        .required()
        .custom(cpfValidation)
        .messages({
            'any.required': 'O campo CPF é obrigatório',
            'string.empty': 'O campo CPF é obrigatório',
            'any.invalid': 'Por favor, informe um CPF válido'
        }),

    password: Joi.string()
        .required()
        .min(8)
        .messages({
            'any.required': 'O campo senha é obrigatório',
            'string.empty': 'O campo senha é obrigatório',
            'string.min': 'O campo senha precisa de no mínimo 8 caracteres',
        }),

    confirmPassword: Joi.any()
        .equal(Joi.ref("password"))
        .required()
        .messages({
            'any.only': 'As senhas não conferem',
            'any.required': `Você precisa confirmar sua senha`
        }),

    role: Joi.string()
        .messages({
            'any.required': `O campo role é obrigatório`,
        }),
    salary: Joi.number()
})

validators.loginValidator = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'O campo email é obrigatório',
            'any.required': 'O campo email é obrigatório',
            'string.email': 'Por favor, informe um email válido'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'O campo senha é obrigatório',
            'string.empty': 'O campo senha é obrigatório',
        })
})

validators.updateUserValidator = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .messages({
            'any.required': 'O campo nome é obrigatório ',
            'string.empty': 'O campo nome é obrigatório',
            'string.min': 'O campo nome precisa de no mínimo 2 caracteres',
            'string.max': 'O campo nome pode ter no máximo 50 caracteres',
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'O campo email é obrigatório',
            'any.required': 'O campo email é obrigatório',
            'string.email': 'Por favor, informe um email válido'
        }),
    phone: Joi.string()
        .min(14)
        .max(15)
        .messages({
            'any.required': 'O campo telefone é obrigatório ',
            'string.empty': 'O campo telefone é obrigatório',
            'string.min': 'O campo telefone precisa de no mínimo 14 caracteres',
            'string.max': 'O campo telefone pode ter no máximo 15 caracteres',
        }),
    avatar: Joi.string()
        .messages({
            'string.empty': 'O campo avatar não pode ficar vazio',
        })
})

module.exports = validators