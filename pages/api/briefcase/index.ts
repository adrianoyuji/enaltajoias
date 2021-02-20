import { NextApiResponse, NextApiRequest } from "next";
import { createBriefcaseSchema } from "schemas/briefcaseSchema";
import Briefcase from "models/Briefcase";
import { connectToDatabase } from "utils/db";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { method } = request;
  try {
    switch (method) {
      case "GET":
        await getBriefcases(request, response);
        break;
      case "POST":
        await createBriefcase(request, response);
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

const getBriefcases = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const { db } = await connectToDatabase();

  const { page = 0, briefcaseName } = JSON.parse(JSON.stringify(request.query));

  let filters = {};
  if (briefcaseName) {
    filters = { ...filters, briefcase_name: briefcaseName };
  }

  const pagination = 10;
  const briefcases = await db
    .collection("briefcases")
    .find({ ...filters })
    .limit(pagination)
    .skip(pagination * page)
    .toArray();

  response.status(200).json({ statusCode: 200, briefcases });
};
const createBriefcase = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const { db } = await connectToDatabase();
  const { error, value } = createBriefcaseSchema.validate(request.body);
  if (error) {
    throw new Object({ statusCode: 400, message: error.details[0].message });
  }
  const { briefcase_name, jewels, total_value } = value;

  const briefcaseExists = await db
    .collection("briefcases")
    .findOne({ briefcase_name: briefcase_name });
  if (!!briefcaseExists) {
    throw new Object({
      statusCode: 400,
      message: "Nome para maleta já utilizado",
    });
  }

  const briefcase = new Briefcase({
    briefcase_name,
    jewels,
    jewel_quantity: jewels.length,
    total_value,
  });

  await db.collection("briefcases").insertOne(briefcase);

  response
    .status(201)
    .json({ statusCode: 201, data: { briefcase: { ...value } } });
};
