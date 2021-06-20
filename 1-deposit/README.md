## #1 - Deposit

For the first challenge, wrote a contract that accepts deposits and withdraws of ERC-20 tokens.

It also uses the off the shelf `ERC20PresetFixedSupply` contract to implement an ERC-20.

Some learnings:

- The difference between `transferFrom` and `transfer`
- Setting infinite allowances (as `MAX_UINT`, which is a sentinel value). See discussion on [gas savings](https://github.com/ethereum/EIPs/issues/717) when using infinite approval with `transferFrom`
- How to use Remix as a test ground (amazing)

Some references:

- Referenced the [Synthetix Staking contract](https://github.com/Synthetixio/synthetix/blob/v2.45.2/contracts/StakingRewards.sol)
- Referenced YFI
