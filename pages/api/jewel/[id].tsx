import { NextApiResponse, NextApiRequest } from "next";
import { updateJewelSchema } from "schemas/jewelSchema";
import { connectToDatabase } from "utils/db";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { method } = request;
  try {
    switch (method) {
      case "PATCH":
        await updateJewel(request, response);
        break;
      case "DELETE":
        await deleteJewel(request, response);
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

const updateJewel = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const { db } = await connectToDatabase();
  const { id } = request.query;

  const jewel = await db.collection("jewels").findOne({ jewelId: Number(id) });

  if (!jewel) {
    throw new Object({ statusCode: 404, message: "Código da jóia invalido." });
  }
  const { error, value } = updateJewelSchema.validate(request.body);
  if (error) {
    throw new Object({ statusCode: 400, message: error.details[0].message });
  }

  const jewelExists = await db
    .collection("jewels")
    .findOne({ name: value.name });
  if (!!jewelExists) {
    throw new Object({
      statusCode: 401,
      message: "Nome já utilizado",
    });
  }

  const responseJewel = await db
    .collection("jewels")
    .updateOne({ jewelId: Number(id) }, { $set: { ...value } });

  response
    .status(201)
    .json({ statusCode: 201, data: { jewel: { ...responseJewel } } });
};
const deleteJewel = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const { db } = await connectToDatabase();
  const { id } = request.query;

  const jewel = await db.collection("jewels").findOne({ jewelId: Number(id) });

  if (!jewel) {
    throw new Object({ statusCode: 404, message: "Código da jóia invalido." });
  }

  const responseJewel = await db
    .collection("jewels")
    .deleteOne({ jewelId: Number(id) });

  response
    .status(201)
    .json({ statusCode: 207, data: { jewel: { ...responseJewel } } });
};
