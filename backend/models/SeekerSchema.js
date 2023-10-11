import mongoose from 'mongoose';

// schema for job seekers
const SeekerSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    personal_info: {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        personal_statement: {
            type: [String],
            required: false
        },
        school: {
            type: String,
            required: true
        }
    },
    jobs_completed: [{
        _id: {
            type: String,
            required: true
        }
    }]
});



const Seekers = mongoose.model("Seekers", SeekerSchema);
export default Seekers;