const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    company_Id: { type: Number, default: 0 },
    user_Id: { type: Number, required: true, unique: true },
    password: { type: String, required: true }, // Encrypted password
    first_Name: { type: String, required: true },
    last_Name: { type: String, required: true },
    role_Id: { type: Number, required: true },
    role_Name: { type: String, required: true },
    full_Name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    last_Login: { type: Date },
    failed_Login: { type: Date, default: null },
    failed_Attempt: { type: Number, default: 0 },
    is_Locked: { type: Boolean, default: false },
    is_Active: { type: Boolean, default: true },
    is_DailyStatusRequired: { type: Boolean, default: true },
    dts: { type: Date, default: null }, // Daily status timestamp
    salt: { type: String, default: null }, // For encryption if needed
    is_Deleted: { type: Boolean, default: false },
    created_On: { type: Date, default: Date.now },
    modified_On: { type: Date, default: Date.now },
    created_By: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    modified_By: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    creditPoints: { type: Number, default: 0 },
    profilePath: { type: String, default: null },
    workingFor: { type: String, default: null },
    isThirdPartyAdmin: { type: Boolean, default: false },
    app_Id: { type: mongoose.Schema.Types.ObjectId, ref: "App", default: null }, // Link to application if needed
    employmentType: { type: String, default: null },
    qrCode: { type: String, default: null },
  },
  { timestamps: true } // Automatically handles `createdAt` and `updatedAt`
);

const User = mongoose.model("User", userSchema);

module.exports = User;
