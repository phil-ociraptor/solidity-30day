const { expect } = require("chai");

describe("Greeter", () => {
  it("Should return the new greeting once it's changed", async () => {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    
    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("ProxyWallet", () => {

  let greeter;
  let wallet;
  let erc20;
  let signer;

  beforeEach(async () => {
    // Deploy Greeter
    const Greeter = await ethers.getContractFactory("Greeter");
    greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    // Deploy ProxyWallet
    const ProxyWallet = await ethers.getContractFactory("ProxyWallet");
    wallet = await ProxyWallet.deploy();
    await wallet.deployed();

    // Deploy MyERC20 
    const MyERC20 = await ethers.getContractFactory("MyERC20");
    erc20 = await MyERC20.deploy();
    await erc20.deployed();

    let _ignored;
    [signer, _ignored] = await ethers.getSigners();
  });

  it("Should be able to call", async () => {
    // Call Greeter via Proxy Wallet
    const greeterIface = greeter.interface;
    const newGreeting = "Sup I've changed it";
    const calldata = greeterIface.encodeFunctionData("setGreeting", [newGreeting]);
    const proxyTx = await wallet.proxyCall(greeter.address, 0, calldata);
    await proxyTx.wait();

    expect(await greeter.greet()).to.equal(newGreeting);
    expect(await greeter.author()).to.equal(wallet.address);
  });

  it("Should be able to delegatecall", async () => {
    // Call Greeter via Proxy Wallet
    const greeterIface = greeter.interface;
    const newGreeting = "Sup I've changed it";
    const calldata = greeterIface.encodeFunctionData("setGreeting", [newGreeting]);
    const proxyTx = await wallet.proxyDelegateCall(greeter.address, calldata);
    await proxyTx.wait();

    // greeter contract state is unchanged
    expect(await greeter.greet()).to.equal("Hello, world!");
    expect(await greeter.author()).to.equal('0x0000000000000000000000000000000000000000');
  });

  it("Should be able to perform ERC20 operations via the ProxyWallet", async () => {
    // Transfer tokens to Proxy Wallet
    const transferTx = await erc20.transfer(wallet.address, 500);
    await transferTx.wait();
    
    const erc20Iface = erc20.interface;
    const transferCalldata = erc20Iface.encodeFunctionData("transfer", [signer.address, "100"]);
    const proxyTx = await wallet.proxyCall(erc20.address, 0, transferCalldata);
    await proxyTx.wait();

    expect(await erc20.balanceOf(wallet.address)).to.eq(400);
  });
});
