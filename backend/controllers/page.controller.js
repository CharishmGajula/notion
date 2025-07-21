const { createSchema } = require("../middlewares/requestHandler.js");
const { admin } = require("../firebase-admin.js");


async function createPage(req, res) {
  try {
    const validate = createSchema.safeParse(req.body);
    if (!validate.success) {
      const formattedErrors = validate.error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message
      }));
      console.log("Validation Errors:", formattedErrors);
      return res.status(400).json({
        message: "Invalid input data",
        errors: formattedErrors
      });
    }

    const user = req.user;
    const ownerId = user.uid;
    const { title, parentPageId = null } = req.body;

    const pageRef = admin.firestore().collection("pages").doc();


    const pageData = {
      pageId: pageRef.id,
      title,
      ownerId,
      isPublic: false,
      sharedWith: {},
      content: [
        {
          type: "doc",        
          content: []        
        }
      ],
      comments:[],
      parentPageId,
      isTrashed: false,
      isDefault: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await pageRef.set(pageData);
    return res.status(201).json({ message: "Page created", page: pageData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}


async function updatePage(req, res) {
  try {
    const { pageId } = req.params;
    const { title, content, isPublic, sharedWith ,comments,isTrashed} = req.body;

    const updateData = {};
    console.log(comments);

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (sharedWith !== undefined) updateData.sharedWith = sharedWith;
    if(comments!==undefined) updateData.comments=comments;
    if(isTrashed!==undefined) updateData.isTrashed=isTrashed;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await admin.firestore().collection("pages").doc(pageId).update(updateData);

    return res.status(200).json({ message: "Page updated successfully" });
  } catch (err) {
    console.error("Update failed:", err);
    return res.status(500).json({ error: "Failed to update page" });
  }
}

async function getPage(req, res) {
  try {
    const { pageId } = req.params;
    const pageDoc = await admin.firestore().collection("pages").doc(pageId).get();

    if (!pageDoc.exists) {
      return res.status(404).json({ error: "Page not found" });
    }

    const childSnap = await admin.firestore()
      .collection("pages")
      .where("parentPageId", "==", pageId)
      .where("isTrashed", "==", false)
      .get();

    const children = childSnap.docs.map((doc) => ({
      pageId: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      page: { pageId, ...pageDoc.data() },
      children,
    });

  } catch (err) {
    console.error("Failed to fetch page:", err);
    return res.status(500).json({ error: "Server error while fetching page" });
  }
}

async function deletePage(req, res) {
  try {
    console.log("hey there!");
    const { pageId } = req.params;

    const pageRef = admin.firestore().collection("pages").doc(pageId);
    const pageDoc = await pageRef.get();

    if (!pageDoc.exists) {
      return res.status(404).json({ error: "Page not found" });
    }

    await pageRef.update({
      isTrashed: true,
      trashedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: "Page moved to trash" });
  } catch (err) {
    console.error("Trash failed:", err);
    return res.status(500).json({ error: "Failed to move page to trash" });
  }
}

async function AllPages(req, res) {
  try {
    console.log("Hey");
    const user = req.user;
    const ownerId = user.uid;

    console.log(user);
    console.log(ownerId);
    const pagesRef = admin.firestore().collection("pages");
    const snapshot = await pagesRef.where("ownerId", "==", ownerId).where("isTrashed", "==", false).get();

    if (snapshot.empty) {
      return res.status(200).json({ message: "No pages found", pages: [] });
    }

    const pages = snapshot.docs.map(doc => doc.data());

    return res.status(200).json({ message: "Pages fetched successfully", pages });
  } catch (err) {
    console.error("Failed to fetch pages:", err);
    return res.status(500).json({ error: "Failed to fetch pages" });
  }
}

module.exports = {
  createPage,
  updatePage,
  getPage,
  deletePage,
  AllPages
};
