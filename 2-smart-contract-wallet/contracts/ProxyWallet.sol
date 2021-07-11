//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract ProxyWallet {
    function proxyCall(
        address target,
        uint256 _value,
        bytes calldata data
    ) public returns (bytes memory _result) {
        bool success;
        (success, _result) = target.call{value: _value}(data);
        console.log("was call successful: ", success);
        console.logBytes(_result);
        return _result;
    }

    function proxyDelegateCall(address target, bytes calldata data)
        public
        returns (bytes memory _result)
    {
        bool success;
        (success, _result) = target.delegatecall(data);
        console.log("was delegatecall successful: ", success);
        console.logBytes(_result);
        return _result;
    }
}
