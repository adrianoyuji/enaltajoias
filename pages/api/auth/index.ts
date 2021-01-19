import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { validateLogin } from "schemas/authSchema";
import { connectToDatabase } from "utils/db";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { method } = request;

  try {
    switch (method) {
      case "POST":
        await login(request, response);
        break;
      default:
        response
          .status(400)
          .json({ statusCode: 400, message: "invalid method" });
        break;
    }
  } catch (err) {
    response
      .status(err.statusCode || 500)
      .json({ statusCode: err.statusCode || 500, message: err.message });
  }
};

export default handler;

const login = async (request: NextApiRequest, response: NextApiResponse) => {
  const { email, password } = request.body;
  const { db } = await connectToDatabase();

  if (!email || !password) {
    throw new Object({ statusCode: 400, message: "Insira email e/ou senha" });
  }
  //validate body request
  const { error, value } = validateLogin.validate(request.body);
  if (!!error) {
    throw new Object({ statusCode: 400, message: error.details[0].message });
  }

  //check if email exists
  const user = await db.collection("users").findOne({ email: value.email });
  if (!user) {
    throw new Object({ statusCode: 400, message: "Email/Senha incorretos" });
  }

  //checks if password is correct
  const validPwd = await bcrypt.compare(value.password, user.password);
  if (!validPwd) {
    response.status(400).json({ error: "Email/Senha incorretos" });
  } else {
    response.status(200).json({
      user: {
        briefcases: user.briefcases,
        city: user.city,
        createdAt: user.createdAt,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
        _id: user._id,
      },
    });
  }
};
