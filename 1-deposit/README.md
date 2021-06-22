## #1 - Deposit

For the first challenge, wrote a contract that accepts deposits and withdraws of ERC-20 tokens. And then extended it to deposit and withdraw ETH.

It also uses the off the shelf `ERC20PresetFixedSupply` contract to implement an ERC-20.

Days: 1, 2

Some learnings:

- The difference between `transferFrom` and `transfer`
- Setting infinite allowances (as `MAX_UINT`, which is a sentinel value). See discussion on [gas savings](https://github.com/ethereum/EIPs/issues/717) when using infinite approval with `transferFrom`
- How to use Remix as a test ground (amazing)
- The [difference](https://solidity-by-example.org/sending-ether/) between `send` and `transfer`
- The difference between `fallback` and `receive` functions
  - receive is for treating a smart contract like an EOA (triggered when someone accidentally sends ETH to contract)
  - fallback is when someone calls a function that doesn't exist on a smart contract (someone messed up the calldata and chose a bogus function selector)

Some references:

- Referenced the [Synthetix Staking contract](https://github.com/Synthetixio/synthetix/blob/v2.45.2/contracts/StakingRewards.sol)
- Referenced [YFI](https://etherscan.io/address/0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e#code)
- Referenced [WETH](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code)
