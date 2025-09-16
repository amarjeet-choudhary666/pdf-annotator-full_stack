import mongoose, { Schema, Document } from 'mongoose';

export interface IPDF extends Document {
  uuid: string;
  filename: string;
  filepath: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PDFSchema: Schema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  filename: {
    type: String,
    required: true
  },
  filepath: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const PDF = mongoose.model<IPDF>('PDF', PDFSchema);
