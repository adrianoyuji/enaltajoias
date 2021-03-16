import { NextApiResponse, NextApiRequest } from "next";
import { updateBriefcaseSchema } from "schemas/briefcaseSchema";
import { connectToDatabase } from "utils/db";
import { ObjectId } from "mongodb";
const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { method } = request;
  try {
    switch (method) {
      case "GET":
        await getBriefcase(request, response);
        break;
      case "PATCH":
        await updateBriefcase(request, response);
        break;
      case "DELETE":
        await deleteBriefcase(request, response);
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

const getBriefcase = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const { db } = await connectToDatabase();
  const { id } = JSON.parse(JSON.stringify(request.query));

  const briefcase = await db
    .collection("briefcases")
    .findOne({ _id: new ObjectId(id) });

  if (!briefcase) {
    throw new Object({ statusCode: 404, message: "Maleta inexistente." });
  }

  const jewels = await await db
    .collection("jewels")
    .find({
      jewelId: {
        $in: briefcase.jewels.map((item: any) => Number(item.jewelId)),
      },
    })
    .toArray();

  response
    .status(201)
    .json({ statusCode: 201, data: { briefcase: { ...briefcase, jewels } } });
};

const updateBriefcase = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const { db } = await connectToDatabase();
  const { id } = JSON.parse(JSON.stringify(request.query));

  const briefcase = await db
    .collection("briefcases")
    .findOne({ _id: new ObjectId(id) });

  if (!briefcase) {
    throw new Object({ statusCode: 404, message: "Maleta inexistente." });
  }
  const { error, value } = updateBriefcaseSchema.validate(request.body);
  if (error) {
    throw new Object({ statusCode: 400, message: error.details[0].message });
  }

  if (briefcase.briefcase_name !== value.briefcase_name) {
    const briefcaseExists = await db
      .collection("briefcases")
      .findOne({ briefcase_name: value.briefcase_name });
    if (!!briefcaseExists) {
      throw new Object({
        statusCode: 401,
        message: "Nome já utilizado",
      });
    }
  }
  const { briefcase_name, jewels, total_value } = value;

  const briefcaseResponse = await db.collection("briefcases").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        briefcase_name,
        jewels,
        jewel_quantity: jewels.length,
        total_value,
      },
    }
  );

  response
    .status(201)
    .json({ statusCode: 201, data: { briefcase: { ...briefcaseResponse } } });
};
const deleteBriefcase = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const { db } = await connectToDatabase();
  const { id } = JSON.parse(JSON.stringify(request.query));

  const briefcase = await db
    .collection("briefcases")
    .findOne({ _id: new ObjectId(id) });

  if (!briefcase) {
    throw new Object({ statusCode: 404, message: "Maleta inexistente." });
  }

  const responseBriefcase = await db
    .collection("briefcases")
    .deleteOne({ _id: new ObjectId(id) });

  response
    .status(201)
    .json({ statusCode: 207, data: { briefcase: { ...responseBriefcase } } });
};
