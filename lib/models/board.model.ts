import mongoose from "mongoose"

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  imageId: {
    type: String
  },
  imageThumbUrl: {
    type: String
  },
  imageFullUrl: {
    type: String
  },
  imageUserName: {
    type: String
  },
  imageLinkHTML: {
    type: String
  },
  lists: [{
    type: String, // or mongoose.Schema.Types.ObjectId
    ref: "List"
  }]
}, { timestamps: true })

const Board = mongoose.models.Board || mongoose.model("Board", boardSchema)

export default Board