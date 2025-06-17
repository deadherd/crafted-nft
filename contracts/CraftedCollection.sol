// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ERC721A-Upgradeable/contracts/ERC721AUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CraftedCollection is 
    ERC721AUpgradeable, 
    AccessControlUpgradeable, 
    PausableUpgradeable, 
    ReentrancyGuardUpgradeable, 
    UUPSUpgradeable 
{
    using Strings for uint256;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CRAFTER_ROLE = keccak256("CRAFTER_ROLE");

    uint256 public constant MAX_SUPPLY = 888;
    uint256 public constant MINT_PRICE = 0.01 ether;

    string private _baseTokenURI;

    struct Traits {
        string code;
        string artVersion;
        string metadataURI;
        uint256 level;
        uint256 power;
        uint256 rarity;
    }

    mapping(uint256 => Traits) private tokenTraits;

    error NotAuthorized();
    error InvalidToken();
    error ZeroAddress();
    error MaxSupplyReached();
    error InsufficientPayment();

    event TraitsUpdated(uint256 indexed tokenId, Traits traits);
    event MetadataUpdated(uint256 indexed tokenId, string metadataURI);
    event BaseURISet(string baseURI);
    event CraftingInitialized();

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721AUpgradeable, AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function initialize(string memory name_, string memory symbol_) public initializerERC721A initializer {
        __ERC721A_init(name_, symbol_);
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(CRAFTER_ROLE, msg.sender);

        emit CraftingInitialized();
    }

    // PUBLIC MINT FUNCTION
    function publicMint(uint256 quantity) external payable whenNotPaused nonReentrant {
        if (quantity == 0) revert InvalidToken();
        if (totalSupply() + quantity > MAX_SUPPLY) revert MaxSupplyReached();
        if (msg.value < MINT_PRICE * quantity) revert InsufficientPayment();

        _safeMint(msg.sender, quantity);
    }

    // TRAIT MANAGEMENT
    function updateTraits(uint256 tokenId, Traits calldata newTraits) external onlyRole(CRAFTER_ROLE) {
        if (!_exists(tokenId)) revert InvalidToken();
        tokenTraits[tokenId] = newTraits;
        emit TraitsUpdated(tokenId, newTraits);
    }

    function updateMetadata(uint256 tokenId, string calldata newURI) external onlyRole(CRAFTER_ROLE) {
        if (!_exists(tokenId)) revert InvalidToken();
        tokenTraits[tokenId].metadataURI = newURI;
        emit MetadataUpdated(tokenId, newURI);
    }

    function getTraits(uint256 tokenId) external view returns (Traits memory) {
        if (!_exists(tokenId)) revert InvalidToken();
        return tokenTraits[tokenId];
    }

    // METADATA REVEAL BASEURI SYSTEM
    function setBaseURI(string calldata baseURI) external onlyRole(ADMIN_ROLE) {
        _baseTokenURI = baseURI;
        emit BaseURISet(baseURI);
    }

   function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) revert InvalidToken();
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // UPGRADEABLE PROXY AUTH
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

    // PAUSABLE / SECURITY
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function withdraw(address payable recipient) external onlyRole(ADMIN_ROLE) nonReentrant {
        if (recipient == address(0)) revert ZeroAddress();
        uint256 balance = address(this).balance;
        recipient.transfer(balance);
    }
}
