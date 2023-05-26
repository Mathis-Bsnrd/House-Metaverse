// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HouseNFT {
    uint256 public cost; // Coût d'une maison
    uint256 public maxSupply; // Quantité totale de maisons disponibles
    uint256 public totalSupply; // Dotation maximale de maisons qu'un utilisateur peut avoir

    struct House {
        address owner; // Propriétaire de la maison
        // Autres variables liées à la maison
    }

    House[] public houses; // Tableau contenant toutes les maisons

    constructor(uint256 _cost, uint256 _maxSupply, uint256 _totalSupply) {
        cost = _cost;
        maxSupply = _maxSupply;
        totalSupply = _totalSupply;

        // Ajouter les maisons initiales au déploiement du contrat
        for (uint256 i = 0; i < _maxSupply; i++) {
            houses.push(House(address(0)));
        }
    }

    function mint() public payable {
        require(msg.value >= cost, "Insufficient ETH"); // Vérifier si le montant d'ETH est suffisant
        require(totalSupply < maxSupply, "Max supply reached"); // Vérifier si la dotation maximale est atteinte

        uint256 tokenId = totalSupply; // Identifiant du NFT équivalent à la dotation actuelle
        require(houses[tokenId].owner == address(0), "House already owned"); // Vérifier si la maison est déjà possédée

        houses[tokenId].owner = msg.sender; // Attribuer la maison à l'acheteur
        totalSupply++; // Augmenter la dotation actuelle

        // Éventuellement, émettre le NFT correspondant à la maison
    }
}