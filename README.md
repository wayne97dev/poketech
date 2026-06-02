# BOOSTER — $BOOST

Live booster-pack openings, on-chain, on **BASE**. Buy a bundle, watch the team rip
it live, win the pulls. Powered by the **$BOOST** token.

> Inspired by the "live pack opening" model (à la PACKS on Solana), rebuilt for BASE
> with its own brand. The site is static and dependency-free; the token is a clean,
> immutable ERC-20.

```
.
├── index.html              # landing page — Netlify publishes the repo root
├── assets/
│   ├── css/styles.css      # holographic booster theme, fully responsive
│   ├── js/main.js          # CONFIG (edit after launch) + live DexScreener stats
│   └── img/og.svg          # social share image
├── netlify.toml            # static deploy config
└── contract/               # Foundry project for the $BOOST ERC-20 (see contract/README.md)
```

## 1) The website

Plain HTML/CSS/JS — no build step.

```bash
# open it directly, or serve locally so fetch() works:
python3 -m http.server 8080      # → http://localhost:8080
```

**Deploy on Netlify:** connect this GitHub repo → Netlify auto-detects `netlify.toml`
and publishes the root. Or drag-and-drop the folder at app.netlify.com/drop.

**Configure after launch** — everything lives in `CONFIG` at the top of
[`assets/js/main.js`](assets/js/main.js): `tokenAddress`, `pairAddress`, and the
social / DEX links. Set the pair and the site pulls **live** price, market cap and
liquidity from DexScreener automatically.

> Placeholders to set before going live: bundle prices, tokenomics split, socials.

## 2) The token

A fixed-supply, immutable ERC-20 on BASE — **no owner, no mint, no tax**.
Build & deploy instructions in [`contract/README.md`](contract/README.md).

```bash
cd contract
forge install foundry-rs/forge-std
forge install OpenZeppelin/openzeppelin-contracts
forge test -vvv
```

## ⚠️ Disclaimer

`$BOOST` is a community token for entertainment. Nothing here is financial advice.
Crypto is volatile and high-risk; live pack openings carry an element of chance. **18+.**
Pack-opening / "break" businesses can be treated as gambling or regulated activity in
some jurisdictions — sort out the legal/compliance side before launching.
