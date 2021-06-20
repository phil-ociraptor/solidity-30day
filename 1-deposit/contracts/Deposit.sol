pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Deposit {
    using SafeMath for uint256;

    mapping(address => mapping(address => uint256)) private _balances;

    constructor() {}

    function deposit(address tokenAddr, uint256 amount) public {
        IERC20 token = IERC20(tokenAddr);
        token.transferFrom(msg.sender, address(this), amount); //this feels sketch. Can msg.sender be trusted? What is SafeTransferFrom?
        _balances[tokenAddr][msg.sender] = _balances[tokenAddr][msg.sender].add(
            amount
        ); // this feels unsafe... need to use safemath?
    }

    function withdraw(address tokenAddr, uint256 amount) public {
        require(
            amount <= _balances[tokenAddr][msg.sender],
            "cannot withdraw more than balance - fuck off"
        );
        IERC20 token = IERC20(tokenAddr);
        token.transfer(msg.sender, amount);
        _balances[tokenAddr][msg.sender] = _balances[tokenAddr][msg.sender].sub(
            amount
        ); // this feels unsafe... need to use safemath?
    }

    function balanceOf(address tokenAddr, address account)
        external
        view
        returns (uint256)
    {
        return _balances[tokenAddr][account];
    }
}
