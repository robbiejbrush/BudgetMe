import React from 'react';
import '../css/App.css'

function NavBar({ pageName, userName }) {
  return (
        <div className="NavBar">
          <div style={{ flex: 1, textAlign: 'left' }}>
            {/*Burger menu*/}
          </div>
          <div>
            <h1 className = "AppBarHeading"> { pageName } </h1>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <h1 className= "AppBarUser"> { userName } </h1>
          </div>
        </div>
  )
}

export default NavBar;