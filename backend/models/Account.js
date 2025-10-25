import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },   // User Name
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Role Info
  role: { 
    type: String, 
    enum: ["superadmin", "admin", "editor", "custom"], 
    default: "editor" 
  },

  // Extra Role Fields
  roleName: { type: String },                 
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }, 
  workspaceName: { type: String },           
  // tag: { type: String },  
  tag: [{ 
  type: String, 
  enum: ["data", "designer", "product", "manager", "qa", "system design", "supporter"] 
}],
                  

  // Status
  status: { type: String, enum: ["Active","Inactive"], default: "Active" },

}, { timestamps: true });

export default mongoose.model("Account", accountSchema);
