import React, { Component } from "react";
// import PropTypes from 'prop-types'
import PaletteItem from "./PaletteItem";
import LoadingAnimation from "./LoadingAnimation";
import ErrorSnackbar from "./ErrorSnackbar";

let imageStyles = {
  width: "100%"
};

export default class Palette extends Component {
  constructor(props) {
    super(props);
    this.state = {
      palettes: {},
      loading: false,
      loadMessage: "",
      errorMessage: "",
      successMessage: "",
      snackbarShow: false
    };
  }

  componentDidMount() {
    this.fetchPalettes();
  }

  componentDidUpdate(prevProps) {
    if (this.props.imageUrl !== prevProps.imageUrl) {
      this.fetchPalettes();
    }
  }

  checkImage(imageSrc, good, bad) {
    var img = new Image();
    img.onload = good;
    img.onerror = bad;
    img.src = imageSrc;
  }

  fetchPalettes() {
    this.checkImage(
      this.props.imageUrl,
      () => {
        // Good image url
        this.setState(
          {
            snackbarShow: false,
            palettes: {},
            loading: true,
            loadMessage: "Please wait while your image is being analyzed"
          },
          () => {
            let encodedUrl = encodeURIComponent(this.props.imageUrl);
            let url = `/api/palette/image=${encodedUrl}`;
            fetch(url)
              .then(this.handleFetchErrors)
              .then(res => res.json())
              .then(data => {
                this.setState({
                  palettes: data,
                  loading: false
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        );
      },
      () => {
        // Bad image url
        this.handleError("Bad image url. Please try a different URL.");
      }
    );
  }

  handleFetchErrors = request => {
    if (!request.ok) {
      this.handleError(`${request.status} ${request.statusText}`);
    }
    return request;
  };

  handleError = message => {
    console.log("error: ", message);
    this.setState({
      errorMessage: `Error: ${message}`,
      successMessage: "",
      snackbarShow: true,
      loading: false
    });
  };

  closeSnackbar = () => {
    this.setState({ snackbarShow: false, errorMessage: "" });
  };

  handleCopy = text => {
    // console.log("handling copy: " + text);
    this.setState({
      errorMessage: "",
      successMessage: "Successfully copied to clipboard: " + text,
      snackbarShow: true
    });
  };

  render() {
    let { imageUrl } = this.props;
    let {
      palettes,
      loading,
      loadMessage,
      errorMessage,
      successMessage,
      snackbarShow
    } = this.state;
    let paletteItems;
    if (Object.keys(palettes).length > 0) {
      paletteItems = [];
      for (let property in palettes) {
        if (palettes.hasOwnProperty(property)) {
          // console.log(property)
          // console.log(palettes[property].rgb.map(num=>Math.round(num)))
          paletteItems.push(
            <PaletteItem
              key={property}
              colors={palettes[property].rgb.map(num=>Math.round(num))}
              type={property}
              onCopy={this.handleCopy}
            />
          );
        }
      }
    }

    return (
      <React.Fragment>
        <div className={"content-container"}>
          <div className={"image-container"}>
            <img style={imageStyles} src={imageUrl} alt="" />
          </div>
          <div className={"palette-container"}>
            {paletteItems}
            {loading && <LoadingAnimation message={loadMessage} />}
            <ErrorSnackbar
              snackbarShow={snackbarShow}
              errorMessage={errorMessage}
              successMessage={successMessage}
              closeSnackbar={this.closeSnackbar}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
