const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deposit contract", function () {
  let MyERC20;
  let deposit;
  let erc20;
  let owner;
  let addrs;

  beforeEach(async function () {
    MyERC20 = await ethers.getContractFactory("MyERC20");
    Deposit = await ethers.getContractFactory("Deposit");
    [owner, ...addrs] = await ethers.getSigners();

    erc20 = await MyERC20.deploy();
    deposit = await Deposit.deploy();
  });

  describe("Deposits and Withdraws", async () => {
    it("should allow deposits", async () => {
      await erc20.approve(deposit.address, ethers.constants.MaxUint256);

      await deposit.deposit(erc20.address, 500);

      const res = await deposit.balanceOf(erc20.address, owner.address);
      expect(res).to.be.eq(500);
    });

    it("should allow withdraws", async () => {
      await erc20.approve(deposit.address, ethers.constants.MaxUint256);

      await deposit.deposit(erc20.address, 500);
      await deposit.withdraw(erc20.address, 500);

      const res = await deposit.balanceOf(erc20.address, owner.address);
      expect(res).to.be.eq(0);
    });

    it("should not allow withdraws for more than balanceOf", async () => {
      await erc20.approve(deposit.address, ethers.constants.MaxUint256);

      await deposit.deposit(erc20.address, 500);
      try {
        await deposit.withdraw(erc20.address, 501);
        expect.fail("should never reach because withdraw should fail");
      } catch (e) {
        expect(e.message).to.match(/cannot withdraw more than balance/);
      }

      const res = await deposit.balanceOf(erc20.address, owner.address);
      expect(res).to.be.eq(500);
    });
  });
});
