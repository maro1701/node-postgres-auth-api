import jwt from 'jsonwebtoken';


export default function protect (req,res,next){
   const authHeader = req.headers.authorization;
   if(!authHeader||!authHeader.startsWith('Bearer ')){
      return res.status(400).json({
         message:'Authorization header is needed'
      })
   }
   const token = authHeader.split(' ')[1];
   try{
      const decoded = jwt.verify(token,process.env.JWT_SECRET,{issuer:'todo-api'});
      req.user=decoded;
      next();
   } catch(err){
      next(err);
   }
}