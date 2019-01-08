import BaseModel from "./BaseModel";
import { ApplicationError } from "../lib/errors";

import { default as userSchema } from "../schemas/user.schema.js";

export default class userModel extends BaseModel {
  constructor(connection) {
    super("user", connection);
    this.schema = userSchema;
    this.name = "user";
    this.model = this.connection.model(this.name, this.schema);
  }
  async create(userInformation) {
    try {
      let checkUser = await this.model.find({ email: userInformation.email });
      console.log(checkUser);
      if (checkUser.length > 0) {
        throw new ApplicationError("EmailId Already Register", 500, {});
      } else {
        const user = await this.model.create(userInformation);
        const response = await this.model.find({
          email: userInformation.email
        });
        console.log(response);
        if (!response) {
          return null;
        }

        return response;
      }
    } catch (error) {
      throw error;
    }
  }

  async get(userInformation) {
    try {
      const users = await this.model.find({ email: userInformation.email });
      console.log(users);
      return users;
    } catch (error) {
      throw new ApplicationError(error, 500, {});
    }
  }
  async getById(userId) {
    try {
      const user = await this.model.find({
        userId: userId,
        statusFlag: true
      });
      return user;
    } catch (error) {
      throw new ApplicationError(error, 500, {});
    }
  }
  async put(userId, userInformation) {
    try {
      console.log(userInformation);
      const user = await this.model.findOneAndUpdate(
        { userId: userId, statusFlag: true },
        { $set: userInformation },
        { new: true }
      );
      return user;
    } catch (error) {
      throw new ApplicationError(error, 500, {});
    }
  }
}
