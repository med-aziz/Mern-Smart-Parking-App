
import mongoose from 'mongoose'

const placeReservationSchema = mongoose.Schema({
    username: String,
    beginReservation: String,
    endReservation: String,
    namePlace: String,
    beginDateReservation: String,
    endDateReservation: String
})
export default mongoose.model('placeReservation', placeReservationSchema)