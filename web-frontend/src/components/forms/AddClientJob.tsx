import React, { useState ,useEffect} from "react";
import { ethers } from "ethers";
import {
  Input,
  TextInput,
  NumberInput,
  MultiSelect,
  Paper,
  Button,
  Modal,
  Group,
  Container,
  Checkbox,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { config, isSupportedNetwork } from "../../lib/config";
import KaziKrypto from "../../../../contract/build/contracts/KaziKrypto.json";

import { MetaMaskProvider, useMetaMask } from "~/hooks/useMetaMask";

const PostClientJobComponent: React.FC = () => {
  const [data, setData] = useState([
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
  ]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectDuration, setProjectDuration] = useState("");
  const [projectBudget, setProjectBudget] = useState(0);
  const [skillRequirements, setSkillRequirements] = useState<string[]>([]);
  const [images, setImages] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const contractAddress = config["0x539"].contractAddress;
  const contractABI = KaziKrypto.abi;
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

  const networkId = import.meta.env.VITE_PUBLIC_NETWORK_ID;

  if (!isSupportedNetwork(networkId)) {
    throw new Error("unsurported network , tafadhali nani fuata maelekezo");
  }

  const handlePostClientJob = async () => {
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
      const skillRequirementsArray = skillRequirements.map((skill) =>
        skill.trim()
      );
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
      notifications.show({
        title: "Successful",
        message: "Job posted successfully",
      });
    } catch (error) {
      console.error("Error posting client job:", error);
    }
  };

    useEffect(() => {
      if (!isMetaMaskInstalled) {
        // MetaMask haiko imewekwa, unaweza kuonyesha ujumbe au kutekeleza hatua nyingine
        console.log("MetaMask haiko imewekwa");
      }
    }, [isMetaMaskInstalled]);

  return (
    <div>
      <Modal opened={opened} onClose={close} title="Post A task">
        {/* Modal content */}

        <TextInput
          label="Project title"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />

        <Textarea
          label="Project Description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />

        <TextInput
          label="Project Duration"
          value={projectDuration}
          onChange={(e) => setProjectDuration(e.target.value)}
        />

        <NumberInput
          label="Hourly Rate"
          precision={6}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `ETH ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              : "ETH "
          }
          onChange={(value: number) => setProjectBudget(value)}
        />

        <MultiSelect
          label="Skills"
          data={data}
          placeholder="Select items"
          searchable
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query };
            setData((current) => [...current, item]);
            return item;
          }}
          onChange={(value: string[]) => {
            setSkillRequirements(value);
            console.log(skillRequirements);
          }}
        />

        <TextInput
          label="Images (comma separated)"
          value={images}
          onChange={(e) => setImages(e.target.value)}
        />
        <br />
        <Button onClick={handlePostClientJob} uppercase>
          Post Client Job
        </Button>
      </Modal>
      <Group position="center">
        <Button onClick={open}>Post a Job</Button>
      </Group>
    </div>
  );
};

export default PostClientJobComponent;
