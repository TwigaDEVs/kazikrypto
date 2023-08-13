import React, { useState } from "react";
import { ethers } from "ethers";
import { config, isSupportedNetwork } from "../../lib/config";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json"; // Replace with the actual path to your config file

const AddPortfolioComponent: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [taskUrl, setTaskUrl] = useState("");
  const [description, setDescription] = useState("");

  const contractAddress = config["0x539"].contractAddress;
  const contractABI = KaziKrypto.abi;
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as unknown as ethers.providers.ExternalProvider
  );
  const signer = provider.getSigner();

  const networkId = import.meta.env.VITE_PUBLIC_NETWORK_ID;

  if (!isSupportedNetwork(networkId)) {
    throw new Error("unsurported network , tafadhali nani fuata maelekezo");
  }

  const contractInstance = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  const handleAddPortfolio = async () => {
    try {
      const tx = await contractInstance.addPortfolio(
        images,
        videos,
        taskUrl,
        description
      );

      await tx.wait();
      console.log("Portfolio added successfully!");
      // Reset form fields
      setImages([]);
      setVideos([]);
      setTaskUrl("");
      setDescription("");
    } catch (error) {
      console.error("Error adding portfolio:", error);
    }
  };

  return (
    <div>
      <h2>Add Portfolio</h2>
      <label>Images (comma-separated):</label>
      <input
        type="text"
        value={images.join(",")}
        onChange={(e) => setImages(e.target.value.split(","))}
      />

      <label>Videos (comma-separated):</label>
      <input
        type="text"
        value={videos.join(",")}
        onChange={(e) => setVideos(e.target.value.split(","))}
      />

      <label>Task URL:</label>
      <input
        type="text"
        value={taskUrl}
        onChange={(e) => setTaskUrl(e.target.value)}
      />

      <label>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleAddPortfolio}>Add Portfolio</button>
    </div>
  );
};

export default AddPortfolioComponent;
