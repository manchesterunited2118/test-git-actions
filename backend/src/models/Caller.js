import mongoose from "mongoose";

const callerSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  numberRegion:{
    contry:String,
    state: String,
    source:{
        type: String,
        enum: ["provider", "user-submitted", "unknown"],
        default: "unknown"
    },
    updateAt: Date,
  },
  locationSharingEnabled: {
      type: Boolean,
      default: false,
    },
    liveLocation: {
      city: String,
      state: String,
      updatedAt: Date,
    },
},{ timestamps: true });

export default mongoose.model("Caller",callerSchema)
