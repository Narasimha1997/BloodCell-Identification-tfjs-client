var tensorflow = require('@tensorflow/tfjs')

// keeping this in memory for long time might crash the entire system
// I have added a method to provide garbage collection
// Initialize this class with build() method of neural network
// pass null, if you are loading nn from URL
class ModelContainer {
    constructor(nn){
        this.nn = nn
    }
    setWeights(weights){
        //use json weights file
    }
    async loadFromURL(url){
        console.log(url)
        this.nn = await tensorflow.loadModel(url)
        console.log(this.nn)
    }
    removeNetwork(){
        this.nn = null
    }

    swapToNewObject(){
        let new_nn = this.nn
        this.nn = null
        return new_nn
    }

    obtainMemorySafe(){
        return this.swapToNewObject()
    }

    obtain(){
        return this.nn
    }
}



function runInference(modelContainer, imageData){
    //perform a sawp, i.e obtain network object from container
    imageData.style.width = "80px";
    imageData.style.height = "80px";
    let nn = modelContainer.obtainMemorySafe()
    let pixels = tensorflow.fromPixels(imageData)
    pixels = pixels.reshape([1, 80, 80, 3])
    pixels.dtype = 'float32'
    pixels = tensorflow.div(pixels, 255)
    let predictions = nn.predict(pixels)
    modelContainer.nn = nn
    nn  = null
    return predictions.dataSync()
}

function afterPrediction(predictions){
    //as of now
    console.log(predictions)
}

export {ModelContainer, runInference, afterPrediction} 