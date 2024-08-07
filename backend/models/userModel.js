import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true,
        default: "080",
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        //required: true,
        default: false
    },
    isSeller: {
        type: Boolean,
        //required: true,
        default: false
    },
    address: [{
        address: {type: String, required: true},
        localGovt: {type: String, required: true},
        state: {type: String, required: true},
        isDefault: {type: Boolean, required: true, default: false},
    }]
}, {timestamps: true})

// Method to set an address as default
userSchema.methods.setDefaultAddress = async function(addressId) {
    // First, set all addresses' isDefault to false
    this.address.forEach(addr => {
        addr.isDefault = false;
    });

    // Then, find the address by id and set it as default
    const addressIndex = this.address.findIndex(addr => addr._id.equals(addressId));
    if (addressIndex > -1) {
        this.address[addressIndex].isDefault = true;
        await this.save();
        return this.address[addressIndex];
    } else {
        throw new Error('Address not found');
    }
};

export default mongoose.model("User", userSchema)
