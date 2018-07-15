import React from 'react'
import ReactDOM from 'react-dom'
import 'bulma/css/bulma.css'
import Line from 'rc-progress'

import {ModelContainer, runInference, afterPrediction} from './Initializer'

let modelCache = new ModelContainer(null)
modelCache.loadFromURL('http://192.168.0.105:5443/model_metadata')

class MainClass extends React.Component{
    constructor(){
        super()
        this.state = {
            can_change : false
        }
    }

    render(){
        return (
            <div className = "container" style = {{margin : '20px auto', textAlign : 'center', width : '90%', paddingTop : '100px'}}>
               <h3 className = "title is-3">Hello! I am Mark 40</h3>
               <p>I can assist doctors and lab technecians to identify blood cell type!</p>
               <p>And I am still evolving</p>
               <button className = "button is-info is-rounded" style = {{marginTop : '30px'}}
               onClick = {() => {
                   ReactDOM.render(<HomePage />, document.getElementById('root'))
               }}>Get started</button>
            </div>
        )
    }
}

class HomePage extends React.Component {
    constructor(){
        super()
        this.state = {
            image_element : null,
            model_from_cache : null,
            image_file : '',
            show_predict : false,
            show_result : false,
            scores : null
        }
    }
    render(){
        return (
            <div className = "container" style = {{margin : "30px auto"}}>
                <div className = "box" style = {{width : '100%', textAlign : 'center'}}>
                   <div style = {{textAlign : 'center'}}>
                       {console.log(this.state.image_file)}
                       <img src = {this.state.image_file} id = "image_container" width = "80px" height = "80px"/>
                   </div>
                   <label className = "label">Upload sample
                   <input className = "input is-rounded is-danger" onChange = {(event) => {
                       let reader = new FileReader()
                       reader.onload = (e) => {
                        this.setState({image_file : e.target.result, show_predict : true})
                       }
                       reader.readAsDataURL(event.target.files[0])
                   }} type = "file"></input>
                   </label>
                </div>
                {
                    (this.state.show_predict) && (
                        <div style = {{margin : '40px 40px 40px 40px', textAlign : 'center'}}>
                            <button className = "button is-rounded is-danger" onClick = {
                                () => {
                                    let result = runInference(modelCache, document.getElementById('image_container'))
                                    this.setState({
                                        scores : this.computeScore(result),
                                        show_result : true
                                    })

                                }
                            }>Predict</button>
                        </div>
                    )
                }{
                    (this.state.show_result) && (
                        <div className = "box" style = {{marginTop : '50px auto', width : '95%'}}>
                            <div style = {{margin : '30px'}}>
                                <label className = "label">EOSINOPHIL {new String(this.state.scores.EOSINOPHIL)}</label>
                                <progress className = "progress is-danger is-rounded" value = {new String(this.state.scores.EOSINOPHIL)} max = "100"/>
                            </div>
                            <div style = {{margin : '30px'}}>
                                <label className = "label">LYMPHOCYTE {new String(this.state.scores.LYMPHOCYTE)}</label>
                                <progress className = "progress is-danger is-rounded" value = {new String(this.state.scores.LYMPHOCYTE)} max = "100"/>
                            </div>
                            <div style = {{margin : '30px'}}>
                                <label className = "label">MONOCYTE {new String(this.state.scores.MONOCYTE)}</label>
                                <progress className = "progress is-danger is-rounded" value = {new String(this.state.scores.MONOCYTE)} max = "100"/>
                            </div>
                            <div style = {{margin : '30px'}}>
                            <label className = "label">NEUTROPHIL {new String(this.state.scores.NEUTROPHIL)}</label>
                                <progress className = "progress is-danger is-rounded" value = {new String(this.state.scores.NEUTROPHIL)} max = "100"/>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }

    computeScore(predictions) {
        let sum = 0;
        for(var i = 0; i < predictions.length; i++) sum+=predictions[i]

        //cumpute proportions
        let proportions = []
        for(var i = 0; i < predictions.length; i++){
            let prop = (predictions[i] * 100)/sum
            proportions.push(prop)
        }

        return {
            EOSINOPHIL : proportions[0],
            LYMPHOCYTE : proportions[1],
            MONOCYTE : proportions[2],
            NEUTROPHIL : proportions[3]
        }
    }
}

export default MainClass