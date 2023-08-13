import React, { useState } from "react";
import { ethers } from "ethers";
import { config, isSupportedNetwork } from "../../lib/config";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json"; // Replace with the actual path to your config file

const AddFreelancerComponent: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [hourlyRate, setHourlyRate] = useState(0);
  const [profession, setProfession] = useState("");
  const [paymentPreference, setPaymentPreference] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [isProfilePublic, setIsProfilePublic] = useState(false);

  const contractAddress = config["0x539"].contractAddress;

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
    KaziKrypto.abi,
    signer
  );

  const handleAddFreelancer = async () => {
    try {
      const tx = await contractInstance.addNewFreelancer(
        fullName,
        profileImage,
        hourlyRate,
        profession,
        paymentPreference,
        skills,
        isProfilePublic
      );

      await tx.wait();
      console.log("Freelancer added successfully!");
    } catch (error) {
      console.error("Error adding freelancer:", error);
    }
  };

  return (
    <div>
      <h2>Add a New Freelancer</h2>
      <form>
        <label>Full Name:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label>Profile Image:</label>
        <input
          type="text"
          value={profileImage}
          onChange={(e) => setProfileImage(e.target.value)}
        />

        <label>Hourly Rate:</label>
        <input
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(parseInt(e.target.value, 10))}
        />

        <label>Profession:</label>
        <input
          type="text"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
        />

        <label>Payment Preference:</label>
        <input
          type="text"
          value={paymentPreference}
          onChange={(e) => setPaymentPreference(e.target.value)}
        />

        <label>Skills (comma-separated):</label>
        <input
          type="text"
          value={skills.join(",")}
          onChange={(e) => setSkills(e.target.value.split(","))}
        />

        <label>Profile Public:</label>
        <input
          type="checkbox"
          checked={isProfilePublic}
          onChange={(e) => setIsProfilePublic(e.target.checked)}
        />

        <button type="button" onClick={handleAddFreelancer}>
          Add Freelancer
        </button>
      </form>
    </div>
  );
};

export default AddFreelancerComponent;
