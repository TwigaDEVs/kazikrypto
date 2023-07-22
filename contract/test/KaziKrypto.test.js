const KaziKrypto = artifacts.require("KaziKrypto");
const chai = require("chai");
const BN = require("bn.js");
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);
const { expect } = chai;

contract("KaziKrypto", (accounts) => {
  let instance;

  before(async () => {
    instance = await KaziKrypto.deployed();
  });

  it("should add a new freelancer", async () => {
    const fullName = "John Doe";
    const image = "path_to_image";
    const hourlyRate = new BN(50);
    const profession = "Software Engineer";
    const preferredPayment = "ETH";
    const skills = ["JavaScript", "Solidity", "Web3"];

    // Call the addNewFreelancer function
    await instance.addNewFreelancer(
      fullName,
      image,
      hourlyRate,
      profession,
      preferredPayment,
      skills,
      { from: accounts[0] }
    );

    // Retrieve the added freelancer using the getFreelancer function
    const freelancer = await instance.getFreelancer(accounts[0]);

    // Check if the data is correct
    expect(freelancer.accountId).to.equal(accounts[0]);
    expect(freelancer.fullName).to.equal(fullName);
    expect(freelancer.hourlyRate).to.be.bignumber.equal(hourlyRate);
    expect(freelancer.profession).to.equal(profession);
    expect(freelancer.paymentPreference).to.equal(preferredPayment);
    expect(freelancer.skills).to.deep.equal(skills);
    expect(freelancer.profileRating).to.be.bignumber.equal(new BN(0));
  });

  it("should add a new portfolio to freelancer", async () => {
    const images = ["image1.png", "image2.png"];
    const videos = ["video1.mp4", "video2.mp4"];
    const taskUrl = "https://kaziKrypto.com/task";
    const description = "This is a test portfolio";

    // Call the addPortfolio function
    await instance.addPortfolio(images, videos, taskUrl, description, {
      from: accounts[0],
    });

    // Retrieve the added portfolio using the getPortfolio function
    const portfolio = await instance.getPortfolio(accounts[0], 0);

    // Check if the data is correct
    expect(portfolio.accountId).to.equal(accounts[0]);
    expect(portfolio.images).to.deep.equal(images);
    expect(portfolio.videos).to.deep.equal(videos);
    expect(portfolio.taskUrl).to.equal(taskUrl);
    expect(portfolio.description).to.equal(description);
  });

  it("should add a new experience to freelancer", async () => {
    const fromDate = "2022-01-01";
    const toDate = "2022-12-31";
    const jobTitle = "Software Engineer";
    const jobDescription = "Worked on blockchain projects";

    // Call the addFreelancerExperience function
    await instance.addFreelancerExperience(
      fromDate,
      toDate,
      jobTitle,
      jobDescription,
      { from: accounts[0] }
    );

    // Retrieve the added experience using the getExperience function
    const experience = await instance.getExperience(accounts[0], 0);

    // Check if the data is correct
    expect(experience.accountId).to.equal(accounts[0]);
    expect(experience.fromDate).to.equal(fromDate);
    expect(experience.toDate).to.equal(toDate);
    expect(experience.jobTitle).to.equal(jobTitle);
    expect(experience.jobDescription).to.equal(jobDescription);
  });

  it("should post a new client job", async () => {
    const projectTitle = "Web Development";
    const projectDescription = "Build a website";
    const projectDuration = "2023-07-01 to 2023-08-30";
    const projectBudget = new BN(1000);
    const skillRequirements = ["HTML", "CSS", "JavaScript"];
    const images = ["image1.png", "image2.png"];

    // Call the postAClientJob function
    await instance.postAClientJob(
      projectTitle,
      projectDescription,
      projectDuration,
      projectBudget,
      skillRequirements,
      images,
      { from: accounts[0], value: web3.utils.toWei("1", "ether") }
    );

    // Retrieve the added client job using the getClientJob function
    const jobId = new BN(1); // Assuming it's the first job posted
    const clientJob = await instance.getClientJob(jobId);

    // Check if the data is correct
    expect(clientJob.jobId).to.be.bignumber.equal(jobId);
    expect(clientJob.accountId).to.equal(accounts[0]);
    expect(clientJob.projectTitle).to.equal(projectTitle);
    expect(clientJob.projectDescription).to.equal(projectDescription);
    expect(clientJob.projectDuration).to.equal(projectDuration);
    expect(clientJob.projectBudget).to.be.bignumber.equal(projectBudget);
    expect(clientJob.skillRequirements).to.deep.equal(skillRequirements);
    expect(clientJob.images).to.deep.equal(images);
    expect(clientJob.bidAvailable).to.be.true;
  });

  it("should make a new bidding and retrieve it", async () => {
    const jobId = new BN(1); // Assuming it's the first job posted
    const bidDescription = "I can do this job";
    const budget = new BN(500);
    const relevantFiles = ["file1.pdf", "file2.doc"];

    // Call the makeAClientJob function
    await instance.postAClientJob(
      "Web Development",
      "Build a website",
      "2023-07-01 to 2023-08-30",
      1000,
      ["HTML", "CSS", "JavaScript"],
      ["image1.png", "image2.png"],
      { from: accounts[0], value: web3.utils.toWei("1", "ether") }
    );

    // Call the makeABidding function
    await instance.makeABidding(jobId, bidDescription, budget, relevantFiles, {
      from: accounts[1],
    });

    // Retrieve the added bid using the getBid function
    const bidId = new BN(1); // Assuming it's the first bid made
    const bid = await instance.getBid(jobId, bidId);

    // Check if the data is correct
    expect(bid.jobId).to.be.bignumber.equal(jobId);
    expect(bid.bidId).to.be.bignumber.equal(bidId);
    expect(bid.accountId).to.equal(accounts[1]);
    expect(bid.bidDescription).to.equal(bidDescription);
    expect(bid.budget).to.be.bignumber.equal(budget);
    expect(bid.relevantFiles).to.deep.equal(relevantFiles);
    expect(bid.bidApproved).to.be.false;

    // Retrieve all bids for the given job using the getBids function
    const allBids = await instance.getBids(jobId);

    // Check if the data includes the added bid
    const foundBid = allBids[bidId - 1];

    expect(foundBid).to.exist;
    expect(foundBid.accountId).to.equal(accounts[1]);
    expect(foundBid.bidDescription).to.equal(bidDescription);
    expect(foundBid.budget).to.be.bignumber.equal(budget);
    expect(foundBid.relevantFiles).to.deep.equal(relevantFiles);
    expect(foundBid.bidApproved).to.be.false;
  });

  it("should send a chat and mark as read", async () => {
    const receiver = accounts[1];
    const message = "Hello, how are you?";
    const attachedFiles = ["file1.pdf", "file2.doc"];

    // Call the chat function
    await instance.chat(receiver, message, attachedFiles, {
      from: accounts[0],
    });

    // Retrieve the chat using getChat function
    const chatIndex = 0;
    const chat = await instance.getChat(receiver, chatIndex);

    // Check if the data is correct
    expect(chat.timestamp).to.be.bignumber.gt(new BN(0));
    expect(chat.sender).to.equal(accounts[0]);
    expect(chat.receiver).to.equal(receiver);
    expect(chat.message).to.equal(message);
    expect(chat.attachedFiles).to.deep.equal(attachedFiles);
    expect(chat.seen).to.be.false;

    // Call the markAsRead function
    await instance.markAsRead(receiver, { from: accounts[0] });

    // Retrieve the chat again using getChat function
    const updatedChat = await instance.getChat(receiver, chatIndex);

    // Check if the seen status is updated
    expect(updatedChat.seen).to.be.true;
  });

  it("should get all chats for a receiver", async () => {
    const receiver = accounts[1];

    // Send multiple chats to the receiver
    await instance.chat(receiver, "Chat 1", [], { from: accounts[0] });
    await instance.chat(receiver, "Chat 2", [], { from: accounts[2] });
    await instance.chat(receiver, "Chat 3", [], { from: accounts[0] });
    await instance.chat(receiver, "Chat 4", [], { from: accounts[2] });

    // Retrieve all chats for the receiver using getChats function
    const allChats = await instance.getChats(receiver);

    // Check the number of chats and their content
    expect(allChats.length).to.equal(5);
    expect(allChats[0].sender).to.equal(accounts[0]);
    expect(allChats[1].sender).to.equal(accounts[0]);
    expect(allChats[2].sender).to.equal(accounts[2]);
    expect(allChats[3].sender).to.equal(accounts[0]);
    expect(allChats[4].sender).to.equal(accounts[2]);
  });
});
