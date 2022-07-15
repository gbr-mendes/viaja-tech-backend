const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require("../utils/cloudinary")
const UserModel = require('../models/userSchema')
const userUtils = require('../utils/users')
const { createLead } = require('../utils/manageRoles')
// User validators
const { createUserValidator, loginValidator, updateUserValidator } = require('../validators/userValidator')
const userSchema = require('../models/userSchema')

const controller = {}

controller.createUser = async (req, resp) => {
    const data = req.body
    data.role = 'isLead'

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
        if (user) {
            const lead = await createLead(user._id.toString())
            if (lead) {
                return resp.status(201).json({ success: "Usuário criado com sucesso" })
            } else {
                await userSchema.findByIdAndDelete(user._id.toString())
                return resp.status(500).json({ error: "Occorreu um erro inesperado. Tente novamente mais tarde" })
            }
        }
    } catch (err) {
        console.log(err)
        return resp.status(500).json({ error: "Ocorreu um erro ao cadastrar usuário. Tente novamente mais tarde" })
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
        resp.status(200).json({ success: "Logado com sucesso!", token })
    } catch (err) {
        resp.status(500).json({ error: "Ocorreu um erro ao efetuar o login" })
    }
}

controller.verifyToken = async (req, resp) => {
    resp.status(200).json({ "sucesso": "Acesso autorizado" })
}

controller.getMe = async (req, resp) => {
    const token = userUtils.getToken(req)
    const { email } = jwt.decode(token)

    try {
        const user = await UserModel.findOne({ email }).select([
            '_id',
            'name',
            'email',
            'phone',
            'cpf',
            'role',
            'avatar'
        ])
        if (user) {
            const userData = await userUtils.getUserInfoByRole(user)
            resp.status(200).json(userData)
        } else {
            resp.status(400).json({ error: "Usuário não encontrado" })
        }
    } catch (err) {
        console.log(err)
        resp.status(500).json({ error: "Ocorreu um erro ao recuperar os dados do usuário" })
    }
}

controller.updateMe = async (req, resp) => {
    const token = userUtils.getToken(req)
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET)

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
            fields: { "_id": 1, "name": 1, "email": 1, "cpf": 1, "phone": 1, "role": 1, "avatar": 1 }
        })

        resp.status(200).json({ success: "Usuário atualizado com sucesso", userInfo: updatedUser })
    } catch (err) {
        resp.status(500).json({ error: "Ocorreu um ero ao atualizar o usuário" })
    }
}

controller.updateAvatar = async (req, resp) => {
    const token = userUtils.getToken(req)
    const { email } = jwt.verify(token, process.env.TOKEN_SECRET)
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
