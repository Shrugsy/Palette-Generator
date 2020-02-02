import React from 'react';

const Loading = ({message}) => {
    return (<React.Fragment>
        <div className="loader" id="loader-4">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div>{message}</div>
        </React.Fragment>)
}
export default Loading