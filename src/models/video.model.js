import mongoose, { Schema } from 'mongoose';
import mongooseAggregratePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new Schema(
  {
    videofie: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String, //Cloudinary url
      required: true,
    },
    tittle: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    view: {
      type: Number,
      default: 0,
    },
    ispublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);
videoSchema.plugin(mongooseAggregratePaginate);

export const Video = mongoose.model('Video', videoSchema);
