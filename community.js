require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

// --- SETUP ---
const bot = new Telegraf(process.env.MANAGER_BOT_TOKEN);

// --- 🔗 CONFIGURATION ---
const CONFIG = {
    website: "https://stallion.exchange",
    register: "https://www.stallion.exchange/index.html?0x54a66bee60a647d4390ad86dcce2c2bbeeef4c82", // Referral Link
    
    // 📂 PDF DOCUMENTS
    whitepaper: "https://stallion.exchange/assets/indexpdf/STALLIONEXCHANGEWhitePaper.pdf",
    audit: "https://stallion.exchange/assets/indexpdf/auditreport.pdf",
    roadmapPdf: "https://stallion.exchange/assets/indexpdf/Roadmapstallionexchange.pdf",
    faqPdf: "https://stallion.exchange/assets/indexpdf/StallionExchangeFAQs.pdf",

    // 📢 SOCIALS
    channel: "@Stallion_Exchange",
    support: "@Stallion_Community_Manager_bot",
    video: "https://youtube.com/shorts/Z97xhOvQhmg?si=0uCFqYZsL4vXgm8i",
    instagram: "https://www.instagram.com/stallion_exchange_official" // 📸 REPLACE THIS WITH YOUR REAL LINK
};

// --- 🎨 HELPER: Standard Back Button ---
const backButton = Markup.inlineKeyboard([
    [Markup.button.callback('🔙 Back to Main Menu', 'SHOW_MENU')]
]);

// --- 1. SMART START COMMAND (Handles Channel Deep Links) ---
bot.start((ctx) => {
    const payload = ctx.payload; // Checks if user clicked a specific button in Channel

    // 🚀 LOGIC: Route user directly to the requested section
    if (payload === 'about') return showAbout(ctx);
    if (payload === 'buy') return showBuy(ctx);
    if (payload === 'register') return showRegister(ctx);
    if (payload === 'paper') return showPaper(ctx);
    if (payload === 'menu') return sendMenu(ctx);

    // Normal Welcome Message (If user joins manually)
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
        // 📸 Added Instagram Button Here
        [Markup.button.url('📸 Follow Instagram', CONFIG.instagram), Markup.button.url('🌐 Visit Website', CONFIG.website)]
    ]);

    if (ctx.callbackQuery) {
        ctx.editMessageText(menuText, { parse_mode: 'Markdown', ...menuButtons }).catch(() => {});
    } else {
        ctx.replyWithMarkdown(menuText, menuButtons);
    }
};

bot.command('menu', (ctx) => sendMenu(ctx));
bot.action('SHOW_MENU', (ctx) => sendMenu(ctx));

// --- 3. CONTENT FUNCTIONS (Reusable Logic) ---

// 🔹 ABOUT
const showAbout = (ctx) => {
    const text = `
ℹ️ **ABOUT THE PROJECT**
━━━━━━━━━━━━━━━━━━━━━
**Stallion Exchange** is a revolutionary decentralized protocol built on the **Polygon Network**.

⚙️ **Core Mechanism:**
🔹 **Minting:** When you BUY, new tokens are created.
🔹 **Burning:** When you SELL, tokens are destroyed forever.
🔹 **Liquidity:** Every transaction automatically increases the pool.

💡 *Fair System: No manual price manipulation.*
💎 **Entry:** Minimum Buy is only **$1**
    `;
    if(ctx.callbackQuery) ctx.editMessageText(text, { parse_mode: 'Markdown', ...backButton }).catch(() => {});
    else ctx.replyWithMarkdown(text, backButton);
};

// 🔹 BUY
const showBuy = (ctx) => {
    const text = `
💰 **HOW TO BUY TOKENS**
━━━━━━━━━━━━━━━━━━━━━
*Invest in Stallion in seconds:*

1️⃣ Open **Stallion Exchange** DApp.
2️⃣ Connect your **Polygon Wallet**.
3️⃣ Enter USDT amount (**Min $1**).
4️⃣ Click **[BUY]** Button.
5️⃣ Approve transaction in wallet.

🚀 **Result:** Tokens are minted to your wallet & Price increases!
    `;
    if(ctx.callbackQuery) ctx.editMessageText(text, { parse_mode: 'Markdown', ...backButton }).catch(() => {});
    else ctx.replyWithMarkdown(text, backButton);
};

// 🔹 REGISTER
const showRegister = (ctx) => {
    const text = `
📝 **REGISTRATION GUIDE**
━━━━━━━━━━━━━━━━━━━━━
*Follow these simple steps to join:*

1️⃣ **Install Wallet:** MetaMask or Trust Wallet.
2️⃣ **Network:** Switch to **Polygon (MATIC/POL)**.
3️⃣ **Gas Fee:** Keep $0.1 worth of POL for fees.
4️⃣ **Connect:** Open link below in wallet browser.
5️⃣ **Confirm:** Connect wallet & register.
    `;
    const regButtons = Markup.inlineKeyboard([
        [Markup.button.url('🔗 Register Now', CONFIG.register)],
        [Markup.button.url('🎥 Watch Video Guide', CONFIG.video)],
        [Markup.button.callback('🔙 Back to Menu', 'SHOW_MENU')]
    ]);
    if(ctx.callbackQuery) ctx.editMessageText(text, { parse_mode: 'Markdown', ...regButtons }).catch(() => {});
    else ctx.replyWithMarkdown(text, regButtons);
};

// 🔹 WHITEPAPER
const showPaper = (ctx) => {
    const text = `
📄 **TECHNICAL WHITEPAPER**
━━━━━━━━━━━━━━━━━━━━━
*Deep dive into the Stallion logic:*

▫️ **Smart Contract Architecture**
▫️ **Mint & Burn Algorithm**
▫️ **Liquidity Locking Mechanism**
▫️ **Sustainability Model**

👇 *Tap below to read the full document:*
    `;
    const paperButtons = Markup.inlineKeyboard([
        [Markup.button.url('📄 Download Whitepaper', CONFIG.whitepaper)],
        [Markup.button.callback('🔙 Back to Menu', 'SHOW_MENU')]
    ]);
    if(ctx.callbackQuery) ctx.editMessageText(text, { parse_mode: 'Markdown', ...paperButtons }).catch(() => {});
    else ctx.replyWithMarkdown(text, paperButtons);
};

// --- LINKING ACTIONS ---
bot.action('ABOUT', (ctx) => showAbout(ctx));
bot.action('BUY', (ctx) => showBuy(ctx));
bot.action('REGISTER', (ctx) => showRegister(ctx));
bot.action('PAPER', (ctx) => showPaper(ctx));

// Other Actions
bot.action('AUDIT', (ctx) => {
    const text = `
🛡 **SECURITY AUDIT REPORT**
━━━━━━━━━━━━━━━━━━━━━
*Transparency & Security is our priority.*

✅ **Audited Smart Contracts**
✅ **No Backdoors / Hidden functions**
✅ **Mint & Burn Logic Verified**
✅ **100% Secure Architecture**

👇 *Download the full Audit Report below:*
    `;
    const auditButtons = Markup.inlineKeyboard([
        [Markup.button.url('🛡 Download Audit PDF', CONFIG.audit)],
        [Markup.button.callback('🔙 Back to Menu', 'SHOW_MENU')]
    ]);
    ctx.editMessageText(text, { parse_mode: 'Markdown', ...auditButtons }).catch(() => {});
});

bot.action('MAP', (ctx) => {
    const text = `
🗺 **PROJECT ROADMAP**
━━━━━━━━━━━━━━━━━━━━━
📍 **PHASE 1 (Current)**
▫️ Smart Contract Deployment
▫️ Website Launch & Community Building

📍 **PHASE 2**
▫️ Influencer Marketing & Global Onboarding
▫️ CoinGecko/CMC Listing Applications

📍 **PHASE 3**
▫️ Multi-Chain Expansion & Partnerships

👇 *View detailed roadmap PDF:*
    `;
    const mapButtons = Markup.inlineKeyboard([
        [Markup.button.url('🗺 Download Roadmap PDF', CONFIG.roadmapPdf)],
        [Markup.button.callback('🔙 Back to Menu', 'SHOW_MENU')]
    ]);
    ctx.editMessageText(text, { parse_mode: 'Markdown', ...mapButtons }).catch(() => {});
});

bot.action('FAQ', (ctx) => {
    const text = `
❓ **FREQUENTLY ASKED QUESTIONS**
━━━━━━━━━━━━━━━━━━━━━
**Q: Is this centralized?**
A: No, it's 100% smart-contract based.

**Q: Who controls the price?**
A: The Market. Buy pushes price UP, Sell pushes price DOWN.

**Q: Minimum investment?**
A: You can start with just **$1**.

👇 *Download full FAQs List:*
    `;
    const faqButtons = Markup.inlineKeyboard([
        [Markup.button.url('❓ Download FAQs PDF', CONFIG.faqPdf)],
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

// --- 5. NEW MEMBER WELCOME (Group Only) ---
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
        } catch (error) {
            console.log("Welcome error:", error);
        }
    }
});

// --- 6. ADMIN COMMAND: Post to Channel ---
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

    // 🚀 BUTTONS THAT DEEP LINK TO THE BOT
    const postButtons = Markup.inlineKeyboard([
        // Row 1
        [Markup.button.url('ℹ️ About Us', `https://t.me/${botUser}?start=about`), Markup.button.url('💰 How to Buy', `https://t.me/${botUser}?start=buy`)],
        // Row 2
        [Markup.button.url('📝 Register', `https://t.me/${botUser}?start=register`), Markup.button.url('📄 Whitepaper', `https://t.me/${botUser}?start=paper`)],
        // Row 3
        [Markup.button.url('📂 Main Menu', `https://t.me/${botUser}?start=menu`), Markup.button.url('📸 Instagram', CONFIG.instagram)]
    ]);

    try {
        await ctx.telegram.sendMessage(channelUsername, postText, {
            parse_mode: 'Markdown',
            ...postButtons
        });
        ctx.reply(`✅ **Success!** User-Specific Menu posted to Channel.\n\n👉 **Next Step:** Go to the Channel and **PIN** this message.`);
    } catch (error) {
        ctx.reply(`❌ **Error:** ${error.message}`);
    }
});

// --- 8. AUTOMATIC CHANNEL ENGAGEMENT (Every 30 Mins) ---

// 📜 List of Rotating Messages (Professional English)
const AUTO_MESSAGES = [
    // Message 1: Feature Highlight
    `
💎 **DID YOU KNOW?**
━━━━━━━━━━━━━━━━
**Stallion Exchange** operates on a unique "Mint & Burn" mechanism.

✅ **Buy** = Supply Increases (Price Mints)
✅ **Sell** = Supply Decreases (Price Burns)

This system is 100% Transparent and Decentralized!
👇 **Start Trading:**
${CONFIG.website}
    `,

    // Message 2: Security Reminder
    `
🛡 **SECURITY ALERT**
━━━━━━━━━━━━━━━━
The Stallion Team will **NEVER** DM you first.

⚠️ **Beware of Fake Admins!**
If someone asks for "Funds" or "Private Keys," block them immediately.

✅ Always use Official Links:
${CONFIG.website}
    `,

    // Message 3: Community Invite + Instagram
    `
🚀 **JOIN THE REVOLUTION**
━━━━━━━━━━━━━━━━
The most advanced exchange on the Polygon Network!

Invite your friends and grow the community.
Higher Trading Volume = Stronger Liquidity! 💧

📸 **Follow us on Instagram:**
${CONFIG.instagram}

🌐 **Official Website:**
${CONFIG.website}
    `,

    // Message 4: Roadmap/Vision
    `
🗺 **OUR VISION**
━━━━━━━━━━━━━━━━
Our mission is to build a truly community-driven exchange.

🔹 No Manual Manipulation
🔹 Auto-Liquidity Locking
🔹 Fair Price for Everyone

👇 **Read our Whitepaper:**
[Tap to Download PDF](${CONFIG.whitepaper})
    `,
    
    // Message 5: Quick Action
    `
💰 **READY TO INVEST?**
━━━━━━━━━━━━━━━━
You can start with as little as **$1**!

Minimum Investment: $1 USDT
Network: Polygon (MATIC)

👇 **Buy Tokens Now:**
${CONFIG.website}
    `
];

// ⏳ Function to handle Auto-Posting
const startAutoPosting = () => {
    const intervalMinutes = 30; // ⏱️ Set Time Here (Minutes)
    
    console.log(`✅ Auto-Posting System Started! (Interval: ${intervalMinutes} mins)`);

    setInterval(async () => {
        const channelUsername = CONFIG.channel;
        
        // Randomly select one message
        const randomMsg = AUTO_MESSAGES[Math.floor(Math.random() * AUTO_MESSAGES.length)];

        try {
            await bot.telegram.sendMessage(channelUsername, randomMsg, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            });
            console.log("✅ Auto-Post sent to Channel");
        } catch (error) {
            console.log("❌ Auto-Post Error:", error.message);
        }

    }, intervalMinutes * 60 * 1000);
};

// Start Auto-Posting immediately when bot launches
startAutoPosting();

// --- 7. STARTUP LOGS ---
console.log("✅ Stallion Manager Bot is Online & Ready!");
console.log("-----------------------------------------");
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));