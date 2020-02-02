import React from "react";
import ImageUpload from "./components/ImageUpload";
import PaletteIcon from '@material-ui/icons/Palette';

function App() {
  return (
    <div className="container">
      <h1><PaletteIcon fontSize={'large'}/>Palette Generator</h1>
      <ImageUpload />
    </div>
  );
}

export default App;
