import React from "react";
import '../PageHeader/PageHeader.css';

export const PageHeader = ({ title, children, actions }) => {
  return (
    <div className= "HeaderDiv">
      <div className="HeaderLeft">{children}</div>
      
      <h1 className="HeaderCenter">{title}</h1>

      <div className="HeaderRight">
        {actions || <div className="EmptyDiv" />}
      </div>
    </div>
  );
};