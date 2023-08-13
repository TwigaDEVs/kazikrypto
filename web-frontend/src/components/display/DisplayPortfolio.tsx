import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { config, isSupportedNetwork } from "../../lib/config";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json"; // Replace with the actual path to your config file

interface GetPortfolioProps {
  freelancerAddress: string;
  index: number;
}

const GetPortfolioComponent: React.FC<GetPortfolioProps> = ({
  freelancerAddress,
  index,
}) => {
  const [portfolio, setPortfolio] = useState<any>(null); // Use the appropriate type

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
    async function fetchPortfolio() {
      try {
        const result = await contractInstance.getPortfolio(
          freelancerAddress,
          index
        );
        setPortfolio(result);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    }

    fetchPortfolio();
  }, [freelancerAddress, index]);

  return (
    <div>
      <h2>Get Portfolio Entry</h2>
      <p>Freelancer Address: {freelancerAddress}</p>
      <p>Portfolio Index: {index}</p>

      {portfolio && (
        <div>
          <h3>Portfolio Details</h3>
          <p>Task URL: {portfolio.taskUrl}</p>
          <p>Description: {portfolio.description}</p>
          <p>Images: {portfolio.images.join(", ")}</p>
          <p>Videos: {portfolio.videos.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default GetPortfolioComponent;
