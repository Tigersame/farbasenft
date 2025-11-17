// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title FarcasterNFT SBT Collection
 * @notice Soulbound Token (SBT) for first 20,000 users
 * @dev Non-transferable NFT that can only be minted once per wallet
 */
contract FarcasterNFTSBT is ERC721, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 20000;
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;
    
    // Track which addresses have claimed
    mapping(address => bool) public hasClaimed;
    
    // Track total claimed
    uint256 public totalClaimed;

    event SBTClaimed(address indexed to, uint256 indexed tokenId);

    constructor(
        address initialOwner,
        string memory baseURI
    ) ERC721("FarcasterNFT Early Adopter", "FARBASBT") Ownable(initialOwner) {
        _baseTokenURI = baseURI;
    }

    /**
     * @notice Claim SBT - can only be called once per address
     * @dev Mints a non-transferable token to the caller
     */
    function claim() external nonReentrant {
        require(!hasClaimed[msg.sender], "SBT already claimed");
        require(totalClaimed < MAX_SUPPLY, "SBT claim limit reached");
        
        hasClaimed[msg.sender] = true;
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        totalClaimed++;
        
        _safeMint(msg.sender, tokenId);
        
        emit SBTClaimed(msg.sender, tokenId);
    }

    /**
     * @notice Check if address can claim
     */
    function canClaim(address account) external view returns (bool) {
        return !hasClaimed[account] && totalClaimed < MAX_SUPPLY;
    }

    /**
     * @notice Get remaining claims
     */
    function remainingClaims() external view returns (uint256) {
        return MAX_SUPPLY - totalClaimed;
    }

    /**
     * @dev Override transfer functions to make token non-transferable (Soulbound)
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        // Only allow minting (from address(0))
        require(auth == address(0) || to == address(0), "SBT is non-transferable");
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Override approve functions to prevent transfers
     */
    function approve(address to, uint256 tokenId) public pure override {
        revert("SBT is non-transferable");
    }

    function setApprovalForAll(address operator, bool approved) public pure override {
        revert("SBT is non-transferable");
    }

    /**
     * @dev Base URI for token metadata
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @notice Update base URI (owner only)
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    /**
     * @notice Get token URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string(abi.encodePacked(_baseURI(), Strings.toString(tokenId), ".json"));
    }
}

