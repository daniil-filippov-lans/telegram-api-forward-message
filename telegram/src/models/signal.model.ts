import mongoose from 'mongoose';

const SignalSchema = new mongoose.Schema(
    {
        srcChannelId: {
            type: String,
            required: true,
        },
        srcMsgId: {
            type: Number,
            required: true,
        },
        desChannelId: {
            type: String,
        },
        desMsgId: {
            type: Number,
        },
        msg: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Signal', SignalSchema);
