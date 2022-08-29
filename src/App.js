import { useState } from 'react';
import './App.css';
import piexif from 'piexifjs';
function App() {

  const [image, setImage] = useState(null);
  const [exifData, setExifData] = useState(null);

  const onImageChange = async (e) => {
    setImage(URL.createObjectURL(e.target.files[0]))
    const base64Image = await getBase64(e.target.files[0])
    setExifData(piexif.load(base64Image))
    // debugExif(piexif.load(base64Image))
    console.log(piexif.load(base64Image))
  }

  const getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
      console.log(fileInfo);
    });
  };

  function debugExif(exif) {
    for (const ifd in exif) {
        if (ifd === 'thumbnail') {
            const thumbnailData = exif[ifd] === null ? "null" : exif[ifd];
            console.log(`- thumbnail: ${thumbnailData}`);
        } else {
            console.log(`- ${ifd}`);
            for (const tag in exif[ifd]) {
                console.log(`    - ${piexif.TAGS[ifd][tag]['name']}: ${exif[ifd][tag]}`);
            }
        }
    }
}

  return (
    <div className="App">
      {image && <img src={image} style={{maxWidth: '200px'}} alt="uploaded"/>}
      <h1>Exif Metadata Scrubber</h1>
      <form>
        <h2>Your Device</h2>
        <p>Make: {exifData?.['0th'] && exifData['0th'][piexif.ImageIFD.Make]}</p>
        <p>Model: {exifData?.['0th'] && exifData['0th'][piexif.ImageIFD.Model]}</p>
        <p>Software: {exifData?.['0th'] && exifData['0th'][piexif.ImageIFD.Software]}</p>
        <p>Orientation: </p>

        <h2>Date/time taken</h2>
        <p>Date: {exifData?.['0th'] && exifData['0th'][piexif.ImageIFD.DateTime].substring(0, 10).replaceAll(':', " ")}</p>
        <p>Time: {exifData?.['0th'] && exifData['0th'][piexif.ImageIFD.DateTime].substring(11, 19)}</p>

        <h2>Location</h2>
        <p>Latitude: {exifData?.['GPS'] &&  exifData['GPS'][piexif.GPSIFD.GPSLatitude]}</p>
        <p>Longitude: {exifData?.['GPS'] && exifData['GPS'][piexif.GPSIFD.GPSLongitude]}</p>

        <input type="file" accept="image/*" onChange={onImageChange}/>
      </form>
    </div>
  );
}

export default App;
