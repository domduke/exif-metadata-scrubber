import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import piexif from 'piexifjs';
import { getBase64 } from './getBase64';
import { rationalToDecimal, formatAltitude } from './formatAltitude'
import Logo from './logo.png';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';

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
        <Col xs="12" className="align-middle">
      <img src={Logo} style={{maxWidth: '60px', paddingRight: '10px  '}}alt="logo"/>
      <h1 style={{marginBottom: '-15px'}}>Exif Metadata Scrubber</h1>
      </Col>
      </Row>
      <Row>
        <p>
          Photos taken by smartphones and digital cameras can contain a lot of private information. Use this free tool to view and remove all metadata from your images.
        </p>
      </Row>
      <Row className="mb-3" >
      {image && <img src={image} style={{maxWidth: '200px'}} alt="uploaded"/>}

      </Row>
      <Row className="mb-3">

        <Col>
        {/* <input className="mb-3" type="file" accept="image/*" onChange={onImageChange}/> */}
        <InputGroup className="mb-3">
        <Form.Control type="file" accept="image/*" label="Choose image" onChange={onImageChange}/>
      </InputGroup>
        <Button variant="primary" download="scrubbed.jpg" href={scrubbedImage}>Remove Exif Data</Button>
        </Col>
        </Row>
      {image && <Row>
        <Col xs="12" md="4">
        <h2>Your Device</h2>
        <p>Make: {exifData && exifData['0th'][piexif.ImageIFD.Make]}</p>
        <p>Model: {exifData?.['0th'] && exifData['0th'][piexif.ImageIFD.Model]}</p>
        <p>Software: {exifData?.['0th'] && exifData['0th'][piexif.ImageIFD.Software]}</p>
        </Col>
        <Col xs="12" md="4">
        <h2>Date/time taken</h2>
        <p>Date: {exifData?.['0th'] && exifData['0th'][piexif.ImageIFD.DateTime]?.substring(0, 10).replaceAll(':', " ")}</p>
        <p>Time: {exifData?.['0th'] && exifData['0th'][piexif.ImageIFD.DateTime]?.substring(11, 19)}</p>
        </Col>
        <Col xs="12" md="4">
        <h2>Location</h2>
        <p>Latitude: {exifData?.['GPS']?.[piexif.GPSIFD.GPSLatitude] &&  `${exifData['GPS'][piexif.GPSIFD.GPSLatitude]} ${exifData['GPS'][piexif.GPSIFD.GPSLatitudeRef]}`}</p>
        <p>Longitude: {exifData?.['GPS']?.[piexif.GPSIFD.GPSLongitude] && `${exifData['GPS'][piexif.GPSIFD.GPSLongitude]} ${exifData['GPS'][piexif.GPSIFD.GPSLongitudeRef]}`}</p>
        <p>Altitude: {exifData?.['GPS']?.[piexif.GPSIFD.GPSAltitude] && formatAltitude(rationalToDecimal(exifData['GPS'][piexif.GPSIFD.GPSAltitude] || 0), exifData['GPS'][piexif.GPSIFD.GPSAltitudeRef])}</p>
        </Col>
        </Row>}


      
    </Container>
  );
}

export default App;
