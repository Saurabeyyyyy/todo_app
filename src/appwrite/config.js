import "react-native-url-polyfill/auto";
import { Client, Account, Databases } from "react-native-appwrite";

const client = new Client();

client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
export const USERS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID;

export const TASKS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_TASKS_COLLECTION_ID;