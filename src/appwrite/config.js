import "react-native-url-polyfill/auto";
import { Client, Account, Databases } from "react-native-appwrite";

import { Platform } from "react-native";

const client = new Client();
const appwritePlatformId = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM_ID;
const isPlaceholderPlatformId =
  !appwritePlatformId || appwritePlatformId === "YOUR_PLATFORM_ID";
const resolvedPlatformId = isPlaceholderPlatformId
  ? Platform.OS === "android"
    ? "host.exp.exponent"
    : "host.exp.Exponent"
  : appwritePlatformId;

client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);

if (resolvedPlatformId) {
  client.setPlatform(resolvedPlatformId);
} else if (__DEV__) {
  console.warn("EXPO_PUBLIC_APPWRITE_PLATFORM_ID is not set.");
}
export const account = new Account(client);
export const databases = new Databases(client);

export const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
export const USERS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID;

export const TASKS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_TASKS_COLLECTION_ID;