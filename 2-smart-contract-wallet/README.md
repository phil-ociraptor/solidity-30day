## #2 - Smart Contract Wallet

For the second challenge, writing a simple smart contract wallet to help me understand how they work and when they might cause UX issues.

Days: 4, 5

Running tests:
```
npx hardhat compile
npx hardhat test
```

Steps

1. More familiarity with Hardhat using `npx hardhat` to set up project
2. Reading about Gnosis Safe's `execTransaction` ([link](https://docs.gnosis.io/safe/docs/contracts_tx_execution/)) and Argent Vault's `invoke` ([link](https://github.com/argentlabs/argent-contracts/blob/develop/contracts/wallet/BaseWallet.sol#L126)). Gnosis allows choice of `call` and `delegatecall`. Argent only has `call`

Learnings

1.  `delegatecall` is used for "delegating" the internals of one smart contract to another. It is only useful for upgrading smart contracts or implementing library functions. In `delegatcall`, the `msg.sender`and `msg.value` do not change when calling the other contract, and the storage context is the calling contract. `delegatecall` does not affect the calling contract at all.
2. `tx.origin` is always the EOA
3. For Argent and Gnosis `call`, the `tx.origin != msg.sender`
4. From what I can tell, smart contract wallets are essentially puppets that are controlled by EOAs. A better name for them might just be Proxy Wallets instead of Smart Contract Wallets, but whatever.


References:

- [Argent Smart Contract Wallet](https://github.com/argentlabs/argent-contracts)
- [Gnosis Safe](https://docs.gnosis.io/safe/)
  - Video: [How to use Gnosis Safe](https://www.youtube.com/watch?v=kGDwzjqdcLg)
- Helpful resource on `delegatecall` vs `call` - and how the Library keyword automatically switches contexts like `delegatecall` ([link](https://www.blocksism.com/solidity-delegatecall-call-library/))