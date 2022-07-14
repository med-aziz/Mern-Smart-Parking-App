
import mongoose from 'mongoose';

const userSubscriptionSchema = mongoose.Schema({
 userId: String,
 dateCreation: String,
 period: String,
 blocked: Boolean
})
export default mongoose.model('userSubscriptioninformations', userSubscriptionSchema)