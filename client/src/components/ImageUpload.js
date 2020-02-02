import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import { Box, Button } from "@material-ui/core";
import Dropzone from "react-dropzone";
import Palette from "./Palette";
import checkImage from "../scripts/checkImage";
import LoadingAnimation from "./LoadingAnimation";
import imageCompression from "browser-image-compression";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

// TODO: fix css for focus, and fix click area of dropzone

const formStyles = {
  margin: "20px 0 20px 0"
};

export default class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: "",
      validUrl: false,
      loading: false,
      loadMessage: ""
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    let inputField = document.querySelector("#standard-basic");
    if (inputField.value) {
      // TODO: Check if URL is valid image
      // this is being done in 'Palette.js' currently but should be global via redux
      console.log("new url: ", inputField.value);
      this.setState(
        {
          imageUrl: inputField.value,
          validUrl: true
        },
        () => {
          inputField.value = "";
        }
      );
    }
  };

  handleDropzoneChange = files => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920
    };
    this.setState({
      imageUrl: "",
      validUrl: false,
      loading: true,
      loadMessage: "Please wait while image is being uploaded"
    });
    imageCompression(files[0], options).then(compressedImage => {
      // console.log(compressedImage);
      // console.log(files[0])
      // let img = files[0];
      let img = compressedImage;
      if (img) {
        const formData = new FormData();
        formData.append("image", img);
        // console.log(formData);

        fetch("/image-upload", {
          method: "POST",
          body: formData
        })
          .then(res => res.json())
          .then(data => {
            // console.log("setting state for new image url: ", data.url);
            checkImage(
              data.url,
              () => {
                // good
                this.setState({
                  imageUrl: data.url,
                  validUrl: true,
                  loading: false,
                  loadMessage: ""
                });
              },
              () => {
                // bad
                this.setState({
                  imageUrl: data.url,
                  validUrl: false,
                  loading: false,
                  loadMessage: ""
                });
              }
            );
          });
      }
    });
  };

  render() {
    let { imageUrl, validUrl, loading, loadMessage } = this.state;

    return (
      <Box m={2}>
        Paste an image URL or upload an image in order to receive a colour
        palette based on the colours detected in the image.
        <form
          style={formStyles}
          onSubmit={this.handleSubmit}
          noValidate
          autoComplete="off"
        >
          <div style={{ width: "100%", display: "flex" }}>
            <div style={{ flexGrow: "100" }}>
              <TextField fullWidth id="standard-basic" label="Image URL" />
            </div>
            <div style={{ flexGrow: "0" }}>
              <Button variant="contained" color="primary" type="submit">
                Submit URL
              </Button>
            </div>
          </div>
          <div style={{ width: "100%", margin: "auto" }}>
            <Dropzone onDrop={this.handleDropzoneChange}>
              {({ getRootProps, getInputProps }) => (
                <section className="dropzone">
                  <div {...getRootProps()}>
                    <input
                      {...getInputProps({
                        accept: "image/jpeg, image/png, image/bmp"
                      })}
                    />
                    <CloudUploadIcon/>
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                    <em>
                      (Only *.jpeg, *.png and *.bmp images will be accepted)
                    </em>
                    
                  </div>
                </section>
              )}
            </Dropzone>
            {loading && <LoadingAnimation message={loadMessage} />}
          </div>
        </form>
        {validUrl && <Palette imageUrl={imageUrl} />}
      </Box>
    );
  }
}
