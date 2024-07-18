// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

//ownable.sol
import "@openzeppelin/contracts/access/Ownable.sol";
//reentrancyGuard.sol
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
//erc20 interface
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PackPayment is Ownable, ReentrancyGuard {
    uint256 public packCounter;
    address public paymentReceiver;
    error ERC20TokenAddressAlreadyExist();
    error PackDoesNotExist();
    error PaymentNotEnough();
    error ERC20PaymentNotSupported();
    error ERC20TokenNotSupported();
    error OutOfStock();
    error PaymentFailed();

    event PaymentReceived(
        address from,
        address tokenAddress,
        uint256 amount,
        string packName,
        string emberId,
        string gameId,
        bytes32 hash
    );

    struct Pack {
        uint256 id;
        string name;
        ERC20Payment[] erc20Payments;
        uint256 inventory;
        uint256 nativePrice;
    }

    struct ERC20Payment {
        address token;
        uint256 price;
    }

    mapping(uint256 => Pack) public packs;

    constructor(address _paymentReceiver) Ownable() {
        paymentReceiver = _paymentReceiver;
        packCounter = 1;
    }

    function createPack(
        string memory _name,
        uint256 nativePrice,
        uint256 _inventory
    ) public onlyOwner {
        packs[packCounter].id = packCounter;
        packs[packCounter].name = _name;
        packs[packCounter].inventory = _inventory;
        packs[packCounter].nativePrice = nativePrice;
        packCounter++;
    }

    function removePack(uint256 _packId) public onlyOwner {
        delete packs[_packId];
    }

    function addERC20Payment(
        uint256 _packId,
        address _token,
        uint256 _price
    ) public onlyOwner {
        if (packs[_packId].id == 0) revert PackDoesNotExist();
        uint256 length = packs[_packId].erc20Payments.length;
        if (length > 0) {
            for (uint256 i = 0; i < packs[_packId].erc20Payments.length; i++) {
                if (packs[_packId].erc20Payments[i].token == _token)
                    revert ERC20TokenAddressAlreadyExist();
            }
        }

        ERC20Payment memory erc20Payment = ERC20Payment(_token, _price);
        packs[_packId].erc20Payments.push(erc20Payment);
    }

    function removeERC20Payment(
        uint256 _packId,
        address _token
    ) public onlyOwner {
        if (packs[_packId].id == 0) revert PackDoesNotExist();
        if (packs[_packId].erc20Payments.length == 0)
            revert ERC20PaymentNotSupported();
        // find the index of the token
        uint256 index = 0;
        uint256 length = packs[_packId].erc20Payments.length;
        for (uint256 i = 0; i < length; i++) {
            if (packs[_packId].erc20Payments[i].token == _token) {
                index = i;
                break;
            }
        }
        //swap the last element with the element to be deleted
        packs[_packId].erc20Payments[index] = packs[_packId].erc20Payments[
            length - 1
        ];

        //delete the last element
        delete packs[_packId].erc20Payments[length - 1];
    }

    function setNativePrice(uint256 _packId, uint256 _price) public onlyOwner {
        if (packs[_packId].id == 0) revert PackDoesNotExist();
        packs[_packId].nativePrice = _price;
    }

    function getAllPacks() external view returns (Pack[] memory) {
        Pack[] memory packViews = new Pack[](packCounter);
        for (uint256 i = 0; i < packCounter; i++) {
            if (packs[i].id == 0) continue;
            packViews[i].id = packs[i].id;
            packViews[i].name = packs[i].name;
            packViews[i].inventory = packs[i].inventory;
            packViews[i].nativePrice = packs[i].nativePrice;
            packViews[i].erc20Payments = packs[i].erc20Payments;
        }
        return packViews;
    }

    function buyPackWithERC20(
        uint256 _packId,
        address _token,
        string calldata _emberId,
        string calldata _gameId,
        uint256 _amount
    ) public nonReentrant {
        Pack memory pack = packs[_packId];
        if (pack.id == 0) revert PackDoesNotExist();
        if (pack.inventory == 0) revert OutOfStock();
        if (pack.inventory < _amount) revert OutOfStock();
        if (pack.erc20Payments.length == 0) revert ERC20PaymentNotSupported();
        bytes32 hash = keccak256(
            abi.encodePacked(
                block.timestamp,
                msg.sender,
                pack.name,
                pack.inventory
            )
        );
        // check if the token is in the pack
        bool tokenExist = false;
        uint256 price = 0;

        for (uint256 i = 0; i < pack.erc20Payments.length; i++) {
            if (pack.erc20Payments[i].token == _token) {
                tokenExist = true;
                price = pack.erc20Payments[i].price;
                break;
            }
        }
        if (!tokenExist) revert ERC20TokenNotSupported();

        pack.inventory -= _amount;

        // transfer the token to the owner
        bool result = IERC20(_token).transferFrom(
            msg.sender,
            paymentReceiver,
            price * _amount
        );

        if (!result) revert PaymentFailed();

        emit PaymentReceived(
            msg.sender,
            _token,
            _amount,
            pack.name,
            _emberId,
            _gameId,
            hash
        );
    }

    function buyPackWithNative(
        uint256 _packId,
        string calldata _emberId,
        string calldata _gameId,
        uint256 _amount
    ) public payable nonReentrant {
        if (packs[_packId].id == 0) revert PackDoesNotExist();
        if (packs[_packId].inventory == 0) revert OutOfStock();
        if (packs[_packId].inventory < _amount) revert OutOfStock();
        if (packs[_packId].nativePrice == 0) revert ERC20PaymentNotSupported();

        //random hash to prevent frontrunning
        bytes32 hash = keccak256(
            abi.encodePacked(
                block.timestamp,
                msg.sender,
                packs[_packId].name,
                packs[_packId].inventory
            )
        );
        uint256 totalPrice = packs[_packId].nativePrice * _amount;
        if (msg.value < totalPrice) revert PaymentNotEnough();
        packs[_packId].inventory -= _amount;
        payable(paymentReceiver).transfer(msg.value);
        emit PaymentReceived(
            msg.sender,
            address(0),
            _amount,
            packs[_packId].name,
            _emberId,
            _gameId,
            hash
        );
    }
}
