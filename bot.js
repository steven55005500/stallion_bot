require('dotenv').config();
const { ethers } = require('ethers');
const { Telegraf } = require('telegraf');

const { BOT_TOKEN, CONTRACT_ADDRESS, CHANNEL_ID, RPC_URL } = process.env;

// STN Token Address (Site wala price yahan se aayega)
const STN_TOKEN = "0x94Abf62b41f815448eEDBE9eC10f10576D9D6004";

const bot = new Telegraf(BOT_TOKEN);
const provider = new ethers.JsonRpcProvider(RPC_URL);

const ABI = [
    "event Bought(uint256 tdate, address indexed user, address indexed token, uint256 usdtIn, uint256 tokenOut, uint256 price)",
    "event Sold(uint256 tdate, address indexed user, address indexed token, uint256 tokenIn, uint256 usdtOut, uint256 price)",
    "function getTokenFullData(address token) external view returns (address tokenAddress, string memory name, string memory symbol, uint256 price, int256 lastPrice, uint256 tokenLiquidity, uint256 usdtLiquidity, uint256 minted, uint256 sold, uint256 uniqueTraders, uint256 totalRegUsers, bool isTActive)",
    "function getBurnToken(address token) external view returns (uint256 burntokens, uint256 buyuserPer, uint256 selluserPer, uint256 refAmt)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

const f18 = (val) => val ? parseFloat(ethers.formatUnits(val, 18)).toFixed(4) : "0.0000";
const f6 = (val) => val ? parseFloat(ethers.formatUnits(val, 6)).toFixed(2) : "0.00";

async function sendAlert(type, data) {
    try {
        // Fresh data fetch kar rahe hain STN token address use karke
        const fullData = await contract.getTokenFullData(STN_TOKEN);
        const burnData = await contract.getBurnToken(STN_TOKEN);

        const isBuy = type === 'BUY';
        const emoji = isBuy ? '🚀' : '🔻';
        const symbol = "STN"; // Fixed symbol as per your token
        
        let message = `${emoji} **STALLION ${type} ALERT** ${emoji}\n`;
        message += `━━━━━━━━━━━━━━━━━━\n\n`;
        
        // --- PRICE SECTION ---
        message += `📈 **Current Price:** ${f18(fullData.price)} USDT\n\n`;
        
        if (isBuy) {
            message += `💰 **Spent:** ${f6(data.usdtIn)} USDT\n`;
            message += `🪙 **Received:** ${f18(data.tokenOut)} ${symbol}\n`;
        } else {
            message += `🪙 **Sold:** ${f18(data.tokenIn)} ${symbol}\n`;
            message += `💰 **Received:** ${f6(data.usdtOut)} USDT\n`;
        }

        message += `━━━━━━━━━━━━━━━━━━\n`;
        message += `💎 **Total Minted:** ${f18(fullData.minted)} ${symbol}\n`;
        message += `🔥 **Total Burned:** ${f18(burnData.burntokens)} ${symbol}\n`;
        message += `💧 **Liquidity Pool:** ${f6(fullData.usdtLiquidity)} USDT\n`;
        message += `👥 **Holders:** ${fullData.uniqueTraders.toString()}\n\n`;
        
        message += `👤 **User:** \`${data.user.substring(0,6)}...${data.user.substring(38)}\`\n`;
        message += `🔗 [View Transaction](https://polygonscan.com/tx/${data.txHash})`;

        await bot.telegram.sendMessage(CHANNEL_ID, message, { 
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [[{ text: "🌐 Visit Website", url: "https://stallion.exchange" }]]
            }
        });
        console.log(`✅ ${type} alert sent with STN Live Price!`);
    } catch (err) { 
        console.log(`❌ Alert Error (${type}):`, err.message);
        const simpleMsg = `🚨 **STALLION ${type} DETECTED!**\n\nCheck on PolygonScan: [Click Here](https://polygonscan.com/tx/${data.txHash})`;
        await bot.telegram.sendMessage(CHANNEL_ID, simpleMsg, { parse_mode: 'Markdown' });
    }
}

async function startBot() {
    try {
        console.log("--- STALLION PRO BOT STARTUP (STN PRICE MODE) ---");
        const block = await provider.getBlockNumber();
        console.log("🟢 RPC Connected! Block:", block);

        await bot.telegram.sendMessage(CHANNEL_ID, "🤖 **Stallion Monitoring System Online!**\nTracking STN Live Price...");
        
        let lastBlock = block - 5; 

        setInterval(async () => {
            try {
                const currentBlock = await provider.getBlockNumber();
                if (currentBlock > lastBlock) {
                    console.log(`🔎 Scanning: ${lastBlock + 1} to ${currentBlock}`);
                    
                    const buyEvents = await contract.queryFilter("Bought", lastBlock + 1, currentBlock);
                    for (let event of buyEvents) {
                        const args = event.args;
                        await sendAlert('BUY', { 
                            user: args.user, 
                            token: args.token, 
                            usdtIn: args.usdtIn, 
                            tokenOut: args.tokenOut, 
                            price: args.price, 
                            txHash: event.transactionHash 
                        });
                    }

                    const sellEvents = await contract.queryFilter("Sold", lastBlock + 1, currentBlock);
                    for (let event of sellEvents) {
                        const args = event.args;
                        await sendAlert('SELL', { 
                            user: args.user, 
                            token: args.token, 
                            tokenIn: args.tokenIn, 
                            usdtOut: args.usdtOut, 
                            price: args.price, 
                            txHash: event.transactionHash 
                        });
                    }
                    lastBlock = currentBlock;
                }
            } catch (err) { 
                console.log("❌ Loop Error:", err.message);
            }
        }, 12000); 

    } catch (error) {
        console.log("❌ CRITICAL STARTUP ERROR:", error.message);
    }
}

startBot();