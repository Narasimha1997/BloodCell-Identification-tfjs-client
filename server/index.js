let express = require('express')
let cors = require('cors')
let path = require('path')

var app = express()

let static_path = path.join(__dirname, 'ModelData/model_data')

app.use(cors())
app.use(express.static(static_path))

app.get('/model_metadata', (req, resp) => {
    resp.sendFile(static_path+'/model.json')
})

app.listen(5443, () => console.log('Serving tfjs model on express API server'))