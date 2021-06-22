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

  describe("ERC20 Deposits and Withdraws", async () => {
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

  describe("ETH Deposits and Withdraws", async () => {
    it("should allow deposits", async () => {
      await deposit.depositETH({ value: ethers.constants.WeiPerEther });

      const res = await deposit.balanceOfETH(owner.address);
      expect(res).to.be.eq(ethers.constants.WeiPerEther);
    });

    it("should allow deposits (via receive)", async () => {
      await owner.sendTransaction({
        to: deposit.address,
        value: ethers.constants.WeiPerEther,
      });

      const res = await deposit.balanceOfETH(owner.address);
      expect(res).to.be.eq(ethers.constants.WeiPerEther);
    });

    it("should allow deposits (via fallback)", async () => {
      await owner.sendTransaction({
        to: deposit.address,
        value: ethers.constants.WeiPerEther,
        data: "0x1234567890", // garbage data
      });

      const res = await deposit.balanceOfETH(owner.address);
      expect(res).to.be.eq(ethers.constants.WeiPerEther);
    });

    it("should allow withdraws", async () => {
      await deposit.depositETH({ value: ethers.constants.WeiPerEther });
      await deposit.withdrawETH(ethers.constants.WeiPerEther);

      const res = await deposit.balanceOfETH(owner.address);
      expect(res).to.be.eq(0);
    });

    it("should not allow withdraws for more than balanceOfETH", async () => {
      await deposit.depositETH({ value: ethers.constants.WeiPerEther });
      try {
        await deposit.withdrawETH(
          ethers.constants.WeiPerEther.add(ethers.constants.One)
        );
        expect.fail("should never reach because withdraw should fail");
      } catch (e) {
        expect(e.message).to.match(/cannot withdraw more than balance/);
      }

      const res = await deposit.balanceOfETH(owner.address);
      expect(res).to.be.eq(ethers.constants.WeiPerEther);
    });
  });
});
