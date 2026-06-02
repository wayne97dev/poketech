// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {Booster} from "../src/Booster.sol";

contract BoosterTest is Test {
    Booster internal token;

    address internal recipient = address(0xBEEF);
    address internal alice = address(0xA11CE);
    address internal bob = address(0xB0B);

    uint256 internal constant SUPPLY = 1_000_000_000 ether;

    function setUp() public {
        token = new Booster(recipient);
    }

    function test_Metadata() public view {
        assertEq(token.name(), "BOOSTER");
        assertEq(token.symbol(), "BOOST");
        assertEq(token.decimals(), 18);
    }

    function test_InitialSupplyMintedToRecipient() public view {
        assertEq(token.INITIAL_SUPPLY(), SUPPLY);
        assertEq(token.totalSupply(), SUPPLY);
        assertEq(token.balanceOf(recipient), SUPPLY);
    }

    function test_Transfer() public {
        vm.prank(recipient);
        token.transfer(alice, 1_000 ether);
        assertEq(token.balanceOf(alice), 1_000 ether);
        assertEq(token.balanceOf(recipient), SUPPLY - 1_000 ether);
    }

    function test_Burn_ReducesTotalSupply() public {
        vm.prank(recipient);
        token.burn(500 ether);
        assertEq(token.totalSupply(), SUPPLY - 500 ether);
        assertEq(token.balanceOf(recipient), SUPPLY - 500 ether);
    }

    function test_RevertWhen_RecipientIsZero() public {
        vm.expectRevert(bytes("BOOST: recipient is zero"));
        new Booster(address(0));
    }

    function testFuzz_Transfer(uint256 amount) public {
        amount = bound(amount, 0, SUPPLY);
        vm.prank(recipient);
        token.transfer(bob, amount);
        assertEq(token.balanceOf(bob), amount);
    }
}
