const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    record: { type: String, required: true },
    date: {
        type: Number,
        required: true,
        default: Date.now()
    },
    type: { type: String, default: 'incomplete' }
})

const model = mongoose.model('TodoModel', TodoSchema)

module.exports = model