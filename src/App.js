import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import piexif from 'piexifjs';
import { getBase64 } from './getBase64';
import Logo from './logo.png';
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
function App() {

  const [image, setImage] = useState(null)
  const [exifData, setExifData] = useState(null)
  const [scrubbedImage, setScrubbedImage] = useState(null)

  const onImageChange = async (e) => {
    setImage(URL.createObjectURL(e.target.files[0]))
    const base64Image = await getBase64(e.target.files[0])
    setExifData(piexif.load(base64Image))
    setScrubbedImage(piexif.remove(base64Image))
  }

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
    <Container>
      <Row className="mb-3">
        <Col>
      <img src={Logo} style={{display: "inline-block", maxWidth: '80px'}}alt="logo"/><h1>Exif Metadata Scrubber</h1>
      {image && <img src={image} style={{maxWidth: '200px'}} alt="uploaded"/>}
      </Col>
      </Row>
      <Row className="mb-3">
        {/* <div>Upload a Photo</div> */}
        {/* <Form.Group as="Row">
        <Form.File type="file" label="Upload JPEG" />
        </Form.Group> */}
        <Col>
        <input className="mb-3" type="file" accept="image/*" onChange={onImageChange}/>
        <div className=""><Button variant="primary" download="scrubbed.jpg" href={scrubbedImage}>Download Scrubbed Image</Button></div>
        </Col>
        </Row>
      {image && <Row>
        <Col xs="12" md="4">
        <h2>Your Device</h2>
        <p>Make: {exifData && exifData['0th'][piexif.ImageIFD.Make]}</p>
        <p>Model: {exifData?.['0th'] && exifData['0th'][piexif.ImageIFD.Model]}</p>
        <p>Software: {exifData?.['0th'] && exifData['0th'][piexif.ImageIFD.Software]}</p>
        <p>Orientation: </p>
        </Col>
        <Col xs="12" md="4">
        <h2>Date/time taken</h2>
        <p>Date: {exifData?.['0th'] && exifData['0th'][piexif.ImageIFD.DateTime]?.substring(0, 10).replaceAll(':', " ")}</p>
        <p>Time: {exifData?.['0th'] && exifData['0th'][piexif.ImageIFD.DateTime]?.substring(11, 19)}</p>
        </Col>
        <Col xs="12" md="4">
        <h2>Location</h2>
        <p>Latitude: {exifData?.['GPS'] &&  exifData['GPS'][piexif.GPSIFD.GPSLatitude]}</p>
        <p>Longitude: {exifData?.['GPS'] && exifData['GPS'][piexif.GPSIFD.GPSLongitude]}</p>
        </Col>
        </Row>}

      
      
    </Container>
  );
}

export default App;
