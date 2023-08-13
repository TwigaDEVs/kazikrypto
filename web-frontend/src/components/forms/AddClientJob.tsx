import React, { useState } from "react";
import { ethers } from "ethers";
import { config, isSupportedNetwork } from "../../lib/config";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json";

const PostClientJobComponent: React.FC = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectDuration, setProjectDuration] = useState("");
  const [projectBudget, setProjectBudget] = useState(0);
  const [skillRequirements, setSkillRequirements] = useState("");
  const [images, setImages] = useState("");

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

  const handlePostClientJob = async () => {
    try {
      const skillRequirementsArray = skillRequirements
        .split(",")
        .map((skill) => skill.trim());
      const imagesArray = images.split(",").map((image) => image.trim());

      const tx = await contractInstance.postAClientJob(
        projectTitle,
        projectDescription,
        projectDuration,
        projectBudget,
        skillRequirementsArray,
        imagesArray
      );

      await tx.wait();
      console.log("Client job posted successfully!");
    } catch (error) {
      console.error("Error posting client job:", error);
    }
  };

  return (
    <div>
      <h2>Post a Client Job</h2>
      <label>Project Title:</label>
      <input
        type="text"
        value={projectTitle}
        onChange={(e) => setProjectTitle(e.target.value)}
      />

      <label>Project Description:</label>
      <textarea
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
      />

      <label>Project Duration:</label>
      <input
        type="text"
        value={projectDuration}
        onChange={(e) => setProjectDuration(e.target.value)}
      />

      <label>Project Budget (ETH):</label>
      <input
        type="number"
        value={projectBudget}
        onChange={(e) => setProjectBudget(Number(e.target.value))}
      />

      <label>Skill Requirements (comma-separated):</label>
      <input
        type="text"
        value={skillRequirements}
        onChange={(e) => setSkillRequirements(e.target.value)}
      />

      <label>Images (comma-separated):</label>
      <input
        type="text"
        value={images}
        onChange={(e) => setImages(e.target.value)}
      />

      <button onClick={handlePostClientJob}>Post Client Job</button>
    </div>
  );
};

export default PostClientJobComponent;
