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
        uint projectBudget;
        string[] skillRequirements;
    }

    /// @title FreelancerSkills;
    /// @dev store each freelancer skills
    /// @notice these skills will display when the freelancer profile page is opened
    
}