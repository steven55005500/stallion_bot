require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

// --- SETUP ---
const bot = new Telegraf(process.env.MANAGER_BOT_TOKEN);

// Global variable to store Bot Username
let BOT_USERNAME = '';

// --- 🔗 CONFIGURATION ---
const CONFIG = {
    website: "https://stallion.exchange",
    register: "https://www.stallion.exchange/index.html?0x54a66bee60a647d4390ad86dcce2c2bbeeef4c82", 
    whitepaper: "https://stallion.exchange/assets/indexpdf/STALLIONEXCHANGEWhitePaper.pdf",
    audit: "https://stallion.exchange/assets/indexpdf/auditreport.pdf",
    roadmapPdf: "https://stallion.exchange/assets/indexpdf/Roadmapstallionexchange.pdf",
    faqPdf: "https://stallion.exchange/assets/indexpdf/StallionExchangeFAQs.pdf",
    channel: "@Stallion_Exchange",
    support: "@Stallion_Community_Manager_bot",
    video: "https://youtube.com/shorts/Z97xhOvQhmg?si=0uCFqYZsL4vXgm8i"
};

// --- 🎨 HELPER: Standard Back Button ---
const backButton = Markup.inlineKeyboard([
    [Markup.button.callback('🔙 Back to Main Menu', 'SHOW_MENU')]
]);

// --- 1. SMART START COMMAND ---
bot.start((ctx) => {
    const payload = ctx.payload;
    if (payload === 'about') return showAbout(ctx);
    if (payload === 'buy') return showBuy(ctx);
    if (payload === 'register') return showRegister(ctx);
    if (payload === 'paper') return showPaper(ctx);
    if (payload === 'menu') return sendMenu(ctx);

    const welcomeMsg = `
🚀 **STALLION EXCHANGE PROTOCOL**
━━━━━━━━━━━━━━━━━━━━━
*The First Smart-Contract Based Mint & Burn Exchange on Polygon.*

💎 **Why Stallion?**
✅ **Buy** = Token Mint (Supply Up)
✅ **Sell** = Token Burn (Supply Down)
✅ **Auto-Liquidity** on every trade
✅ **100% Decentralized** & Audited

🌍 *Choose an option below to begin:*
    `;
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('📘 Open Main Menu', 'SHOW_MENU')],
        [Markup.button.url('🌐 Visit Website', CONFIG.website), Markup.button.url('📢 Channel', `https://t.me/${CONFIG.channel.replace('@', '')}`)]
    ]);
    ctx.replyWithMarkdown(welcomeMsg, keyboard);
});

// --- 2. MAIN MENU DASHBOARD ---
const sendMenu = (ctx) => {
    const menuText = `
📘 **MAIN MENU • STALLION EXCHANGE**
━━━━━━━━━━━━━━━━━━━━━
*Select a topic to learn more:*
    `;
    const menuButtons = Markup.inlineKeyboard([
        [Markup.button.callback('ℹ️ About Us', 'ABOUT'), Markup.button.callback('💰 How to Buy', 'BUY')],
        [Markup.button.callback('📝 Register', 'REGISTER'), Markup.button.callback('📞 Support', 'SUPPORT')],
        [Markup.button.callback('📄 Whitepaper', 'PAPER'), Markup.button.callback('🛡 Audit Report', 'AUDIT')],
        [Markup.button.callback('🗺 Roadmap', 'MAP'), Markup.button.callback('❓ FAQs', 'FAQ')],
        [Markup.button.url('🌐 Visit Website', CONFIG.website)]
    ]);

    if (ctx.callbackQuery) {
        ctx.editMessageText(menuText, { parse_mode: 'Markdown', ...menuButtons }).catch(() => {});
    } else {
        ctx.replyWithMarkdown(menuText, menuButtons);
    }
};

bot.command('menu', (ctx) => sendMenu(ctx));
bot.action('SHOW_MENU', (ctx) => sendMenu(ctx));

// --- 3. CONTENT FUNCTIONS ---
const showAbout = (ctx) => {
    const text = `
ℹ️ **ABOUT THE PROJECT**
━━━━━━━━━━━━━━━━━━━━━
**Stallion Exchange** is a revolutionary decentralized protocol built on the **Polygon Network**.

⚙️ **Core Mechanism:**
🔹 **Minting:** When you BUY, new tokens are created.
🔹 **Burning:** When you SELL, tokens are destroyed forever.
🔹 **Liquidity:** Every transaction automatically increases the pool.

💎 **Entry:** Minimum Buy is only **$1**
    `;
    if(ctx.callbackQuery) ctx.editMessageText(text, { parse_mode: 'Markdown', ...backButton }).catch(() => {});
    else ctx.replyWithMarkdown(text, backButton);
};

const showBuy = (ctx) => {
    const text = `
💰 **HOW TO BUY TOKENS**
━━━━━━━━━━━━━━━━━━━━━
*Invest in Stallion in seconds:*
1️⃣ Open **Stallion Exchange** DApp.
2️⃣ Connect your **Polygon Wallet**.
3️⃣ Enter USDT amount (**Min $1**).
4️⃣ Click **[BUY]** Button.
5️⃣ Approve transaction.

🚀 **Result:** Tokens are minted to your wallet & Price increases!
    `;
    if(ctx.callbackQuery) ctx.editMessageText(text, { parse_mode: 'Markdown', ...backButton }).catch(() => {});
    else ctx.replyWithMarkdown(text, backButton);
};

const showRegister = (ctx) => {
    const text = `
📝 **REGISTRATION GUIDE**
━━━━━━━━━━━━━━━━━━━━━
*Follow these simple steps to join:*
1️⃣ **Install Wallet:** MetaMask or Trust Wallet.
2️⃣ **Network:** Switch to **Polygon (MATIC/POL)**.
3️⃣ **Gas Fee:** Keep $0.1 worth of POL for fees.
4️⃣ **Connect:** Open link below in wallet browser.
    `;
    const regButtons = Markup.inlineKeyboard([
        [Markup.button.url('🔗 Register Now', CONFIG.register)],
        [Markup.button.url('🎥 Watch Video Guide', CONFIG.video)],
        [Markup.button.callback('🔙 Back to Menu', 'SHOW_MENU')]
    ]);
    if(ctx.callbackQuery) ctx.editMessageText(text, { parse_mode: 'Markdown', ...regButtons }).catch(() => {});
    else ctx.replyWithMarkdown(text, regButtons);
};

const showPaper = (ctx) => {
    const text = `
📄 **TECHNICAL WHITEPAPER**
━━━━━━━━━━━━━━━━━━━━━
*Deep dive into the Stallion logic:*
▫️ **Smart Contract Architecture**
▫️ **Mint & Burn Algorithm**
▫️ **Sustainability Model**

👇 *Tap below to view the full document:*
    `;
    const paperButtons = Markup.inlineKeyboard([
        [Markup.button.url('📄 View Whitepaper', CONFIG.whitepaper)],
        [Markup.button.callback('🔙 Back to Menu', 'SHOW_MENU')]
    ]);
    if(ctx.callbackQuery) ctx.editMessageText(text, { parse_mode: 'Markdown', ...paperButtons }).catch(() => {});
    else ctx.replyWithMarkdown(text, paperButtons);
};

bot.action('ABOUT', (ctx) => showAbout(ctx));
bot.action('BUY', (ctx) => showBuy(ctx));
bot.action('REGISTER', (ctx) => showRegister(ctx));
bot.action('PAPER', (ctx) => showPaper(ctx));

bot.action('AUDIT', (ctx) => {
    const text = `
🛡 **SECURITY AUDIT REPORT**
━━━━━━━━━━━━━━━━━━━━━
✅ **Audited Smart Contracts**
✅ **No Backdoors / Hidden functions**
✅ **100% Secure Architecture**

👇 *View the full Audit Report below:*
    `;
    const auditButtons = Markup.inlineKeyboard([
        [Markup.button.url('🛡 View Audit Report', CONFIG.audit)],
        [Markup.button.callback('🔙 Back to Menu', 'SHOW_MENU')]
    ]);
    ctx.editMessageText(text, { parse_mode: 'Markdown', ...auditButtons }).catch(() => {});
});

bot.action('MAP', (ctx) => {
    const text = `
🗺 **PROJECT ROADMAP**
━━━━━━━━━━━━━━━━━━━━━
📍 **PHASE 1 (Current):** Smart Contract & Website
📍 **PHASE 2:** Global Marketing & Listings
📍 **PHASE 3:** Multi-Chain Expansion

👇 *View detailed roadmap:*
    `;
    const mapButtons = Markup.inlineKeyboard([
        [Markup.button.url('🗺 View Roadmap', CONFIG.roadmapPdf)],
        [Markup.button.callback('🔙 Back to Menu', 'SHOW_MENU')]
    ]);
    ctx.editMessageText(text, { parse_mode: 'Markdown', ...mapButtons }).catch(() => {});
});

bot.action('FAQ', (ctx) => {
    const text = `
❓ **FAQs**
━━━━━━━━━━━━━━━━━━━━━
**Q: Is this centralized?**
A: No, it's 100% smart-contract based.
**Q: Who controls the price?**
A: The Market. Buy pushes price UP, Sell pushes price DOWN.
**Q: Minimum investment?**
A: You can start with just **$1**.

👇 *View full FAQs List:*
    `;
    const faqButtons = Markup.inlineKeyboard([
        [Markup.button.url('❓ View FAQs', CONFIG.faqPdf)],
        [Markup.button.callback('🔙 Back to Menu', 'SHOW_MENU')]
    ]);
    ctx.editMessageText(text, { parse_mode: 'Markdown', ...faqButtons }).catch(() => {});
});

bot.action('SUPPORT', (ctx) => {
    const displayChannel = CONFIG.channel.replace(/_/g, '\\_');
    const displaySupport = CONFIG.support.replace(/_/g, '\\_');
    const text = `
📞 **CONTACT & SUPPORT**
━━━━━━━━━━━━━━━━━━━━━
📢 **Official Channel:**
${displayChannel}

💬 **24/7 Admin Support:**
${displaySupport}

⚠️ **SECURITY WARNING:**
*Admins will NEVER DM you first.*
    `;
    ctx.editMessageText(text, { parse_mode: 'Markdown', ...backButton }).catch(() => {});
});

// --- 5. NEW MEMBER WELCOME ---
bot.on('new_chat_members', async (ctx) => {
    const newMembers = ctx.message.new_chat_members;
    for (const member of newMembers) {
        if (member.id === ctx.botInfo.id) continue;
        const firstName = member.first_name || 'Member';
        const welcomeText = `
👋 **Welcome, ${firstName}!**

🚀 **Welcome to the Stallion Exchange Community!**
We are the first *Mint & Burn* exchange on the Polygon Network.

💎 **Quick Links:**
👇 Select an option below to get started:
        `;
        const welcomeButtons = Markup.inlineKeyboard([
            [Markup.button.url('🌐 Visit Website', CONFIG.website)],
            [Markup.button.url('🤖 Start Bot (Menu)', `https://t.me/${ctx.botInfo.username}`)]
        ]);
        try {
            await ctx.replyWithPhoto('https://stallion.exchange/assets/images/logo.png', {
                caption: welcomeText,
                parse_mode: 'Markdown',
                ...welcomeButtons
            });
        } catch (error) { console.log("Welcome error:", error); }
    }
});

// --- 6. ADMIN COMMAND ---
bot.command('post_channel', async (ctx) => {
    const channelUsername = CONFIG.channel; 
    const botUser = ctx.botInfo.username;
    const postText = `
🚀 **WELCOME TO STALLION EXCHANGE**
━━━━━━━━━━━━━━━━━━━━━
*The Future of Decentralized Trading on the Polygon Network.*

💎 **Protocol Features:**
🔹 **Mint & Burn:** Fair Price Mechanism
🔹 **Auto-Liquidity:** Locked on every trade
🔹 **Secure:** Fully Audited & Transparent

👇 **Use the Menu below:**
Click a button to get details privately.
    `;
    const postButtons = Markup.inlineKeyboard([
        [Markup.button.url('ℹ️ About Us', `https://t.me/${botUser}?start=about`), Markup.button.url('💰 How to Buy', `https://t.me/${botUser}?start=buy`)],
        [Markup.button.url('📝 Register', `https://t.me/${botUser}?start=register`), Markup.button.url('📄 Whitepaper', `https://t.me/${botUser}?start=paper`)],
        [Markup.button.url('📂 Main Menu', `https://t.me/${botUser}?start=menu`), Markup.button.url('🌐 Visit Website', CONFIG.website)]
    ]);
    try {
        await ctx.telegram.sendMessage(channelUsername, postText, { parse_mode: 'Markdown', ...postButtons });
        ctx.reply(`✅ **Success!** User-Specific Menu posted to Channel.`);
    } catch (error) { ctx.reply(`❌ **Error:** ${error.message}`); }
});

// --- 8. AUTOMATIC CHANNEL ENGAGEMENT (DEBUG VERSION) ---
const startAutoPosting = () => {
    const intervalMinutes = 2; // ✅ 2 Minutes for Testing
    const channelUsername = CONFIG.channel;
    const botUser = BOT_USERNAME;

    const sendRandomMessage = async () => {
        console.log("📨 Attempting to send Auto-Post..."); // DEBUG LOG
        
        const AUTO_MESSAGES_WITH_BUTTONS = [
            // 1. Feature Highlight
            {
                text: `
💎 **DID YOU KNOW?**
━━━━━━━━━━━━━━━━
**Stallion Exchange** operates on a unique "Mint & Burn" mechanism.

✅ **Buy** = Supply Increases (Price Mints)
✅ **Sell** = Supply Decreases (Price Burns)

This system is 100% Transparent and Decentralized!
👇 **Start Trading:**
                `,
                buttons: Markup.inlineKeyboard([
                    [Markup.button.url('💰 How to Buy', `https://t.me/${botUser}?start=buy`)],
                    [Markup.button.url('🌐 Visit Website', CONFIG.website)]
                ])
            },
            // 2. Community Invite
            {
                text: `
🚀 **JOIN THE REVOLUTION**
━━━━━━━━━━━━━━━━
The most advanced exchange on the Polygon Network!

Invite your friends and grow the community.
Higher Trading Volume = Stronger Liquidity! 💧

👇 **Quick Actions:**
                `,
                buttons: Markup.inlineKeyboard([
                    [Markup.button.url('📂 Open Menu', `https://t.me/${botUser}?start=menu`)],
                    [Markup.button.url('🔗 Register Now', CONFIG.register)]
                ])
            },
            // 3. Roadmap/Vision
            {
                text: `
🗺 **OUR VISION**
━━━━━━━━━━━━━━━━
Our mission is to build a truly community-driven exchange.

🔹 No Manual Manipulation
🔹 Auto-Liquidity Locking
🔹 Fair Price for Everyone

👇 **View our Plans:**
                `,
                buttons: Markup.inlineKeyboard([
                    [Markup.button.url('📄 View Whitepaper', CONFIG.whitepaper)],
                    [Markup.button.url('🗺 View Roadmap', CONFIG.roadmapPdf)]
                ])
            },
            // 4. Quick Action (Invest)
            {
                text: `
💰 **READY TO INVEST?**
━━━━━━━━━━━━━━━━
You can start with as little as **$1**!

Minimum Investment: $1 USDT
Network: Polygon (MATIC)

👇 **Get Started Now:**
                `,
                buttons: Markup.inlineKeyboard([
                    [Markup.button.url('💰 Buy Guide', `https://t.me/${botUser}?start=buy`), Markup.button.url('🌐 Buy on Website', CONFIG.website)]
                ])
            },
            // 5. 🔥 MAIN INTRO MESSAGE
            {
                text: `
🚀 **STALLION EXCHANGE PROTOCOL**
━━━━━━━━━━━━━━━━━━━━━
*The First Smart-Contract Based Mint & Burn Exchange on Polygon.*

💎 **Why Stallion?**
✅ **Buy** = Token Mint (Supply Up)
✅ **Sell** = Token Burn (Supply Down)
✅ **Auto-Liquidity** on every trade
✅ **100% Decentralized** & Audited

🌍 *Choose an option below to begin:*
                `,
                buttons: Markup.inlineKeyboard([
                    [Markup.button.url('📘 Open Main Menu', `https://t.me/${botUser}?start=menu`)],
                    [Markup.button.url('🌐 Visit Website', CONFIG.website), Markup.button.url('📢 Channel', `https://t.me/${CONFIG.channel.replace('@', '')}`)]
                ])
            }
        ];
        
        const randomItem = AUTO_MESSAGES_WITH_BUTTONS[Math.floor(Math.random() * AUTO_MESSAGES_WITH_BUTTONS.length)];

        try {
            await bot.telegram.sendMessage(channelUsername, randomItem.text, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true,
                ...randomItem.buttons
            });
            console.log("✅ Auto-Post with Buttons sent to Channel");
        } catch (error) {
            console.log("❌ Auto-Post Error:", error.message);
        }
    };

    console.log(`✅ Auto-Posting System Started! (First post sending NOW, then every ${intervalMinutes} mins)`);
    
    // 🔥 STEP 1: Send Immediately
    sendRandomMessage();

    // 🔥 STEP 2: Start Timer Loop
    setInterval(() => {
        console.log("⏰ Timer Tick: Triggering Message...");
        sendRandomMessage();
    }, intervalMinutes * 60 * 1000);

    // 🔥 STEP 3: HEARTBEAT LOG (To check if bot is alive)
    setInterval(() => {
        console.log("⏳ ... Bot is Waiting (Heartbeat) ...");
    }, 30000); 
};

// --- 7. STARTUP LOGS ---
bot.launch().then(() => {
    BOT_USERNAME = bot.botInfo.username; 
    console.log(`✅ Stallion Manager Bot is Online & Ready! (@${BOT_USERNAME})`);
    console.log("-----------------------------------------");
    startAutoPosting(); 
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));