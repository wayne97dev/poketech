// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {Booster} from "../src/Booster.sol";

/**
 * @notice Deploys $BOOST.
 *
 * Always test on Base Sepolia first:
 *   forge script script/Deploy.s.sol:DeployBooster \
 *     --rpc-url base_sepolia --broadcast --verify -vvvv
 *
 * Then mainnet:
 *   forge script script/Deploy.s.sol:DeployBooster \
 *     --rpc-url base --broadcast --verify -vvvv
 *
 * The full supply is minted to TOKEN_RECIPIENT (defaults to the deployer).
 */
contract DeployBooster is Script {
    function run() external returns (Booster token) {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        address recipient = vm.envOr("TOKEN_RECIPIENT", deployer);

        vm.startBroadcast(pk);
        token = new Booster(recipient);
        vm.stopBroadcast();

        console2.log("BOOSTER ($BOOST) deployed at:", address(token));
        console2.log("Initial supply minted to:", recipient);
    }
}
