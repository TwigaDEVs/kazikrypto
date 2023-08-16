import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Container,
  Rating,
} from "@mantine/core";
import { config, isSupportedNetwork } from "../../lib/config";
import { useMetaMask } from "~/hooks/useMetaMask";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json";
import { type MetaMaskInpageProvider } from "@metamask/providers"; // Replace with the actual path to your config file


const ViewClientJobsComponent: React.FC = () => {


  const [clientJobs, setClientJobs] = useState<any[]>([]); // Use the appropriate type
  const contractAddress = config["0x539"].contractAddress;
  const contractABI = KaziKrypto.abi;

  useEffect(() => {
    const ethereumProviderInjected = typeof window.ethereum !== "undefined";
    const isMetaMaskInstalled =
      ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

    if (isMetaMaskInstalled) {
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

      callViewFunction();
    }
  }, [contractAddress, contractABI]);

  return (
    <div>
      {clientJobs.length > 0 ? (
        <Container size="40rem">
          <h4>Client Jobs</h4>

          {clientJobs.map((job, index) => (
            <Card
              key={index}
              shadow="sm"
              sx={{ marginBottom: 20 }}
              padding="lg"
              radius="md"
              withBorder
            >
              <Group position="apart" mt="md" mb="xs">
                <Text weight={300} size="sm">
                  #{job.jobId.toString()}
                </Text>
                <Button>Bid</Button>
              </Group>
              <Text size="lg" weight={600}>
                {job.projectTitle}
              </Text>
              <Text weight={300} size="md">
                {job.projectDescription}
                <br />
                {job.images.join(", ")}
              </Text>
              <br />
              <Text weight={300} size="md">
                Budget {job.projectDuration} ETH
              </Text>
              <br />
              <Text weight={300} size="md">
                {job.skillRequirements.map((skill) => (
                  <Badge>{skill}</Badge>
                ))}
              </Text>
              <br />
              Account ID: {job.accountId}
            </Card>
          ))}
        </Container>
      ) : (
        <p>No client jobs available.</p>
      )}
    </div>
  );
};

export default ViewClientJobsComponent;
