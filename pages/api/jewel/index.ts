import { NextApiResponse, NextApiRequest } from "next";
import { createJewelSchema } from "schemas/jewelSchema";
import Jewel from "models/Jewel";
import { connectToDatabase } from "utils/db";
import { getNextSequence } from "utils/sequence";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { method } = request;
  try {
    switch (method) {
      case "GET":
        await getJewels(request, response);
        break;
      case "POST":
        await createJewels(request, response);
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

const getJewels = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const { db } = await connectToDatabase();

  const { page = 0, name, jewelId } = JSON.parse(JSON.stringify(request.query));

  let filters = {};
  if (name) {
    filters = { ...filters, name: name };
  }
  if (jewelId) {
    filters = { ...filters, jewelId: Number(jewelId) };
  }

  const pagination = 10;
  const jewels = await db
    .collection("jewels")
    .find({ ...filters })
    .limit(pagination)
    .skip(pagination * page)
    .toArray();

  response.status(200).json({ statusCode: 200, jewels });
};
const createJewels = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const { db } = await connectToDatabase();
  const { error, value } = createJewelSchema.validate(request.body);
  if (error) {
    throw new Object({ statusCode: 400, message: error.details[0].message });
  }
  const { name, price, type, line } = value;

  const jewelExists = await db.collection("jewels").findOne({ name: name });
  if (!!jewelExists) {
    throw new Object({
      statusCode: 400,
      message: "Nome já utilizado",
    });
  }

  let nextId = await getNextSequence({
    collectionName: "jewels",
    fieldName: "jewelId",
  });
  if (isNaN(Number(nextId))) {
    nextId = 0;
  }

  const jewel = new Jewel({
    name: name,
    type: type,
    line: line,
    price: Number(price),
    jewelId: Number(nextId) + 1,
  });

  const responseJewel = await db.collection("jewels").insertOne(jewel);

  response
    .status(201)
    .json({ statusCode: 201, data: { jewel: { ...responseJewel } } });
};
