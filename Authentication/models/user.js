const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username:{
        type:String,
        required:[true,'username cannot be blank']
    },
    password:{
        type:String,
        required:[true,'password cannot be blank']
    }
})
userSchema.statics.findAndValidate = async function(username,password){
    const foundUser = await this.findOne({username});
    if(!foundUser) return false;
    const isvalid = await bcrypt.compare(password,foundUser.password);
    return isvalid?foundUser:false;
}
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    next();
})
module.exports = mongoose.model('User',userSchema); 
