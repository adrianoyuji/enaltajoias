import { NextApiResponse, NextApiRequest } from "next";
import bcrypt from "bcrypt";
import { createUserSchema } from "schemas/userSchema";
import User from "models/User";
import { connectToDatabase } from "utils/db";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { method } = request;
  try {
    switch (method) {
      case "GET":
        await getUsers(request, response);
        break;
      case "POST":
        await createUsers(request, response);
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

const getUsers = async (request: NextApiRequest, response: NextApiResponse) => {
  const { db } = await connectToDatabase();

  const { page = 0, name } = JSON.parse(JSON.stringify(request.query));

  let filters = {};
  if (name) {
    filters = { ...filters, name: name };
  }

  const pagination = 10;
  const users = await db
    .collection("users")
    .find({ ...filters })
    .limit(pagination)
    .skip(pagination * page)
    .toArray();

  response.status(200).json({
    statusCode: 200,
    users: users.map((user: any) => ({
      user: {
        briefcases: user.briefcases,
        city: user.city,
        createdAt: user.createdAt,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
        _id: user._id,
      },
    })),
  });
};

const createUsers = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const { db } = await connectToDatabase();
  const { error, value } = createUserSchema.validate(request.body);
  if (error) {
    throw new Object({ statusCode: 400, message: error.details[0].message });
  }

  const { email, full_name, role, password, city, phone_number } = value;
  const checkUserExists = await db.collection("users").findOne({ email });
  if (checkUserExists) {
    throw new Object({ statusCode: 409, message: "Usuário já cadastrado" });
  }

  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    email,
    full_name,
    role,
    password: hashedPassword,
    city,
    phone_number,
  });
  await db.collection("users").insertOne(newUser);

  response.status(201).json({ statusCode: 201, newUser });
};
