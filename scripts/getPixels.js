const skmeans = require('skmeans');
const pixels = require('image-pixels');

// let img = './images/lobster_dog.jpg';
// let img = './images/palette.png';
// let img = './images/white_blue.png';
// let img = './images/greenish50.png';

module.exports = {
    getPixels: async function(img){
        let {data, width, height} = await pixels(img);
    
        if (width < 5 || height < 5) {
            console.log('Error: image resolution too small. Minimum resolution 5px x 5px.');
            return null
        }
        return data
    },
    
    getColors: function(data, numClusters){
        let myData = chunkArray(data,4);
        let res =  skmeans(myData, numClusters);
        console.log(res)
        return res.centroids.map(arr => 
            arr.map(val => Math.round(val))
        )
    }
}

function chunkArray(arr, chunk){
    if (chunk <= 0) {return null}

    let i = 0,
        j = arr.length,
        newArr = [];
    for (i=0; i < j; i += chunk){
        newArr.push(arr.slice(i, i+chunk));
    }
    return newArr
}

// getPixels(img, 5)