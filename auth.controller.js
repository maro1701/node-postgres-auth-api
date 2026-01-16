import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {pool} from '../db.js';
import {registerSchema,loginSchema} from '../schemas/auth.schema.js';
export async function register(req,res,next){
   const {email,password} =registerSchema.parse(req.body);
   
   try{
      const exists = await pool.query(`SELECT id FROM users WHERE email = $1`,[email]);
      if(exists.rows.length>0){
         return res.status(400).json({
            message:'YOU ALREADY EXISTS!'
         });
      }
      const hashed = await bcrypt.hash(password,10);

      const result = await pool.query(`INSERT INTO users(email,password) VALUES($1,$2) RETURNING id,email`,[email,hashed]);

         return res.status(201).json({
            success:true,
            message:'USER CREATED!',
            data:result.rows[0]
         })

   } catch(err){
      next(err);
   }
}
export async function login(req,res,next){
    const {email,password} = loginSchema.parse(req.body);
   
   try{
      const result = await pool.query(`SELECT id,email,password FROM users WHERE email = $1`,[email]);
      if(result.rows.length===0){
         return res.status(400).json({
            message:`YOU DON'T HAVE RECORDS IN THE DB`
         });
      }
      const user = result.rows[0];

      const isMatch = await bcrypt.compare(password,user.password);
      if(!isMatch){
         return res.status(401).json({
            message:`PASSWORDS DON'T MATCH IN THE DB`
         });
      }
      const token = jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:'5h',issuer:'todo-api'});

      return res.status(200).json({
         success:true,
         message:'Login Successful',
         data:token
      })
   } catch(err){
      next(err);
   }
}

export function getMe(req,res){
   return res.status(200).json(req.user);
}