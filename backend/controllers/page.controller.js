import { createSchema } from "../middlewares/requestHandler.js";
import { admin } from "../firebase-admin.js";
export async function createPage(req,res)
{
    try{
    const validate=createSchema.safeParse(req.body);
    if(!validate.success)
    {
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
    
    const user=req.user;
    const ownerId=user.uid;
    const { title, parentPageId = null } = req.body;

    const pageRef = admin.firestore().collection("pages").doc();

    const pageData = {
      pageId: pageRef.id,
      title,
      ownerId,
      sharedWith: {},
      content: [],
      parentPageId,
      isTrashed:false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await pageRef.set(pageData);
    return res.status(201).json({ message: "Page created", page: pageData });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
    
}


export async function updatePage(req, res) {
  try {
    const { pageId } = req.params;
    const { title, content } = req.body;

    // Validation (optional)
    if (!title && !content) {
      return res.status(400).json({ error: "Nothing to update" });
    }

     const updateData = {};

    if (title) updateData.title = title;

    if (content) updateData.content = content;
    

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await admin.firestore().collection("pages").doc(pageId).update(updateData);


    await admin.firestore().collection("pages").doc(pageId).update(updateData);

    return res.status(200).json({ message: "Page updated successfully" });
  } catch (err) {
    console.error("Update failed:", err);
    return res.status(500).json({ error: "Failed to update page" });
  }
}



export async function getPage(req, res) {
  try {
    const { pageId } = req.params;

    const pageDoc = await admin.firestore().collection("pages").doc(pageId).get();

    if (!pageDoc.exists) {
      return res.status(404).json({ error: "Page not found" });
    }

    return res.status(200).json({ page: pageDoc.data() });

  } catch (err) {
    console.error("Failed to fetch page:", err);
    return res.status(500).json({ error: "Server error while fetching page" });
  }
}



export async function deletePage(req, res) {
  try {
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