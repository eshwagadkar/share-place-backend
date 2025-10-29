import mongoose from 'mongoose'
const { Schema } = mongoose

import mongooseUniqueValidator from 'mongoose-unique-validator'

const userSchema = new Schema({ 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    image:{ type: String, required: true },
    places:{ type: String, required: true }
})

userSchema.plugin(mongooseUniqueValidator)

export default mongoose.model('User', userSchema)