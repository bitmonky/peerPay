# peerPay
A distributed ledger that uses the peerTree network

## Problem:
How can you avoid storing every record of a transaction on the every node but still be sure that no peers in the group can colude by working together to
produce false transactions?

## Proposed Solution:
Store n copies of the record on a randomly selected subset of the network.

## Considerations:
You have x nodes on a P2P network and you want to randomly select n of those nodes to validate and store the transaction.  Unfortunately nobody trusts anybody including yourself,  so no single node can select the list for you.  Some how the selection of the n nodes must be done by the whole group.

## Methodology:
Broadcast to the group a request for a response from the first n nodes to complete a POW problem.  The first n nodes to complete the task are your random group of size n.  To prove that solution is correct each node will show their work like so.
```
WorkDone = {
  txID : txID,
  node : nodeAddress,  
  data : data,
  difficulty : int,
  nonce : random integer,
  ECpubkey : nodesECpubkey,
  hash : hash of data + nonce,
  signature : digitalSig(hash,ECpubkey)
}
```
where the request for POW looks like this
```
powRequest = { 
  data : data,
  txID : hash('sha256',data),
  difficulty : integer,
}
```
Your POW group key becomes
```
gPowKey = {
  gpowGroup = nodeAdrList[n]
  gPowkeyID : hash('sha256',gpowGroup);
}  
```
Anyone on the network can now request to see the transaction by broadcasting a request to the network asking for
nodes to send a copy of the record using its txID. The n nodes in the network will respond back each with a copy of the record and the gPowKey.  Any 
responses from nodes not it the gPowGroup should be discarded as false.

