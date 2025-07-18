import jwt from 'jsonwebtoken';
export function authMiddleware(req,res,next)
{
    const authHeader=req.headers["authorization"];
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
        req.user=user;
        next();
    });
}