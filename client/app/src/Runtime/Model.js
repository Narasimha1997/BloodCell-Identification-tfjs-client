import { mod } from '@tensorflow/tfjs';

var tensorflow = require('@tensorflow/tfjs')


class NeuralNetwork{
    build(){
        const model = tensorflow.sequential()
        model.add(tensorflow.layers.conv2d({
            inputShape : [80, 80, 3],
            strides : 1,
            filters : 80,
            kernelSize : 3,
            activation : 'relu'
        }))
        model.add(tensorflow.layers.conv2d({
            strides : 1,
            filters : 64,
            kernelSize : 3,
            activation : 'relu'
        }))

        model.add(tensorflow.layers.maxPooling2d({poolSize : [2,2]}))
        model.add(tensorflow.layers.conv2d({
            strides : 1,
            filters : 64,
            kernelSize : 3,
            activation : 'relu'
        }))
        model.add(tensorflow.layers.dropout({rate : 0.25}))
        model.add(tensorflow.layers.flatten())

        //Dense Perceptron
        model.add(tensorflow.layers.dense({units : 128, activation : 'relu'}))
        model.add(tensorflow.layers.dropout({rate : 0.5}))
        model.add(tensorflow.layers.dense({units : 4, activation : 'softmax'}))
        return model
    }

    //use this method, if you need the optimizer to be included in the model (Experimental)
    buildWithBackProp(){
        const model = this.build()
        model.compile({
            optimizer : tensorflow.train.adadelta(1.0, 0.95, null),
            loss : 'categoricalCrossentropy',
            metrics : ['accuracy']
        })
        return model
    }
}

