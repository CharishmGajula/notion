import {admin,db} from "../firebase-admin.js";
import { registerSchema } from "../middlewares/requestHandler.js";
import { getName, getUser } from "../utils/getUser.js";
import jwt from "jsonwebtoken";
export async function loginUser(req,res)
{
    const {tokenId}=req.body;
    try{
        if(tokenId=="")
        {
            return res.send("token Id is missing");
        }
        const data=await admin.auth().verifyIdToken(tokenId);
        const uid=data.uid;
        const email=data.email;
        const role = await getUser(uid);
        const name = await getName(uid);

        const payload=
        {
            uid:uid,
            name:name,
            email:email,
            role:role,
        }
         const token = jwt.sign(payload, process.env.JWT_SECRET_MESSAGE, { expiresIn: '1h' });
         res.status(200).json({
                    message: "Token verified",
                    token, 
                    uid,
                    name,
                    email,
                    role,   
                });
    }
    catch(err)
    {
        console.log(err)
    }
}

export async function registerUser(req,res)
{
    try{
    const validate=registerSchema.safeParse(req.body);
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
    const {token}=req.body;
    const {name}=req.body;
    if(token=="")
    {
        return res.send("Token is missing");
    }
    console.log(token);
    const verify=await admin.auth().verifyIdToken(token);
    console.log(verify);
    const uid=verify.uid;
    const email=verify.email;
    await db.doc(`users/${uid}`).set({
        uid,
        name,
        email,
        role: "owner",
        createdAt: admin.firestore.FieldValue.serverTimestamp(), 
    });
    const defaultPageRef = admin.firestore().collection("pages").doc();

    await defaultPageRef.set({
    pageId: defaultPageRef.id,
    title: "Getting Started",
    ownerId: uid,
    sharedWith: {},
    content: [],
    parentPageId: null,
    isTrashed: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(201).json({
        message: "User registered successfully",
        uid,
        email,
        name,
        role: "owner",
    });
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Server Issue" });

    }
}

export function AuthenticateAndSendData(req,res)
{
    try{
    const authHeader = req.headers["authorization"];
    const token=authHeader && authHeader.split(' ')[1];

    if(token==null)
    {
        return res.sendStatus(401); //UnAuthorized...!
    }

    jwt.verify(token,process.env.JWT_SECRET_MESSAGE,(err,user)=>
    {
         if (err) {
            return res.sendStatus(403); //Forbidden
        }
        return res.status(200).json(user);
    });
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send("Something Went wrong");
        
    }
}
