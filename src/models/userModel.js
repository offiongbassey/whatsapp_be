import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"]
    },
    phone: {
        type: String,
        required: [true, "Please provide your Phone Number"],
        unique: [true, "Phone Number already used"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email address"],
        unique: [true, "This email address already exist"],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email address"]
    },
    
    picture: {
        type: String,
        default: "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
    },
    status: {
        type: String,
        default: 'Hey there! I am using whatsapp',

    },
    password: {
        type: String,
        required: [true, "Please provide your password"],
        minLength: [6, "Please make sure your password is atleast 6 characters long"]
    }
},{
    collection: "users",
    timestamps: true,
});

userSchema.pre('save', async function(next) {
    try {
        if(this.isNew){ 
            const salt = await bcrypt.genSalt(12);
            const hashed_password = await bcrypt.hash(this.password, salt);
            this.password = hashed_password;
        }
        next();
    } catch (error) {
        next(error);
    }
})

const UserModel = mongoose.models.UserModel || mongoose.model('UserModel', userSchema);

export default UserModel;