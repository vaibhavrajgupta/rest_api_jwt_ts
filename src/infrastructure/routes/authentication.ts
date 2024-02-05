import { login, register } from "../../application/controllers/authentication/authentication";
import express from "express";


export default(router : express.Router)=>{
    router.post('/auth/register', register);
    router.post('/auth/login', login);
}
