import { model, Schema } from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        public_id: String,
        url: String
    },
    createor: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

}, { timestamps: true })

const Category = model("Category", CategorySchema);
export { Category }