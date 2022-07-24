import mongoose from "mongoose";

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/benola');
}

const { Schema } = mongoose;


const userSchema = new Schema({
    firstName: String,
    lastName: String,
    gender: String,
    email: String,
    phone: String,
    password: String,
    date_created: {type: Date, default: Date.now},
    last_updated: {type: Date, default: Date.now},
})

// class User {
// }
//
// userSchema.loadClass(User)
// console.log("user schema", userSchema)

export const User = mongoose.model("user", userSchema);

