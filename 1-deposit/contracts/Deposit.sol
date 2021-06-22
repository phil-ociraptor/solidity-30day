pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Deposit {
    using SafeMath for uint256;

    mapping(address => mapping(address => uint256)) private _balances;
    mapping(address => uint256) private _ethBalances;

    constructor() {}

    function deposit(address tokenAddr, uint256 amount) public {
        IERC20 token = IERC20(tokenAddr);
        token.transferFrom(msg.sender, address(this), amount); //this feels sketch. Can msg.sender be trusted? What is SafeTransferFrom?
        _balances[tokenAddr][msg.sender] = _balances[tokenAddr][msg.sender].add(
            amount
        );
    }

    function depositETH() public payable {
        _ethBalances[msg.sender] = _ethBalances[msg.sender].add(msg.value);
    }

    function withdraw(address tokenAddr, uint256 amount) public {
        require(
            amount <= _balances[tokenAddr][msg.sender],
            "cannot withdraw more than balance"
        );
        IERC20 token = IERC20(tokenAddr);
        token.transfer(msg.sender, amount);
        _balances[tokenAddr][msg.sender] = _balances[tokenAddr][msg.sender].sub(
            amount
        );
    }

    function withdrawETH(uint256 amount) public {
        require(
            amount <= _ethBalances[msg.sender],
            "cannot withdraw more than balance"
        );
        _ethBalances[msg.sender] = _ethBalances[msg.sender].sub(amount);
        payable(msg.sender).transfer(amount);
    }

    function balanceOf(address tokenAddr, address account)
        external
        view
        returns (uint256)
    {
        return _balances[tokenAddr][account];
    }

    function balanceOfETH(address account) external view returns (uint256) {
        return _ethBalances[account];
    }

    // Used when msg.data is empty (someone intended to send ETH)
    receive() external payable {
        depositETH();
    }

    // Used when msg.data is not empty (someone intended to call another payable function, but messed up)
    fallback() external payable {
        depositETH();
    }
}
