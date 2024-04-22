import axios from 'axios';
import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
// import { create as ipfsHttpClient } from 'ipfs-http-client'
// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Create = ({ marketplace, nft }) => {
  const [fileImg, setFile] = useState(null);
  const [name, setName] = useState("")
  const [desc, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [loading, setLoading] = useState(false);
  // const uploadToIPFS = async (event) => {
  //   event.preventDefault()
  //   const file = event.target.files[0]
  //   if (typeof file !== 'undefined') {
  //     try {
  //       const result = await client.add(file)
  //       console.log(result)
  //       setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
  //     } catch (error){
  //       console.log("ipfs image upload error: ", error)
  //     }
  //   }
  // }

  ////////////////////////////////////////////////////////



  const sendJSONtoIPFS = async (ImgHash) => {

    try {

      const resJSON = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
        data: {
          "name": name,
          "description": desc,
          "image": ImgHash
        },
        headers: {
          'pinata_api_key': "40d4400089d220770050",
          'pinata_secret_api_key': "c4ae5c39aa79c3aec20cf95ea63c317419da0715053f99f5de4a9f0d1d6234ab",

        },
      });

      // https://gateway.pinata.cloud/ipfs/QmZ6iZAhazHyakzynC4sxZ6r6cikJmS69mZaCoyburKuq


      const tokenURI = `https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`;
      console.log("Token URI", tokenURI);
      //mintNFT(tokenURI, currentAccount)   // pass the winner
      mintThenList(tokenURI)
    } catch (error) {
      console.log("JSON to IPFS: ")
      console.log(error);
    }


  }


  ////////////////////////////////////////////////////////

  const sendFileToIPFS = async (e) => {
    e.preventDefault();
  
    if (fileImg) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", fileImg);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            'pinata_api_key': "40d4400089d220770050",
            'pinata_secret_api_key': "c4ae5c39aa79c3aec20cf95ea63c317419da0715053f99f5de4a9f0d1d6234ab",
            "Content-Type": "multipart/form-data"
          },
        });
  
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        console.log("File uploaded to IPFS:", ImgHash);
        sendJSONtoIPFS(ImgHash)
  
        // Reset form fields after successful upload
        setFile(null);
        setName("");
        setDescription("");
        setPrice("");
      } catch (error) {
        console.error("File to IPFS error:", error);
        // Add error handling here
      } finally {
        setLoading(false);
      }
    } else {
      console.error("No file selected.");
      // Add error handling here
    }
  }
  

  ////////////////////////////////////////////////////////
  // const createNFT = async () => {
  //   if (!image || !price || !name || !description) return
  //   try{
  //     sendJSONtoIPFS(image)
  //     // const result = await client.add(JSON.stringify({image, price, name, description}))
  //     // mintThenList(result)
  //   } catch(error) {
  //     console.log("ipfs uri upload error: ", error)
  //   }
  // }
  const mintThenList = async (uri) => {
    // const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    // mint nft 
    await (await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await (await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={sendFileToIPFS} variant="success" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create