import React from "react";
// import { withTheme } from "@material-ui/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import FileCopyIcon from '@material-ui/icons/FileCopy';

// onCopy is a function, send it what you copied
const PaletteItem = ({ colors, type, onCopy }) => {
  // console.log(colors);
  // should be array of length 4
  let containerStyle = {
    display: "flex",
    width: "100%",
    height: "70px",
    margin: "auto",
    border: "1px solid black"
  };
  let styles = {
    width: "50%",
    margin: "auto",
    backgroundColor: "white"
  };

  let rgbString = `RGB(${colors[0]}, ${colors[1]}, ${colors[2]})`;
  let hexString = "#" + colors.map(v => rgbToHex(v)).join("");

  let colourDiv = {
    width: "50%",
    backgroundColor: rgbString,
    cursor: 'pointer',
    textAlign: 'center'
  };

  // let el;

  // useEffect(()=>{
  //   el = document.querySelector(`#${type}`)
  // }, [])

  // let colorItem = React.createRef();

  const handleCopy = text => {
    // console.log(colorItem.current)
    let el = document.querySelector(`#${type}`)
    onCopy(hexString)
    console.log('adding class')
    el.classList.add('copied');
    setTimeout(()=>{
      console.log('removing class')
      if (el) {
        el.classList.remove('copied')
      }
    }, 3000)
  }

  return (
    <React.Fragment>
      <div style={containerStyle}>
        <div style={styles}>
          <div>
            <em>{type}</em>
          </div>
          <CopyToClipboard 
          text={rgbString}
          onCopy={() => handleCopy(rgbString)}
          >
            <div className={"rgbString"} title={`Click to copy ${rgbString}`}>{rgbString}</div>
          </CopyToClipboard>
          <CopyToClipboard 
          text={hexString}
          onCopy={() => handleCopy(hexString)}
          >
            <div className={"hexString"} title={`Click to copy ${hexString}`}>{hexString}</div>
          </CopyToClipboard>
        </div>
        <CopyToClipboard 
          text={hexString}
          onCopy={() => handleCopy(hexString)}
        >
          <div className="paletteItemColor" id={type} style={colourDiv} title={`Click to copy ${hexString}`}>
            <FileCopyIcon/>
          </div>
        </CopyToClipboard>
      </div>
    </React.Fragment>
  );
};

var rgbToHex = function(rgb) {
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

export default PaletteItem;
