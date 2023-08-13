import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { config, isSupportedNetwork } from "../../lib/config";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json"; // Replace with the actual path to your config file

const ViewClientJobsComponent: React.FC = () => {
  const [clientJobs, setClientJobs] = useState<any[]>([]); // Use the appropriate type

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

  async function callViewFunction() {
    try {
      const result = await contractInstance.getClientJob();
      setClientJobs(result);
      console.log("View function result:", result);
    } catch (error) {
      console.error("Error calling view function:", error);
    }
  }

  useEffect(() => {
    callViewFunction();
  }, []); // Call the function when the component mounts

  return (
    <div>
      <h2>View Client Jobs</h2>
      {clientJobs.length > 0 ? (
        <div>
          <h3>Client Jobs</h3>
          <ul>
            {clientJobs.map((job, index) => (
              <li key={index}>
                Job ID: {job.jobId.toString()}
                <br />
                Account ID: {job.accountId}
                <br />
                Project Title: {job.projectTitle}
                <br />
                Project Description: {job.projectDescription}
                <br />
                Project Duration: {job.projectDuration}
                <br />
                Project Budget (ETH): {job.projectBudget.toString()}
                <br />
                Skill Requirements: {job.skillRequirements.join(", ")}
                <br />
                Images: {job.images.join(", ")}
                <br />
                Bid Available: {job.bidAvailable ? "Yes" : "No"}
                <br />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No client jobs available.</p>
      )}
    </div>
  );
};

export default ViewClientJobsComponent;
