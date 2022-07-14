import mongoose from 'mongoose';
/*import bcrypt from "bcrypt";
import crypto from "crypto";*/
const adminSchema = mongoose.Schema({
 adminname: String,
 email: String,
 hash: String,
 salt: String,
 refreshT: String,
 dateCreation: String,
 blocked: Boolean,
 admin : Boolean,
 adminType : String,
})
export default mongoose.model('admins', adminSchema)