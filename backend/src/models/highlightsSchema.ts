// models/Highlight.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IHighlight extends Document {
  pdfUuid: string;
  user: mongoose.Types.ObjectId;
  page: number;
  text: string;
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  timestamp: Date;
}

const HighlightSchema: Schema = new Schema({
  pdfUuid: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  page: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  position: {
    top: { type: Number, required: true },
    left: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IHighlight>('Highlight', HighlightSchema);
