const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

/**********************************
Test BlockChain Function
bitcoin.createNewBlock(1234, 'ASWFLDIJDHERC', '4156985544444');
bitcoin.createNewTransaction(100, 'RODIGILGLGL23', 'MANIGILGLGL56');
bitcoin.createNewBlock(3456, 'JGKIGILGLGLGL', '3594785555554');

bitcoin.createNewTransaction(500, 'RODIGILGLGL23', 'MANIGILGLGL56');
bitcoin.createNewTransaction(600, 'RODIGILGLGL23', 'MANIGILGLGL56');
bitcoin.createNewTransaction(1000, 'RODIGILGLGL23', 'MANIGILGLGL56');

bitcoin.createNewBlock(8967, 'SWELPOLDKEJFU', '1236965755665');

console.log(bitcoin);
console.log(bitcoin.chain);
console.log(bitcoin.pendingTransactions);
***********************************/

/* ********************************
Test Hash Function
console.log('init')
const previousBlockHash = 'aaaererers';
const currentBlockData = [
  {
    amount: 10,
    sender: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    recipient: 'bbbbbbbbbbbbbbbbbbbbbb',
  },
  {
    amount: 30,
    sender: 'aaaaaa',
    recipient: 'ccccc'
  },
  {
    amount: 50,
    sender: 'xxxxxx',
    recipient: 'fffff'
  }
];
// const nonce = 100;
console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 15351));
//console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData, ));
//console.log(bitcoin)
*********************************/
//Test Chain is Valid
const bc1 = {
  chain: [
    {
      index: 1,
      timestamp: 1662258596485,
      transactions: [],
      nonce: 100,
      hash: '0',
      previousBlockHash: '0',
    },
    {
      index: 2,
      timestamp: 1662258672524,
      transactions: [
        {
          amount: 100,
          sender: 'NFANSSDFHYHN90SNFAS',
          recipient: 'IUM99MENUUUFAN',
          transactionId: '52aa80b710e449fda28897f3793c24f1',
        },
        {
          amount: 200,
          sender: 'NFANSSDFHYHN90SNFAS',
          recipient: 'IUM99MENUUUFAN',
          transactionId: 'd9e2e3e639ab4addbc2254ed88fda059',
        },
        {
          amount: 300,
          sender: 'NFANSSDFHYHN90SNFAS',
          recipient: 'IUM99MENUUUFAN',
          transactionId: 'a06683776d8b4e0cba540d6ce0cdc680',
        },
      ],
      nonce: 42594,
      hash: '0000b4e2e70cb88e21ccc197b432bcdff107a4acfc129f2f50dd8054278958c5',
      previousBlockHash: '0',
    },
    {
      index: 3,
      timestamp: 1662258805623,
      transactions: [
        {
          amount: 12.5,
          sender: '00',
          recipient: 'fffb6b863ad14aef883ceb0f9c560d28',
          transactionId: '6a98918d879748c0a88c9c8108aaeaa4',
        },
        {
          amount: 400,
          sender: 'NFANSSDFHYHN90SNFAS',
          recipient: 'IUM99MENUUUFAN',
          transactionId: '17c86686aba144fba10dc7af86e61ae8',
        },
        {
          amount: 500,
          sender: 'NFANSSDFHYHN90SNFAS',
          recipient: 'IUM99MENUUUFAN',
          transactionId: '7f4d7a0867a940f3a396ca0a60c49848',
        },
        {
          amount: 600,
          sender: 'NFANSSDFHYHN90SNFAS',
          recipient: 'IUM99MENUUUFAN',
          transactionId: '360f6fd0c9f04341ad4b10e37b2d6b0c',
        },
        {
          amount: 700,
          sender: 'NFANSSDFHYHN90SNFAS',
          recipient: 'IUM99MENUUUFAN',
          transactionId: '05d17fbb2b074bf0903f87fabc60af20',
        },
      ],
      nonce: 48276,
      hash: '0000f3ade70e82d4a5df2aef91bc0658371ddc47274c1b9988c476c0d1a75021',
      previousBlockHash:
        '0000b4e2e70cb88e21ccc197b432bcdff107a4acfc129f2f50dd8054278958c5',
    },
    {
      index: 4,
      timestamp: 1662258865552,
      transactions: [
        {
          amount: 12.5,
          sender: '00',
          recipient: 'fffb6b863ad14aef883ceb0f9c560d28',
          transactionId: '6e9112cd46d04426833050d2bd545fe4',
        },
      ],
      nonce: 36847,
      hash: '00008da39bb7c2e700e269de0dd9c2d101e9e8f46f1d317a6b35bd95ba84feb2',
      previousBlockHash:
        '0000f3ade70e82d4a5df2aef91bc0658371ddc47274c1b9988c476c0d1a75021',
    },
    {
      index: 5,
      timestamp: 1662258897182,
      transactions: [
        {
          amount: 12.5,
          sender: '00',
          recipient: 'fffb6b863ad14aef883ceb0f9c560d28',
          transactionId: '20e3281bf84d463ebe0ef635080a068a',
        },
      ],
      nonce: 101004,
      hash: '0000daed286fb794659942e687b86f8dd0173c9c5b313738d12f4cb953f6ffea',
      previousBlockHash:
        '00008da39bb7c2e700e269de0dd9c2d101e9e8f46f1d317a6b35bd95ba84feb2',
    },
  ],
  pendingTransactions: [
    {
      amount: 12.5,
      sender: '00',
      recipient: 'fffb6b863ad14aef883ceb0f9c560d28',
      transactionId: '97b98a1816434631a253de50c0f0e2b4',
    },
  ],
  currentNodeUrl: 'http://localhost:3001',
  networkNodes: [],
};
console.log('VALID', bitcoin.chainIsValid(bc1.chain));
