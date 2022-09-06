const express = require('express');
const app = express();
const Blockchain = require('./blockchain');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const port = process.argv[2];
const nodeAddress = uuidv4().split('-').join('');
const bitcoin = new Blockchain();
//Body Parse
app.use(express.json());

// Get entire blockchain
app.get('/blockchain', (req, res) => {
  res.send(bitcoin);
});

// Create a new transaction
app.post('/transaction', (req, res) => {
  const newTransaction = req.body;
  const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
  res.json({ note: `Transaction will be added in block ${blockIndex}.`});
  // const { amount, sender, recipient } = req.body;
  // const blockIndex = bitcoin.createNewTransaction(amount, sender, recipient);
  // res.json({ note: `Transaction will be added in block ${blockIndex}.`});
});

app.post('/transaction/broadcast', (req, res) => {
  const { amount, sender, recipient } = req.body;
  const newTransaction = bitcoin.createNewTransaction(amount, sender, recipient);
  bitcoin.addTransactionToPendingTransactions(newTransaction);
  const requestPromises = [];
  bitcoin.networkNodes.forEach(newtworkNodeUrl => {
    const requestOptions = {
      url: newtworkNodeUrl + '/transaction',
      method: 'POST',
      data: { 
        newTransaction
      }
    }
    requestPromises.push(axios(requestOptions));
  });
  Promise.all(requestPromises).then(data => {
    res.json({ note: 'Transaction created and successfully.' });
  })
});

// Mine a block
app.get('/mine', (req, res) => {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1
  };
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
  //bitcoin.createNewTransaction(12.5, "00", nodeAddress);
  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
  const requestPromises = [];
  bitcoin.networkNodes.forEach(newtworkNodeUrl => {
    const requestOptions = {
      url: newtworkNodeUrl + '/receive-new-block',
      method: 'POST',
      data: {
        newBlock
      }
    }
    requestPromises.push(axios(requestOptions));
  });
  Promise.all(requestPromises).then(data => {
    const requestOptions = {
      url: bitcoin.currentNodeUrl + '/transaction/broadcast',
      method: 'POST',
      data: {
        amount: 12.5, 
        sender: "00",
        recipient: nodeAddress
      }
    }
    axios(requestOptions);
  }).then(data => {
    res.json({
      note: 'New block mined & broadcast successfully.',
      block: newBlock
    });
  });
});

app.post('/receive-new-block', (req, res) => {
  const { newBlock } = req.body;
  const lastBlock = bitcoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
  if(correctHash && correctIndex){
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransactions = [];
    res.json({
      note: 'New block received and accepted.',
      newBlock
    });
  } else {
    res.json({
      note: 'New block rejected.',
      newBlock
    });
  }
});

// Register a node and broadcast it the newtwork
app.post('/register-broadcast-node', (req, res) => { 
  try {
    const newNodeUrl = req.body.newNodeUrl;
    if(bitcoin.networkNodes.indexOf(newNodeUrl) === -1) bitcoin.networkNodes.push(newNodeUrl);
    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(newtworkNodeUrl => {
      const requestOptions = {
        url: newtworkNodeUrl + '/register-node', 
        method: 'POST',
        data: {
          newNodeUrl
        }
      };
      regNodesPromises.push(axios(requestOptions))
    });
    Promise.all([regNodesPromises]).then((data) => {
      const bulkRegisterOptions = {
        url: newNodeUrl + '/register-nodes-bulk', 
        method: 'POST',
        data: {
          allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
        }
      };
      axios(bulkRegisterOptions);
    }).then(data => {
      res.json({ note: 'New node registered successfully.' });
    }).catch(err => {
      console.error(err);
    });
  } catch(e) {
    console.error(e)
  }
});

// Register a node with the newtwork
app.post('/register-node', (req, res) => { 
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) === -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
  if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
  res.json({ note: 'New node registered successfully.'})
});

// Register multiple nodes at once
app.post('/register-nodes-bulk', (req, res) => {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) === -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
    if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
  });
  res.json({ note: 'Bulk registration successful.' });
});

app.get('/consensus', (req, res) => {
  const requestPromises = [];
  bitcoin.networkNodes.forEach(newtworkNodeUrl => {
    const requestOptions = {
      url: newtworkNodeUrl + '/blockchain', 
      method: 'GET'
    };
    requestPromises.push(axios(requestOptions));
  });
  Promise.all(requestPromises).then(blockchains => {
    const currentChainLength = bitcoin.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach(blockchain => {
      if(blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });
    if(!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
      res.json({
        note: 'Current chain has not been replaced.',
        chain: bitcoin.chain
      })
    } else {
      bitcoin.chain = newLongestChain;
      bitcoin.pendingTransactions = newPendingTransactions;
      res.json({
        note: 'This chain has been replaced.',
        chain: bitcoin.chain
      })
    }
  })
});

//localhost:3001/block/62e9d8e33c421a4d3fce8669b5dea7
app.get('/block/:blockHash', (req, res) => {  
  const { blockHash } = req.params;
  const correctBlock = bitcoin.getBlock(blockHash);
  res.json({ 
    block: correctBlock
  });
});

app.get('/transaction/:transactionId', (req, res) => {
  const { transactionId } = req.params;
  const transactionData = bitcoin.getTransaction(transactionId);
  res.json({ 
    transaction: transactionData.transaction,
    block: transactionData.block
  });
});

app.get('/address/:address', (req, res) => {
  const { address } = req.params;
  const addressData = bitcoin.getAddressData(address);
  res.json({ 
    addressData
  })
});

app.get('/block-explorer', (req, res) =>{
  res.sendFile('./block-explorer/index.html', { 
    root: __dirname
  });
});


app.listen(port, () => { console.log(`Listening on port ${port}...`)});