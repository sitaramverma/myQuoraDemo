import { route } from "./";
import { hashPassword, comparePassword } from "../lib/crypto";
import { generateToken } from "../lib/token";
import UserModel from "../db/UserModel";
import { ApplicationError } from "../lib/errors";
import _ from "lodash";

export const create = route(async (req, res) => {
  const userModel = new UserModel();
  try {
    const userInformation = req.body;
    let { password } = req.body;

    let newUser = Object.assign({}, userInformation, {
      password: await hashPassword(password)
    });

    if (!_.isEmpty(newUser)) {
      console.log(newUser);
      const user = await userModel.create(newUser);
      let { _id } = user;
      let newUserWithAuthToken = Object.assign({}, user, {
        token: await generateToken(_id)
      });
      res.send({ results: newUserWithAuthToken });
    } else {
      throw new ApplicationError("No userInformation Provided !!!", 501, {});
    }
  } catch (error) {
    throw new ApplicationError(error, 500, {});
  }
});

export const login = route(async (req, res) => {
  const userModel = new UserModel();
  console.log('dggggggg')
  try {
    const user = await userModel.get(req.body);
    let password = user[0].password;
    let _id = user[0]._id;

    let checkPassword = await comparePassword(req.body.password, password);
    console.log(checkPassword);
    if (checkPassword) {
      let userWithAuthToken = Object.assign({}, user, {
        token: await generateToken(_id)
      });

      res.send({ results: userWithAuthToken });
    } else {
      throw new ApplicationError("Wrong password !!!", 501, {});
    }
  } catch (error) {
    throw new ApplicationError(error, 500, {});
  }
});

export const get = route(async (req, res) => {
  const userModel = new UserModel();
  try {
    const users = await userModel.get();
    res.send({ results: users });
  } catch (error) {
    throw new ApplicationError(error, 500, {});
  }
});

export const getById = route(async (req, res) => {
  const userModel = new UserModel();
  try {
    let userId = req.params.Id;
    const user = await userModel.getById(userId);
    res.send({ results: user });
  } catch (error) {
    throw new ApplicationError(error, 500, {});
  }
});
export const put = route(async (req, res) => {
  const userModel = new UserModel();
  try {
    let userId = req.params.Id;
    let userInformation = req.body;
    let { password } = userInformation;

    let newUser = Object.assign({}, userInformation, {
      password: await hashPassword(password)
    });
    const user = await userModel.put(userId, newUser);
    res.send({ results: user });
  } catch (error) {
    throw new ApplicationError(error, 500, {});
  }
});
export const verifyUser = route(async (req, res) => {
  const userModel = new UserModel();
  try {
    let headerToken = req.headers.authorization;
    headerToken = headerToken.substring("Bearer ".length);
    const token = headerToken.split(",");
    let isTokenVerified = await decodeToken(token[1]);
    if (isTokenVerified) {
      let user = await userModel.getUser(token[0]);
      if (user) {
        res.send(buildResponse.success(200, user));
      } else {
        throw new Error("No userDetails available !!!");
      }
    } else {
      throw new Error("Token verification failed !!!");
    }
  } catch (error) {
    res.send(buildResponse.failure(error));
  }
});
