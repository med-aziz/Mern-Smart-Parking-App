import mongoose from 'mongoose'
// create users collection
const userSchema = mongoose.Schema({
  username: String,
  email : String,
  hash: String,
  salt: String,
  number: String,
  numidentity: String,
  dateCreation: String,
  refreshT : String,
  subscription: Number,
  verifiedState: Boolean,
  blocked : Boolean,
  admin: Boolean
 })
export default mongoose.model('users', userSchema)