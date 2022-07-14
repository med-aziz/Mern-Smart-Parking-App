import mongoose from 'mongoose'

const barrierSchema = mongoose.Schema({
    userId: String,
    type: String,
    status: Boolean
})
export default mongoose.model('barrier', barrierSchema)