// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract BuymeACoffee {
    event NewMemo(
        address indexed from,
        address indexed to,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        address to;
        uint256 timestamp;
        string name;
        string message;
    }

    Memo[] memos;

    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function buyMeCoffee( string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Can't buy coffee with 0 ETH");

        memos.push(Memo(
            msg.sender,
            owner, 
            block.timestamp,
            _name,
            _message
        ));

        emit NewMemo(
            msg.sender,
            owner,
            block.timestamp,
            _name,
            _message
        );
    }

    function withdrawTips() public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(address(this).balance > 0, "No tips to withdraw");

        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }

 
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
