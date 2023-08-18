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
  FileInput,
  Rating,
  Box,
  Table,
  TextInput,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router-dom";
import { config, isSupportedNetwork } from "../../lib/config";
import { useMetaMask } from "~/hooks/useMetaMask";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json";
import { type MetaMaskInpageProvider } from "@metamask/providers"; // Replace with the actual path to your config file
import { uploadToIPFS } from "~/Infura";
import { useAccountId } from "~/hooks/UseAccount";

const ViewClientJobsComponent: React.FC = () => {
  const navigate = useNavigate();
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

  function goToDetailsPage(x) {
    navigate(`/jobs/${x}`);
  }

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
                <Button
                  onClick={() => {
                    goToDetailsPage(job.jobId.toString());
                  }}
                >
                  Bid
                </Button>
              </Group>
              <Text size="lg" weight={600}>
                {job.projectTitle}
              </Text>
              <br />
              <Group position="center">
                {job.images.map((imageURL, index) => (
                  <Image
                    key={index}
                    maw={240}
                    mx="auto"
                    src={imageURL}
                    alt="Without placeholder"
                  />
                ))}
              </Group>
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

export const ViewDescriptionAndBidPage: React.FC = () => {
  const params = useParams();
  const [clientJobs, setClientJobs] = useState<any[]>([]); // Use the appropriate type
  const [singleJob, setSingleJob] = useState<any>();
  const contractAddress = config["0x539"].contractAddress;
  const contractABI = KaziKrypto.abi;
  const [fileURLs, setFileURLs] = useState(null);
  const [budget, setBudget] = useState<number>();
  const [imagesValue, setImagesValue] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [bids, setBids] = useState<any[]>([]);
  const { accountId } = useAccountId();
  const {
    dispatch,
    state: {
      status,
      isMetaMaskInstalled,
      wallet,
      balance,
      chainId,
      walletContainer,
    },
  } = useMetaMask();

  const OnChangeMFile = async (selectedFiles: File[]) => {
    // Placeholder logic: Upload files to IPFS
    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      const response = await uploadToIPFS(file); // Your actual IPFS upload function
      uploadedUrls.push(response);
    }

    // Placeholder logic: Handle changes, such as updating URLs
    console.log("Uploaded URLs:", uploadedUrls);
    setFileURLs(uploadedUrls); // Assuming you have a state to store the URLs
  };

  const handleMakeBidding = async () => {
    if (!isMetaMaskInstalled) {
      // MetaMask not installed, show a message or prompt the user to install/connect
      console.error("Hitilafu kwenye kutuma kazi ya mteja");
      return;
    }
    const provider = new ethers.providers.Web3Provider(
      window.ethereum as unknown as ethers.providers.ExternalProvider
    );
    const signer = provider.getSigner();

    const contractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    try {
      // console.log(params.jobId);
      const tx = await contractInstance.makeABidding(
        ethers.BigNumber.from(params.jobId),
        description,
        ethers.BigNumber.from(budget),
        fileURLs
      );
      await tx.wait();
      console.log("client bid successful");
      notifications.show({
        title: "Successful",
        message: "bid done successful",
      });
    } catch (e) {
      console.error("Error posting client job:", e);
    }
  };

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
          const result = await contractInstance.getBids(params.jobId);
          // console.log(result);
          // console.log("holla");
          setBids(result);
        } catch (error) {
          console.error("Error calling view function:", error);
        }
      }
      callViewFunction();
    }
  }, [contractAddress, contractABI]);

  console.log("am here",bids);
  // console.log("haloooooooooooooooo")

  async function approveBid(bidId) {
    try {
      const ethereumProviderInjected = typeof window.ethereum !== "undefined";
      const isMetaMaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

      if (isMetaMaskInstalled) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as unknown as ethers.providers.ExternalProvider
        );

        const signer = provider.getSigner(); // Get the connected signer
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const jobId = parseInt(params.jobId); // Make sure jobId is in the right format

        const transaction = await contract.acceptBid(jobId, bidId);

        await transaction.wait(); // Wait for the transaction to be mined
        console.log("Bid accepted successfully!");

        
      }
    } catch (error) {
      console.error("Error approving bid:", error);
    }
  }

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
          for (let i = 0; i < result.length; i++) {
            if (result[i].jobId.toString() == params.jobId) {
              console.log(result[i]);
              setSingleJob(result[i]);
            }
          }
          // console.log("View function result:", result);
        } catch (error) {
          console.error("Error calling view function:", error);
        }
      }
      callViewFunction();
    }
  }, [contractAddress, contractABI]);

  // const rows = bids ? bids.map((bid, index) => (
  //   <tr key={index}>
  //     bid
  //   </tr>
  // )): "no bids yet";

  return (
    <>
      {singleJob ? (
        <Container>
          <Card
            shadow="sm"
            sx={{ marginBottom: 20 }}
            padding="lg"
            radius="md"
            withBorder
          >
            <Group position="apart" mt="md" mb="xs">
              <Text weight={300} size="sm">
                #{singleJob.jobId.toString()}
              </Text>
            </Group>
            <Text size="lg" weight={600}>
              {singleJob.projectTitle}
            </Text>
            <br />
            <Group position="center">
              {singleJob.images.map((imageURL, index) => (
                <Image
                  key={index}
                  maw={240}
                  mx="auto"
                  src={imageURL}
                  alt="Without placeholder"
                />
              ))}
            </Group>
            <br />
            <Text weight={300} size="md">
              Budget {singleJob.projectDuration} ETH
            </Text>
            <Text weight={300} size="md">
              {singleJob.projectDescription}
            </Text>
            <br />
            <Text weight={300} size="md">
              {singleJob.skillRequirements.map((skill, index) => (
                <Badge key={index}>{skill}</Badge>
              ))}
            </Text>
            <br />
            Account ID: {singleJob.accountId}
            <br />
            <br />
            <Text size="lg" weight={600}>
              Bid Now
            </Text>
            <Container size="30rem">
              <NumberInput
                label="Project Budget"
                precision={6}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                formatter={(value) =>
                  !Number.isNaN(parseFloat(value))
                    ? `ETH ${value}`.replace(
                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                        ","
                      )
                    : "ETH "
                }
                onChange={(value: number) => setBudget(value)}
              />
              <Textarea
                label="Bid Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <FileInput
                label="Upload relevant files"
                placeholder="Upload files"
                withAsterisk
                multiple
                value={imagesValue}
                onChange={(selectedFiles) => {
                  setImagesValue(selectedFiles);
                  OnChangeMFile(selectedFiles);
                }}
              />
              <br />
              <Button onClick={handleMakeBidding} uppercase>
                Bid
              </Button>
              ;
            </Container>
          </Card>
        </Container>
      ) : (
        "no Data"
      )}
      <br />
      {bids.length > 0 ? (
        <Container>
          {bids.map((bid, index) => (
            <Card
              key={index}
              shadow="sm"
              sx={{ marginBottom: 20 }}
              padding="lg"
              radius="md"
              withBorder
            >
              <Text weight={300} size="md">
                Bid from: {bid.accountId}
              </Text>
              <br />
              <Text weight={300} size="md">
                Amount: {bid.budget.toString()} ETH
              </Text>
              <Text weight={300} size="md">
                Bid Mesage: {bid.bidDescription}
              </Text>
              <br />

              <Text weight={300} size="md">
                {bid.bidApproved ? (
                  <Text weight={300} size="md" color="green">
                    Approved
                  </Text>
                ) : (
                  <>
                    <Text
                      weight={300}
                      size="md"
                      color="red"
                      style={{ fontSize: 14, fontWeight: 600 }}
                    >
                      Not Approved
                    </Text>
                    {singleJob ? (
                      bid.accountId === singleJob.accountId ? (
                        <Button onClick={() => approveBid(bid.bidId)}>
                          Approved Bid
                        </Button>
                      ) : (
                        " "
                      )
                    ) : (
                      <Text>No Single Job</Text>
                    )}
                  </>
                )}
              </Text>
            </Card>
          ))}
        </Container>
      ) : (
        "No bids"
      )}
    </>
  );
};

export default ViewClientJobsComponent;
