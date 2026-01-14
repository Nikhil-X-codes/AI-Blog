import mongoose from "mongoose";

const blogVersionSchema = new mongoose.Schema(
  {
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },

    section: { type: String }, 
    previousText: String,
    regeneratedText: String,

    action: {
      type: String,
      enum: ["rewrite", "seo", "toneChange"]
    }
  },
  { timestamps: true }
);

export default mongoose.model("BlogVersion", blogVersionSchema);
