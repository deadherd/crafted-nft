// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ERC721A-Upgradeable/contracts/extensions/ERC721AQueryableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CraftedCollection is
    ERC721AQueryableUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    ERC2981Upgradeable,
    UUPSUpgradeable
{
    using Strings for uint256;
    using Address for address payable;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CRAFTER_ROLE = keccak256("CRAFTER_ROLE");

    uint256 public constant MAX_SUPPLY = 888;
    uint256 public mintPrice;

    uint256 public maxWalletHoldings;

    string private _baseTokenURI;
    string private _collectionName;
    string private _collectionSymbol;

    struct Traits {
        string code;
        string artVersion;
        string metadataURI;
        uint256 level;
        uint256 power;
        uint256 rarity;
    }

    mapping(uint256 => Traits) private tokenTraits;
    mapping(uint256 => bool) private _metadataFrozen;

    error NotAuthorized();
    error InvalidToken();
    error ZeroAddress();
    error MaxSupplyReached();
    error InsufficientPayment();
    error MetadataIsFrozen();
    error MaxWalletLimit();
    error FallbackNotAllowed();

    event TraitsUpdated(uint256 indexed tokenId, Traits traits);
    event MetadataUpdated(uint256 indexed tokenId, string metadataURI);
    event MetadataFrozen(uint256 indexed tokenId);
    event BaseURISet(string baseURI);
    event Minted(address indexed to, uint256 quantity);
    event Withdraw(address indexed recipient, uint256 amount);
    event CraftingInitialized();
    event MintPriceUpdated(uint256 newPrice);
    event MaxWalletHoldingsUpdated(uint256 newLimit);
    event CollectionDetailsUpdated(string newName, string newSymbol);
    event Received(address indexed sender, uint256 amount);

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721AUpgradeable, IERC721AUpgradeable, AccessControlUpgradeable, ERC2981Upgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function initialize(string memory name_, string memory symbol_) public initializerERC721A initializer {
        __ERC721A_init(name_, symbol_);
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __ERC2981_init();
        __UUPSUpgradeable_init();

        _collectionName = name_;
        _collectionSymbol = symbol_;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(CRAFTER_ROLE, msg.sender);

        mintPrice = 0.03 ether;
        maxWalletHoldings = 3;

        _setDefaultRoyalty(msg.sender, 500); // 5% royalties

        emit CraftingInitialized();
    }

    // PUBLIC MINT FUNCTION
    function publicMint(uint256 quantity) external payable whenNotPaused nonReentrant {
        if (quantity == 0) revert InvalidToken();
        if (totalSupply() + quantity > MAX_SUPPLY) revert MaxSupplyReached();
        if (msg.value < mintPrice * quantity) revert InsufficientPayment();
        if (balanceOf(msg.sender) + quantity > maxWalletHoldings) revert MaxWalletLimit();

        _safeMint(msg.sender, quantity);
        emit Minted(msg.sender, quantity);
    }

    /// @notice Mint tokens without payment. Only callable by admins.
    /// @param to The recipient of the minted tokens.
    /// @param quantity Number of tokens to mint.
    function adminMint(address to, uint256 quantity) external onlyRole(ADMIN_ROLE) {
        if (to == address(0)) revert ZeroAddress();
        if (quantity == 0) revert InvalidToken();
        if (totalSupply() + quantity > MAX_SUPPLY) revert MaxSupplyReached();

        _safeMint(to, quantity);
        emit Minted(to, quantity);
    }

    // TRAIT MANAGEMENT
    function updateTraits(uint256 tokenId, Traits calldata newTraits) external onlyRole(CRAFTER_ROLE) {
        if (!_exists(tokenId)) revert InvalidToken();
        if (_metadataFrozen[tokenId]) revert MetadataIsFrozen();
        tokenTraits[tokenId] = newTraits;
        emit TraitsUpdated(tokenId, newTraits);
    }

    function updateMetadata(uint256 tokenId, string calldata newURI) external onlyRole(CRAFTER_ROLE) {
        if (!_exists(tokenId)) revert InvalidToken();
        if (_metadataFrozen[tokenId]) revert MetadataIsFrozen();
        tokenTraits[tokenId].metadataURI = newURI;
        emit MetadataUpdated(tokenId, newURI);
    }

    function freezeMetadata(uint256 tokenId) external onlyRole(ADMIN_ROLE) {
        if (!_exists(tokenId)) revert InvalidToken();
        _metadataFrozen[tokenId] = true;
        emit MetadataFrozen(tokenId);
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

    function setRoyaltyInfo(address receiver, uint96 feeNumerator) external onlyRole(ADMIN_ROLE) {
        if (receiver == address(0)) revert ZeroAddress();
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function setMintPrice(uint256 newPrice) external onlyRole(ADMIN_ROLE) {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }

    function setMaxWalletHoldings(uint256 newLimit) external onlyRole(ADMIN_ROLE) {
        maxWalletHoldings = newLimit;
        emit MaxWalletHoldingsUpdated(newLimit);
    }

    function setCollectionDetails(string calldata newName, string calldata newSymbol) external onlyRole(ADMIN_ROLE) {
        _collectionName = newName;
        _collectionSymbol = newSymbol;
        emit CollectionDetailsUpdated(newName, newSymbol);
    }

    function name()
        public
        view
        override(ERC721AUpgradeable, IERC721AUpgradeable)
        returns (string memory)
    {
        return _collectionName;
    }

    function symbol()
        public
        view
        override(ERC721AUpgradeable, IERC721AUpgradeable)
        returns (string memory)
    {
        return _collectionSymbol;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721AUpgradeable, IERC721AUpgradeable)
        returns (string memory)
    {
        if (!_exists(tokenId)) revert InvalidToken();
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }


    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function _beforeTokenTransfers(
        address from,
        address to,
        uint256 startTokenId,
        uint256 quantity
    ) internal override {
        if (to != address(0) && to != from) {
            if (balanceOf(to) + quantity > maxWalletHoldings) revert MaxWalletLimit();
        }
        super._beforeTokenTransfers(from, to, startTokenId, quantity);
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
        recipient.sendValue(balance);
        emit Withdraw(recipient, balance);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        revert FallbackNotAllowed();
    }
}
