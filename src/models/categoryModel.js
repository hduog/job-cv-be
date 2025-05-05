import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';

const CATEGORY_COLLECTION_NAME = 'categories';
const CATEGORY_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
});

const validateBeforeCreate = async (data) => {
  return await CATEGORY_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data);
    const newCategory = {
      ...validatedData
    };
    return await GET_DB().collection(CATEGORY_COLLECTION_NAME).insertOne(newCategory);
  } catch (error) {
    throw new Error(error);
  }
};

const updateById = async (id, data) => {
  try {
    const result = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: ObjectId.createFromHexString(id.toString()) },
        { $set: data },
        { returnDocument: 'after' }
      );
    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: ObjectId.createFromHexString(id.toString()) },
        { $set: { _destroy: true } },
        { returnDocument: 'after' }
      );
    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

const findById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOne({ _id: ObjectId.createFromHexString(id.toString()) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findByIdAndUpdate = async (id, data) => {
  try {
    const result = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: ObjectId.createFromHexString(id.toString()) },
        { $set: data },
        { returnDocument: 'after' }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findByIdAndDelete = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: ObjectId.createFromHexString(id.toString()) },
        { $set: { _destroy: true } },
        { returnDocument: 'after' }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAll = async () => {
  try {
    const result = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .find({ _destroy: false })
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const categoryModel = {
  CATEGORY_COLLECTION_NAME,
  CATEGORY_COLLECTION_SCHEMA,
  createNew,
  updateById,
  deleteById,
  findById,
  findByIdAndUpdate,
  findByIdAndDelete,
  getAll
};