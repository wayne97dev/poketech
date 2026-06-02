// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "openzeppelin-contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title  BOOSTER — $BOOST
 * @notice Fixed-supply, immutable ERC-20 for the BASE network.
 *
 *         Design goals: maximally trustless, nothing for a "team" to abuse.
 *         There is NO owner, NO mint function, NO transfer tax, NO pause and
 *         NO blacklist. The entire supply is minted exactly once, at deploy,
 *         to `recipient`. Holders may optionally burn their own tokens
 *         (via ERC20Burnable). Because there are zero privileged functions,
 *         there is nothing to "renounce" — it is immutable from block one.
 *
 *         Total supply: 1,000,000,000 BOOST (18 decimals).
 */
contract Booster is ERC20, ERC20Burnable {
    /// @dev 1,000,000,000 * 1e18 — the Solidity `ether` unit equals 1e18.
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 ether;

    /// @param recipient Address that receives the full initial supply.
    constructor(address recipient) ERC20("BOOSTER", "BOOST") {
        require(recipient != address(0), "BOOST: recipient is zero");
        _mint(recipient, INITIAL_SUPPLY);
    }
}
