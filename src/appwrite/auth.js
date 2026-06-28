import { account } from "./config";
import { ID } from "react-native-appwrite";

export const registerUser = async (name, email, password) => {
  try {
    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    await account.createEmailPasswordSession(email, password);

    const user = await account.get();

    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserName = async (name) => {
  try {
    const user = await account.updateName(name);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};