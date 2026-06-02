# $BOOST — Foundry contract

The **BOOSTER** token: a fixed-supply, immutable ERC-20 for **BASE**.

- **No owner, no mint, no tax, no pause, no blacklist.** Nothing to renounce — it's immutable from block one.
- Total supply: **1,000,000,000 BOOST** (18 decimals), minted once at deploy.
- Holders can optionally burn their own tokens (`ERC20Burnable`).

Source: [`src/Booster.sol`](src/Booster.sol).

## Setup

```bash
cd contract
# install dependencies (writes to lib/, which is git-ignored)
forge install foundry-rs/forge-std
forge install OpenZeppelin/openzeppelin-contracts

forge build
forge test -vvv
```

## Deploy

1. `cp .env.example .env` and fill in `PRIVATE_KEY` + `BASESCAN_API_KEY`.
   Use a **throwaway wallet** with a little ETH on BASE.
2. **Testnet first** (Base Sepolia — get test ETH from a faucet):

   ```bash
   source .env
   forge script script/Deploy.s.sol:DeployBooster \
     --rpc-url base_sepolia --broadcast --verify -vvvv
   ```

3. **Mainnet** (BASE):

   ```bash
   source .env
   forge script script/Deploy.s.sol:DeployBooster \
     --rpc-url base --broadcast --verify -vvvv
   ```

The deployed address is printed at the end and the source is verified on BaseScan.

## After deploy — go live

1. **Add liquidity** on [Aerodrome](https://aerodrome.finance) (or Uniswap on BASE):
   pair $BOOST with ETH/USDC, then **lock or burn the LP** so holders can trust it.
2. Grab the **pool/pair address** from DexScreener.
3. In the site's `assets/js/main.js`, set `CONFIG.tokenAddress` and `CONFIG.pairAddress`
   → the contract pill + live price/market-cap/liquidity light up automatically.

## ⚠️ Notes

- This token has no built-in "trading enable" switch or anti-bot logic — it is a plain,
  honest ERC-20. Plan your launch (LP timing, anti-snipe) accordingly.
- Pack-opening / "break" mechanics are **off-chain** and may be regulated (gambling /
  money transmission) in your jurisdiction. Get legal advice before operating.
