## step

deploy contract
create packs

### deploy subgraph

```
goldsky subgraph init --experimental
```

### deploy webhooks with secrets

```
goldsky subgraph webhook create packpayment-mainnet-imtbl-zkevm --url "" --name "mainnet-packpayment" --entity "payment_received" --secret "env"
```
