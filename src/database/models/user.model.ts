import { model, Schema } from "mongoose";

const UserSchema = new Schema({

    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    avatar: {
        public_id: String,
        url: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // custome email validation 
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email address format',
        },
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "password must contain at least 6 charaters."]
    },
    password_reset_config: {
        token: String,
        expiry: Date
    },
    email_verification: {
        otp: String,
        expiry: Date
    },
    role: {
        type: String,
        enum: ["user", "owner", "admin"],
        default: "user"
    },
    recomendation: {
        city: String,
        flat: Boolean,
        Hostel: Boolean,
        PG: Boolean,
    },
    phone_no: {
        type: Number
    }

}, {
    timestamps: true
})


const User = model("User", UserSchema);
export { User }