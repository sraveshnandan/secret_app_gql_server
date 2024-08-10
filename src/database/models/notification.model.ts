import { model, Schema } from "mongoose";

const NotificationSchema = new Schema({
    unreaded: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    reciver: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true })

const Notification = model("Notification", NotificationSchema);
export { Notification }