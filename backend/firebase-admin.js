const admin = require("firebase-admin");
const { readFileSync } = require("fs");

const serviceAccount = JSON.parse(
  readFileSync("./config/serviceAccountKey.json", "utf-8") 
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };
