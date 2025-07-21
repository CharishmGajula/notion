const jwt = require("jsonwebtoken");
const { admin } = require("../firebase-admin");

function authMiddleware(req, res, next) {    
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(1);
  console.log(token);
  if (!token || token === "null" || token === "undefined") {
    return res.sendStatus(401);
  }

  console.log(2);
  jwt.verify(token, process.env.JWT_SECRET_MESSAGE, (err, user) => {
    if (err) {
      return res.sendStatus(403); 
    }

    req.user = user; 
    next();
  });
}

async function publicAccessMiddleware(req, res, next) {
  const { pageId } = req.params;

  try {
    const doc = await admin.firestore().collection("pages").doc(pageId).get();
    if (!doc.exists) return res.status(404).json({ error: "Page not found" });
    const page = doc.data();
    if (page.isPublic) {
      return res.status(200).json({ page }); 
    }
    next();
  } catch (err) {
    console.error("Error in publicAccessMiddleware:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { authMiddleware, publicAccessMiddleware };
