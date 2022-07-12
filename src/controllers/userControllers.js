const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require("../utils/cloudinary")
const UserModel = require('../models/userSchema')
const utils = require('../utils/users')
const userUtils = require('../utils/users')
const manageRoles = require('../utils/manageRoles')
// User validators
const { createUserValidator, loginValidator, updateUserValidator } = require('../validators/userValidator')

const controller = {}

controller.createUser = async (req, resp) => {
    const data = req.body
    if (!data.roles.includes('isLead')) {
        data.roles.push('isLead')
    }
    const { error } = createUserValidator.validate(data)
    if (error) {
        const { message } = error.details[0]
        resp.status(400).json({ error: message })
        return
    }

    const { email, cpf } = data

    if (await userUtils.emailAlreadyRegistered(email)) {
        resp.status(400).json({ error: "Email já cadastrado" })
        return
    }

    if (await userUtils.cpfAlreadyRegistered(cpf)) {
        resp.status(400).json({ error: "CPF já cadastrado" })
        return
    }

    try {
        delete data.confirmPassword
        const user = await UserModel.create(data)
        const { _id } = user
        manageRoles.setUserRole(_id, data)
        resp.status(201).json({ success: "Usuário criado com sucesso" })
    } catch (err) {
        resp.status(500).json({ error: "Ocorreu um erro ao cadastrar usuário. Tente novamente mais tarde" })
        return
    }
}

controller.loginUser = async (req, resp) => {
    const data = req.body
    const { error } = loginValidator.validate(data)
    if (error) {
        const { message } = error.details[0]
        resp.status(400).json({ error: message })
        return
    }

    const { email } = data

    try {
        if (!await userUtils.emailAlreadyRegistered(email)) {
            resp.status(401).json({ error: "Usuário ou senha inválidos" })
            return
        }

        const user = await UserModel.findOne({ email })

        const validPass = await bcrypt.compare(data.password, user.password)
        if (!validPass) {
            resp.status(401).json({ error: "Usuário ou senha inválidos" })
            return
        }

        const token = jwt.sign(user.toJSON(), process.env.TOKEN_SECRET)
        resp.header("auth-token", token)
        resp.status(200).json({ success: "Logado com sucesso!", token })
    } catch (err) {
        resp.status(500).json({ error: "Ocorreu um erro ao efetuar o login" })
    }
}

controller.verifyToken = async (req, resp) => {
    resp.status(200).json({ "sucesso": "Acesso autorizado" })
}

controller.getMe = async (req, resp) => {
    const authToken = req.header('auth-token')
    const { email } = jwt.decode(authToken)

    try {
        const user = await UserModel.findOne({ email }).select([
            '_id',
            'name',
            'email',
            'phone',
            'cpf',
            'roles',
            'avatar'
        ])
        if (user) {
            const userData = await utils.getUserInfoByRole(user)
            resp.status(200).json(userData)
        } else {
            resp.status(400).json({ error: "Usuário não encontrado" })
        }
    } catch (err) {
        resp.status(500).json({ error: "Ocorreu um erro ao recuperar os dados do usuário" })
    }
}

controller.updateMe = async (req, resp) => {
    const authToken = req.header("auth-token")
    const { email } = jwt.verify(authToken, process.env.TOKEN_SECRET)

    const data = req.body
    const { error } = updateUserValidator.validate(data)

    if (error) {
        const { message } = error.details[0]
        resp.status(400).json({ error: message })
        return
    }
    if (data.email && data.email !== email) {
        try {
            const userExists = await UserModel.findOne({ email: data.email })
            if (userExists) {
                resp.status(400).json({ error: 'Email já cadastrado' })
                return
            }
        } catch (err) {
            resp.status(500).json({ error: "Ocorreu um ero ao atualizar o usuário" })
        }
    }

    try {
        const user = await UserModel.findOne({ email })

        if (!user) {
            resp.status(400).json({ error: "Usuário não encontrado" })
            return
        }

        const updatedUser = await UserModel.findOneAndUpdate({ email }, data, {
            new: false,
            returnOriginal: false,
            fields: { "_id": 1, "name": 1, "email": 1, "cpf": 1, "phone": 1, "roles": 1, "avatar": 1 }
        })

        resp.status(200).json({ success: "User updated successfully", userInfo: updatedUser })
    } catch (err) {
        resp.status(500).json({ error: "Ocorreu um ero ao atualizar o usuário" })
    }
}

controller.updateAvatar = async (req, resp) => {
    const authToken = req.header('auth-token')
    const { email } = jwt.verify(authToken, process.env.TOKEN_SECRET)
    if (req.file) {
        try {
            const path = req.file.path
            const { secure_url } = await cloudinary.uploader.upload(path)
            await UserModel.findOneAndUpdate({ email }, { avatar: secure_url }, { new: false })
            resp.status(200).json({ success: "Imagem de perfil atualizada com sucesso", image: secure_url })

        } catch (err) {
            console.log(err)
            resp.status(500).json({ error: "Ocorreu um erro inesperado ao atualizar imagem" })
        }
    } else {
        resp.status(400).json({ error: "Você precisa enviar uma imagem" })
    }
}

module.exports = controller
