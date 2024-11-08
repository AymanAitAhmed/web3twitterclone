// Initialize Web3
const { Web3 } = require('web3');
const web3 = new Web3('http://127.0.0.1:8545');
let contract;
const contractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "msgId", "type": "uint256" },
            { "indexed": false, "internalType": "string", "name": "content", "type": "string" },
            { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "timeStamp", "type": "uint256" }
        ],
        "name": "PostCreated",
        "type": "event"
    },
    {
        "inputs": [{ "internalType": "string", "name": "content", "type": "string" }],
        "name": "publishPost",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "msgId", "type": "uint256" }],
        "name": "getPost",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" },
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalPosts",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

// Sample account
const privateKey = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const account = {};

// Initialize Web3 and the contract
function initializeWeb3() {
	alert('init')
	try{
    account.address = web3.eth.accounts.privateKeyToAccount(privateKey).address;
    web3.eth.accounts.wallet.add(privateKey);
    contract = new web3.eth.Contract(contractABI, contractAddress);
	}
	catch(error){
		console.error(error)
	}
}

// Function to publish a tweet
async function publishTweet() {
	alert('clicked')
    const content = document.getElementById('tweetContent').value;
    if (!content) {
        alert("Tweet content cannot be empty!");
        return;
    }
    try {
        await contract.methods.publishPost(content).send({
            from: account.address,
            gas: 2000000
        });
        alert("Tweet published!");
        document.getElementById('tweetContent').value = '';
    } catch (error) {
        console.error("Error publishing tweet:", error);
        alert("Error publishing tweet. Check console for details.");
    }
}

// Function to retrieve all tweets
async function getAllTweets() {
	alert("clicked")
    try {
        const totalPosts = await contract.methods.getTotalPosts().call();
        const tweetsContainer = document.getElementById('tweets');
        tweetsContainer.innerHTML = '';  // Clear previous tweets

        for (let i = 0; i < totalPosts; i++) {
            const post = await contract.methods.getPost(i).call();
            const tweetElement = document.createElement('div');
            tweetElement.innerHTML = `<p><strong>${post[1]}</strong>: ${post[0]}</p>`;
            tweetsContainer.appendChild(tweetElement);
        }
    } catch (error) {
        console.error("Error retrieving tweets:", error);
        alert("Error retrieving tweets. Check console for details.");
    }
}

// Initialize the app and set up event listeners
function initializeApp() {
    initializeWeb3();
    document.getElementById('publishTweetButton').onclick = publishTweet;
    document.getElementById('viewTweetsButton').onclick = getAllTweets;
}

// Run the initializeApp function after the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
