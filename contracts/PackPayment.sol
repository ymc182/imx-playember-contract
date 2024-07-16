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
        bytes32 hash
    );

    struct Pack {
        uint256 id;
        string name;
        mapping(uint256 => ERC20Payment) erc20Payment;
        NativePayment nativePayment;
        uint256 erc20PaymentCounter;
        uint256 inventory;
    }

    struct PackView {
        uint256 id;
        string name;
        ERC20Payment[] erc20Payment;
        NativePayment nativePayment;
    }

    struct ERC20Payment {
        address token;
        uint256 price;
    }

    struct NativePayment {
        uint256 price;
    }

    mapping(uint256 => Pack) public packs;

    constructor(address _paymentReceiver) Ownable() {
        paymentReceiver = _paymentReceiver;
    }

    function CreatePack(
        string memory _name,
        uint256 nativePrice,
        uint256 _inventory
    ) public onlyOwner {
        packs[packCounter].id = packCounter;
        packs[packCounter].name = _name;
        packs[packCounter].nativePayment.price = nativePrice;
        packs[packCounter].inventory = _inventory;
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

        for (uint256 i = 0; i < packs[_packId].erc20PaymentCounter; i++) {
            if (packs[_packId].erc20Payment[i].token == _token)
                revert ERC20TokenAddressAlreadyExist();
        }

        uint256 erc20PaymentCounter = packs[_packId].erc20PaymentCounter;
        ERC20Payment memory erc20Payment = ERC20Payment(_token, _price);
        packs[_packId].erc20Payment[erc20PaymentCounter] = erc20Payment;
        packs[_packId].erc20PaymentCounter++;
    }

    function removeERC20Payment(
        uint256 _packId,
        address _token
    ) public onlyOwner {
        if (packs[_packId].id == 0) revert PackDoesNotExist();
        if (packs[_packId].erc20PaymentCounter == 0)
            revert ERC20PaymentNotSupported();
        // find the index of the token
        uint256 index = 0;
        for (uint256 i = 0; i < packs[_packId].erc20PaymentCounter; i++) {
            if (packs[_packId].erc20Payment[i].token == _token) {
                index = i;
                break;
            }
        }
        //swap the last element with the element to be deleted
        packs[_packId].erc20Payment[index] = packs[_packId].erc20Payment[
            packs[_packId].erc20PaymentCounter - 1
        ];
        packs[_packId].erc20PaymentCounter--;
        //delete the last element
        delete packs[_packId].erc20Payment[packs[_packId].erc20PaymentCounter];
    }

    function addNativePayment(
        uint256 _packId,
        uint256 _price
    ) public onlyOwner {
        if (packs[_packId].id == 0) revert PackDoesNotExist();
        packs[_packId].nativePayment.price = _price;
    }

    function getAllPacks() external view returns (PackView[] memory) {
        PackView[] memory packViews = new PackView[](packCounter);
        for (uint256 i = 0; i < packCounter; i++) {
            if (packs[i].id == 0) continue;
            packViews[i].id = packs[i].id;
            packViews[i].name = packs[i].name;
            packViews[i].nativePayment = packs[i].nativePayment;
            for (uint256 j = 0; j < packs[i].erc20PaymentCounter; j++) {
                packViews[i].erc20Payment[j] = packs[i].erc20Payment[j];
            }
        }
        return packViews;
    }

    function buyPackWithERC20(
        uint256 _packId,
        address _token,
        uint256 _amount
    ) public nonReentrant {
        if (packs[_packId].id == 0) revert PackDoesNotExist();
        if (packs[_packId].inventory == 0) revert OutOfStock();
        if (packs[_packId].erc20PaymentCounter == 0)
            revert ERC20PaymentNotSupported();
        bytes32 hash = keccak256(
            abi.encodePacked(block.timestamp, msg.sender, packs[_packId].name)
        );
        // check if the token is in the pack
        bool tokenExist = false;
        uint256 price = 0;

        for (uint256 i = 0; i < packs[_packId].erc20PaymentCounter; i++) {
            if (packs[_packId].erc20Payment[i].token == _token) {
                tokenExist = true;
                price = packs[_packId].erc20Payment[i].price;
                break;
            }
        }
        if (!tokenExist) revert ERC20TokenNotSupported();
        if (_amount < price) revert PaymentNotEnough();

        packs[_packId].inventory--;

        // transfer the token to the owner
        bool result = IERC20(_token).transferFrom(
            msg.sender,
            paymentReceiver,
            _amount
        );

        if (!result) revert PaymentFailed();

        emit PaymentReceived(
            msg.sender,
            _token,
            _amount,
            packs[_packId].name,
            hash
        );
    }

    function buyPackWithNative(uint256 _packId) public payable nonReentrant {
        if (packs[_packId].id == 0) revert PackDoesNotExist();
        if (packs[_packId].inventory == 0) revert OutOfStock();

        //random hash to prevent frontrunning
        bytes32 hash = keccak256(
            abi.encodePacked(block.timestamp, msg.sender, packs[_packId].name)
        );
        uint256 price = packs[_packId].nativePayment.price;
        if (msg.value < price) revert PaymentNotEnough();
        packs[_packId].inventory--;
        payable(paymentReceiver).transfer(msg.value);
        emit PaymentReceived(
            msg.sender,
            address(0),
            msg.value,
            packs[_packId].name,
            hash
        );
    }
}
