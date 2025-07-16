// backend/utils/getUser.js
import { db } from "../firebase-admin.js"; // import initialized db
import admin from "firebase-admin"; 

export async function getUser(uid) {
  try {
    const userRef = admin.firestore().doc(`users/${uid}`);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      return userSnap.data().role || "viewer";
    } else {
      return "viewer";
    }
  } catch (error) {
    console.error("Error while getting the role with uid:", error);
    return "viewer";
  }
}


// backend/utils/getUser.js

export async function getName(uid) {
  try {
    const userRef = admin.firestore().doc(`users/${uid}`);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      return userSnap.data().name;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error while getting the name with uid:", error);
    return null;
  }
}
