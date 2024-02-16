const { assert, expect } = require("chai");
const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { deploymentChains, INITIAL_SUPPLY, developmentChains } = require("../../helper-hardhat-config");


!developmentChains.includes(network.name)
    ? describe.skip
    : describe("OurToken Unit Test", function() {
        const multiplier = 10 ** 18;
        let ourToken, deployer, user1
        beforeEach(async function() {
            const accounts = await getNamedAccounts();
            deployer = accounts.deployer;
            user1 = accounts.user1;

            await deployments.fixture("all");
            ourToken = await ethers.getContract("OurToken", deployer);
        })

        it("was deployed", async () => {
            assert(ourToken.address);
        })

        describe("constructor", () => {
            it("Should have correct INITIAL_SUPPLY of token ", async () => {
                const totalSupply = await ourToken.totalSupply();
                assert.equal(totalSupply.toString(), INITIAL_SUPPLY);
            })
            it("initializes the token with the correct name and symbol ", async () => {
                const name = (await ourToken.name()).toString();
                assert.equal(name, "OurToken");

                const symbol = (await ourToken.symbol()).toString();
                assert.equal(symbol, "OT");
            })
        })

        describe("transfers", () => {
            it("Should be able to transfer tokens successfully to an address", async () => {
                const tokensToSend = ethers.utils.parseEther("10");
                await ourToken.transfer(user1, tokensToSend);
                expect(await ourToken.balanceOf(user1)).to.equal(tokensToSend);
            })
            it("Emits a transfer event, when a transfer occurs.", async () => {
                await expect(ourToken.transfer(user1, (10 * multiplier).toString())).to.emit(
                    ourToken, "Transfer")
            })
        })

        describe("allowances", () => {
            const amount = (20 * multiplier).toString()
            beforeEach(async () => {
                playerToken = await ethers.getContract("OurToken", user1);
            })
            it("Should approve other address to spend token", async () => {
                const tokensToSpend = ethers.utils.parseEther("5");
                await ourToken.approve(user1, tokensToSpend);
                await playerToken.transferFrom(deployer, user1, tokensToSpend);
                expect(await playerToken.balanceOf(user1)).to.equal(tokensToSpend);
            })
            it("Doesn't allow an unapproved member to do transfers!", async () => {
                await expect(
                    playerToken.transferFrom(deployer, user1, amount)
                ).to.be.revertedWith("ERC20: insufficient allowance");
            })
            it("Emits an approved event, when an approval occurs.", async () => {
                await expect(ourToken.approve(user1, amount)).to.emit(ourToken, "Approval");
            })
            it("The allowance being set is accurate", async () => {
                await ourToken.approve(user1, amount);
                const allowance = await ourToken.allowance(deployer, user1);
                assert.equal(allowance.toString(), amount);
            })
            it("Won't allow a user to go over the allowance!", async () => {
                await ourToken.approve(user1, amount);
                await expect(
                        playerToken.transferFrom(deployer, user1, (40 * multiplier).toString())
                    ).to.be.revertedWith("ERC20: insufficient allowance");
            })
        })
    })