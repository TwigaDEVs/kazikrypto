import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { config, isSupportedNetwork } from "../../lib/config";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json"; // Replace with the actual path to your config file

interface GetFreelancerProps {
  freelancerAddress: string;
}

const GetFreelancerComponent: React.FC<GetFreelancerProps> = ({
  freelancerAddress,
}) => {
  const [freelancer, setFreelancer] = useState<any>(null); // Use the appropriate type

  const contractAddress = config["0x539"].contractAddress;
  const contractABI = KaziKrypto.abi;
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as unknown as ethers.providers.ExternalProvider
  );
  const contractInstance = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
  );

  useEffect(() => {
    async function fetchFreelancer() {
      try {
        const result = await contractInstance.getFreelancer(freelancerAddress);
        setFreelancer(result);
      } catch (error) {
        console.error("Error fetching freelancer:", error);
      }
    }

    fetchFreelancer();
  }, [freelancerAddress]);

  return (
    <div>
      <h2>Get Freelancer Details</h2>
      <p>Freelancer Address: {freelancerAddress}</p>

      {freelancer && (
        <div>
          <h3>Freelancer Details</h3>
          <p>Full Name: {freelancer.fullName}</p>
          <p>Profile Image: {freelancer.profileImage}</p>
          <p>Hourly Rate: {freelancer.hourlyRate.toNumber()}</p>
          <p>Profession: {freelancer.profession}</p>
          <p>Payment Preference: {freelancer.paymentPreference}</p>
          <p>Skills: {freelancer.skills.join(", ")}</p>
          <p>Profile Rating: {freelancer.profileRating.toNumber()}</p>
          <p>Is Profile Public: {freelancer.isProfilePublic ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
};

export default GetFreelancerComponent;
