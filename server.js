const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Todo = require('./models/todo')

const app = express();

app.use(express.json())

mongoose.connect('mongodb://localhost:27017/mongotodo')


app.use('/', express.static(path.resolve(__dirname, 'assets')));
// app.get('/index', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'assets/index.html'))
// })

// get Incompleted tasks
app.get('/api/getInComplete', async(req, res) => {
    const records = await Todo.find({ type: 'incomplete' })
        // console.log("Records => ", records);
    res.json(records)
})

// get completed tasks
app.get('/api/getComplete', async(req, res) => {
    const records = await Todo.find({ type: 'complete' })
        // console.log("Records => ", records);
    res.json(records)
})

app.post('/api/create', async(req, res) => {
    const record = req.body

    const response = await Todo.create(record)

    res.json({
        status: 'ok',
        'msg': record
    })
})

// make item complete
app.post('/api/makeComplete', async(req, res) => {
    const id = req.body


    const response = await Todo.updateOne({ _id: id }, {
            $set: {
                type: 'complete'
            }
        }

    )
})

// update record
app.post('/api/update', async(req, res) => {
    const { id, record } = req.body


    const response = await Todo.updateOne({ _id: id }, {
            $set: {
                record: record
            }
        }

    )
    if (response.n == 1) {
        res.json('success')
    }

})

// delete Item
app.post('/api/deleteItem', async(req, res) => {
    const id = req.body


    const response = await Todo.deleteOne({ _id: id })
    console.log(response)

})



app.listen(13371, () => {
    console.log('server started')
})