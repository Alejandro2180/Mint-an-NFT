// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import { Base64 } from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(address => uint256) public addressMinted;

    
    string url = "https://alecjohnson.info/wp-content/uploads/2022/03/Alec_NFT-scaled.jpg";

    event NewEpicNFTMinted(address sender, uint256 tokenId);

    constructor() ERC721 ("AlecJohnsonNFT", "AlecJohnson") {
        console.log("This is my NFT contract!");
    }

    function makeAnEpicNFT() public {

        require(addressMinted[msg.sender] < 1, "Your wallet address has already minted one of my NFTs! Only 1 per person please ;)");
        addressMinted[msg.sender] = 1;
        uint256 newItemId = _tokenIds.current();

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{',
                            '"name": "AlecJohnson#', Strings.toString(newItemId), '",',
                            '"description": "Hi I', "'", 'm Alec! Thank you for minting my NFT. I hope it serves as a token of our connection in this crazy world of web3. Please feel free to reach out to me anytime on twitter @AlecJohnsonDev or on my website www.alecjohnson.info. Cheers!",',
                            '"image" : "', url, '"',
                        '}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n--------------------");
            console.log(
                string(
                    abi.encodePacked(
                        "https://nftpreview.0xdev.codes/?code=",
                        finalTokenUri
                    )
                )
            );
        console.log("--------------------\n");

        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, finalTokenUri);
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
        _tokenIds.increment();

        emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}
