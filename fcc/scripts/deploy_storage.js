// imports
const { ethers, run, netowrk } = require("hardhat");

// async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    console.log("Deploying contract ...");
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.waitForDeployment();
    console.log(`Deployed contract to: ${simpleStorage.target}`);
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deploymentTransaction().wait(6);
        await verify(simpleStorage.target, []);
    }

    const currentValue = await simpleStorage.retrieve();
    console.log(`Current value is: ${currentValue}`);

    const transactionResponse = await simpleStorage.store(7);
    await transactionResponse.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    console.log(`Updated Value is: ${updatedValue}`);
}

async function verify(contractAddress, args) {
    console.log("Verifying contract ...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().include("already verified")) {
            console.log("Already verified!")
        }
    }
}

// main
main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});