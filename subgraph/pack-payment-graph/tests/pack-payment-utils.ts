import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  PaymentReceived
} from "../generated/PackPayment/PackPayment"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPaymentReceivedEvent(
  from: Address,
  tokenAddress: Address,
  amount: BigInt,
  packName: string,
  emberId: string,
  hash: Bytes
): PaymentReceived {
  let paymentReceivedEvent = changetype<PaymentReceived>(newMockEvent())

  paymentReceivedEvent.parameters = new Array()

  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("packName", ethereum.Value.fromString(packName))
  )
  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("emberId", ethereum.Value.fromString(emberId))
  )
  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromFixedBytes(hash))
  )

  return paymentReceivedEvent
}
