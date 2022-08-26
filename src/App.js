import { useState } from 'react';
import './App.css';
import piexif from 'piexifjs';
function App() {

  const [image, setImage] = useState(null);
  const [exifData, setExifData] = useState(null);

  const onImageChange = async (e) => {
    console.log(e.target.value)
    setImage(URL.createObjectURL(e.target.files[0]));
    const base64Image = await getBase64(e.target.files[0]);
    setExifData(piexif.load(base64Image))
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

  return (
    <div className="App">
      {image && <img src={image} alt="uploaded image"/>}
      <h1>Exif Metadata Scrubber</h1>
      <form>
        <h2>Your Device</h2>
        <p>Make: </p>
        <p>Model: </p>
        <p>OS version: </p>
        <p>Orientation: </p>

        <h2>Date/time taken</h2>
        <p>Date: </p>
        <p>Time: </p>

        <h2>Location</h2>
        <p>Longitude:</p>
        <p>Latitude:</p>

        <h2>Speed</h2>
        <p>Speed:</p>
        <input type="file" accept="image/*" onChange={onImageChange}/>
      </form>
    </div>
  );
}

export default App;
