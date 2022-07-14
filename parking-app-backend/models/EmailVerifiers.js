import mongoose from 'mongoose'
// create users collection
const emailVerifiersSchema = mongoose.Schema({
  username: String,
  verifCode: String
})
export default mongoose.model('emailverifs', emailVerifiersSchema)