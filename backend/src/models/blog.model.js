import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    title: { type: String, required: true },
    tone: { type: String },
    language: { type: String },

    content: { type: String }, 

    images: [
      {
        url: String,
        source: String 
      }
    ],

  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
