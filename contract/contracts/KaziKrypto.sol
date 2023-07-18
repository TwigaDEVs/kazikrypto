// SPDX-License-Identifier: MIT
pragma solidity >=0.4.1 < 0.9.0;

/**
* @title Kazi Krypto
* @notice The contract a freelancing platform on the Ethereum blockchain
* @notice The platform aims to connect freelancers and clients, facilitating secure and
transparent transactions while leveraging the benefits of blockchain technology

* @dev user Registration and profiles
* @dev Job posting and bidding
* @dev Smart contract escrow
* @dev messaging and collaboration
* @dev reputation and reviews
* @dev payment and escrow release
* @dev transaction history and analytics
* @dev conflict resolution
 */
 

contract KaziKrypto {

    /**
    * @dev allow smart contract to receive payments
    */
    constructor() public payable{

    }


    /// @title Freelancer Profile
    /// @dev Struct to store user profile
    struct Freelancer {
        address payable accountId;
        string fullName;
        string profession;
        string paymentPreference;
        string[] skills;
        uint profileRating;
    }

    /// @title freelancer portfolio
    /// @notice all portfolios mapped to the specific freelancer Id
    struct FreelancerPortfolio {
        address accountId;
        string[] images;
        string[] videos;
        string taskUrl;
        string description;
    }

    /// @title freelancer experience
    /// @dev store freelancer experience
    struct FreelancerExperience {
        address accountId;
        string fromDate;
        string toDate;
        string jobTitle;
        string jobDescription;
    }

    /// @title Job posting and bidding
    /// @dev struct to store job requirements
    struct ClientJobs {
        address accountId;
        string projectTitle;
        string projectDescription;
        string projectDuration;
        uint projectBudget;
        string[] skillRequirements;
        string[] images; ///@dev optional
    }

    /// @title FreelancerBids;
    /// @dev store each freelancerBid
    /// @dev make a reference to the account Id of the freelancer
    struct FreelancerBids {
        uint bidId;
        address accountId;
        string bidDescription;
        uint budget;
        string[] relevantFiles; /// @dev optional
        bool bidApproved;
    }

    /// @title Milestones
    /// @dev allow frelancer to bid in form of milestones
    /// @dev optional

    struct ProjectMilestones {
        uint bidId;
        string milestoneName;
        string milestoneDescription;
        string milestoneBudget;
        string milestoneDuration;
        bool milestoneWorkApproved;
    }

    /// @title Chats
    /// @dev chat from intended sender to intended receiver

    struct Chats {
        uint timestamp;
        address sender;
        address receiver;
        string message;
        string[] attachedFiles; /// @dev optional
        bool seen;
    }

    /// @title client ratings
    /// @dev single client Rating
    /// @dev done by the freelancer

    struct ClientRatings {
        uint bidId;
        string ProjectName; /// @dev optional
        address accountId;
        string feedback; /// @dev optional
        uint ratingForTimelyPayments; /// @dev maximum 5
        uint ratingForTimelyFeedbacks; /// @dev maximum 5
    }

    /// @title freelancerr Ratings
    /// @dev single freelancer Rating

    struct FreelancerRatings {
        uint bidId;
        string ProjectName; /// @dev optional;
        address accountId; 
        string feedback; /// @dev optional;
        uint ratingForCompletedProjects; /// @dev max 5;
        uint ratingForCommunicationSkills; /// @dev max 5;
    }












    
    
}