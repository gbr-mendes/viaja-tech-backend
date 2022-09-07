// validators
const { createUserValidator } = require("../validators/userValidator");
const { createEmployeeValidator } = require("../validators/employeeValidator");

// utils
const {
  emailAlreadyRegistered,
  cpfAlreadyRegistered,
} = require("../utils/users");
const { paginatedQuery, queryBuilderBasedOnUser } = require("../utils/queries");

// schemas
const userSchema = require("../models/userSchema");
const employeeSchema = require("../models/employeeSchema");

const controller = {};

// helper function
const mapRoleByPosition = (position, userPayload) => {
  if (position == "Sales Manager") {
    userPayload["role"] = "isSalesManager";
  } else if (position == "General Manager") {
    userPayload["role"] = "isAdmin";
  } else if (position == "Content Manager") {
    userPayload["role"] = "isSiteAdmin";
  }
};

// controllers definition
controller.createEmployee = async (req, resp) => {
  const { userInfo, employeeInfo } = req.body;
  const { position } = employeeInfo;

  if (position) {
    mapRoleByPosition(position, userInfo);
  }

  const { error: userInfoError } = createUserValidator.validate(userInfo);

  if (userInfoError) {
    return resp.status(400).json({ error: userInfoError.details[0].message });
  }

  const { email, cpf } = userInfo;
  if (await emailAlreadyRegistered(email)) {
    return resp.status(409).json({ error: "Email já cadastrado" });
  }
  if (await cpfAlreadyRegistered(cpf)) {
    return resp.status(409).json({ error: "CPF já cadastrado" });
  }

  try {
    const user = await userSchema.create(userInfo);
    if (user) {
      const userId = user._id.toString();
      employeeInfo.userId = userId;
      const { error: employeeInfoError } =
        createEmployeeValidator.validate(employeeInfo);
      if (employeeInfoError) {
        await userSchema.findByIdAndDelete(userId);
        return resp
          .status(400)
          .json({ error: employeeInfoError.details[0].message });
      }
      const employee = await employeeSchema.create(employeeInfo);
      if (employee) {
        return resp
          .status(201)
          .json({ success: "Funcionário cadastrado com sucesso" });
      }
    }
  } catch (err) {
    console.log(err);
    return resp.status(500).json({ error: "Ocorreu um erro inesperado" });
  }
};

controller.getEmployees = (req, resp) => {
  const { limit, page } = req.query;
  const queryFields = ["-__v"];
  try {
    return paginatedQuery(
      employeeSchema,
      "employee",
      limit,
      page,
      resp,
      queryFields,
      queryBuilderBasedOnUser
    );
  } catch (err) {
    console.log(err);
    return resp.status(500).json({ error: "An unexpected error has occured" });
  }
};

controller.getEmployeeById = async (req, resp) => {
  const { employeeId } = req.params;
  try {
    const employee = await employeeSchema.findById(employeeId).select(["-__v"]);
    const { userId } = employee;
    const userData = await userSchema
      .findById(userId.toString())
      .select(["-__v", "-password", "-notfications", "-role"]);
    const payload = { ...employee.toObject(), ...userData.toObject() };
    return resp.json(payload);
  } catch (err) {
    resp.status(500).json({ error: "An unexpected error has occured" });
  }
};

module.exports = controller;
