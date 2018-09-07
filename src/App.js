import React, { Component } from 'react';
import './App.css';
import Hotel from './Hotel';
import Background from './vacation.jpg';

class App extends Component {
    render () {
        return(
            <div className="admin-bg">
                <img src={Background} alt="background" className="bg" />
                <Hotel/>
                </div>
        )
    }
}

export default App;