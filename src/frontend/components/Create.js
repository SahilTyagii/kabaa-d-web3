import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import lighthouse from '@lighthouse-web3/sdk';

const Create = ({ marketplace, nft }) => {
  const [fileImg, setFile] = useState(null);
  const [name, setName] = useState("")
  const [desc, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [loading, setLoading] = useState(false);

  const progressCallback = (progressData) => {
    let percentageDone = 100 - (progressData?.total / progressData?.uploaded)?.toFixed(2)
    console.log(percentageDone)
  }

  const uploadFile = async (file) => {
    let output;
    try {
      output = await lighthouse.upload(file, "93949fb2.0c176f0ee1ee45f9af63a00c701efee8", false, null, progressCallback);
      console.log('File Status:', output);
      console.log('Visit at https://gateway.lighthouse.storage/ipfs/' + output.data.Hash);
    } catch (error) {
      console.error("Upload to IPFS error:", error);
      throw error; // Rethrow the error to be caught by the caller
    }
    return output;
  }

  const createNFT = async () => {
    if (!fileImg || !price || !name || !desc) return;
    try {
      const output = await uploadFile(fileImg);
      const uri = `https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`;
      await (await nft.mint(uri)).wait();
      const id = await nft.tokenCount();
      await (await nft.setApprovalForAll(marketplace.address, true)).wait();
      const listingPrice = ethers.utils.parseEther(price.toString());
      await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
    } catch (error) {
      console.log("Create NFT error: ", error)
    }
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
                <Button onClick={createNFT} variant="success" size="lg">
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

export default Create;
