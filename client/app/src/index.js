import React from 'react'
import ReactDOM from 'react-dom'
import register from './registerServiceWorker'

import MainClass from './Runtime/MainComponent'

register()

ReactDOM.render(
    <div>
       <MainClass />
    </div>, document.getElementById('root')
)