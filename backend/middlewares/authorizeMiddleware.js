import {admin} from "../firebase-admin.js";

export const checkPageAccess = (allowedRoles = []) => async (req, res, next) => {
  const uid = req.user.uid;
  const { pageId } = req.params;

  try {
    const doc = await admin.firestore().collection("pages").doc(pageId).get();

    if (!doc.exists) return res.status(404).json({ error: "Page not found" });

    const page = doc.data();

    if (page.ownerId === uid) {
      req.page = page;
      return next();
    }

    const role = page.sharedWith?.[uid];
    if (allowedRoles.includes(role)) {
      req.page = page;
      return next();
    }

    return res.status(403).json({ error: "Access denied" });
  } catch (err) {
    console.error("Role check error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
