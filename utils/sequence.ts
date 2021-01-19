import { connectToDatabase } from "utils/db";

interface Props {
  collectionName: string;
  fieldName: string;
}

export const getNextSequence = async ({ collectionName, fieldName }: Props) => {
  try {
    const { db } = await connectToDatabase();

    const lastRecord = await db
      .collection(collectionName)
      .find()
      .limit(1)
      .sort({ $natural: -1 })
      .toArray();

    return !!lastRecord.length ? Number(lastRecord[0][fieldName]) : 100;
  } catch (error) {
    return error;
  }
};
