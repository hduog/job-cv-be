import { categoryModel } from '~/models/categoryModel';

const createCategory = async (categoryData) => {
  try {
    const newCategory = await categoryModel.createNew(categoryData);
    return newCategory;
  } catch (error) {
    throw error;
  }
};

const getCategoryById = async (categoryId) => {
  try {
    const category = await categoryModel.findById(categoryId);
    return category;
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (categoryId, updateData) => {
  try {
    const updatedCategory = await categoryModel.findByIdAndUpdate(categoryId, updateData, { new: true });
    return updatedCategory;
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (categoryId) => {
  try {
    const deletedCategory = await categoryModel.findByIdAndDelete(categoryId);
    return deletedCategory;
  } catch (error) {
    throw error;
  }
};

const getAllCategories = async () => {
  try {
    const categories = await categoryModel.getAll();
    return categories;
  } catch (error) {
    throw error;
  }
};

export const categoryService = {
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategories
};