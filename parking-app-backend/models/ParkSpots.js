import mongoose from 'mongoose'
// create users collection
const ParkSpotsSchema = mongoose.Schema({
    name : String,
    state : Boolean
})
export default mongoose.model('parkspots', ParkSpotsSchema)