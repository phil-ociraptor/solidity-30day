pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";

contract MyERC20 is ERC20PresetFixedSupply {
    constructor()
        public
        ERC20PresetFixedSupply("Poop Token", "POOP", 10 * 10**18, msg.sender)
    {}
}
