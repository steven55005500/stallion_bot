require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

// --- 🛠️ SETUP & ANTI-CRASH ---
const bot = new Telegraf(process.env.MANAGER_BOT_TOKEN);

// Global Error Handler (Bot crash nahi hoga agar Telegram API fail ho)
bot.catch((err) => {
    console.log(`⚠️ Telegram Error (Ignored): ${err.message}`);
});

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

// --- 🎨 HELPERS ---
const backButton = Markup.inlineKeyboard([
    [Markup.button.callback('🔙 Back to Main Menu', 'SHOW_MENU')]
]);

// --- 3. CONTENT FUNCTIONS ---
const showAbout = (ctx) => {
    const text = `ℹ️ **ABOUT THE PROJECT**\n━━━━━━━━━━━━━━━━━━━━━\n**Stallion Exchange** is a revolutionary decentralized protocol built on the **Polygon Network**.\n\n⚙️ **Core Mechanism:**\n🔹 **Minting:** When you BUY, new tokens are created.\n🔹 **Burning:** When you SELL, tokens are destroyed forever.\n🔹 **Liquidity:** Every transaction automatically increases the pool.\n\n💎 **Entry:** Minimum Buy is only **$1**`;
    if(ctx.callbackQuery) ctx.editMessageText(text, { parse_mode: 'Markdown', ...backButton }).catch(() => {});
    else ctx.replyWithMarkdown(text, backButton);
};

const showBuy = (ctx) => {
    const text = `💰 **HOW TO BUY TOKENS**\n━━━━━━━━━━━━━━━━━━━━━\n*Invest in Stallion in seconds:*\n1️⃣ Open **Stallion Exchange** DApp.\n2️⃣ Connect your **Polygon Wallet**.\n3️⃣ Enter USDT amount (**Min $1**).\n4️⃣ Click **[BUY]** Button.\n5️⃣ Approve transaction.\n\n🚀 **Result:** Tokens are minted & Price increases!`;
    if(ctx.callbackQuery) ctx.editMessageText(text, { parse_mode: 'Markdown', ...backButton }).catch(() => {});
    else ctx.replyWithMarkdown(text, backButton);
};

const showRegister = (ctx) => {
    const text = `📝 **REGISTRATION GUIDE**\n━━━━━━━━━━━━━━━━━━━━━\n*Follow these simple steps to join:*\n1️⃣ **Install Wallet:** MetaMask or Trust Wallet.\n2️⃣ **Network:** Switch to **Polygon (MATIC/POL)**.\n3️⃣ **Gas Fee:** Keep $0.1 worth of POL for fees.\n4️⃣ **Connect:** Open link below in wallet browser.`;
    const regButtons = Markup.inlineKeyboard([
        [Markup.button.url('🔗 Register Now', CONFIG.register)],
        [Markup.button.url('🎥 Watch Video Guide', CONFIG.video)],
        [Markup.button.callback('🔙 Back to Menu', 'SHOW_MENU')]
    ]);
    if(ctx.callbackQuery) ctx.editMessageText(text, { parse_mode: 'Markdown', ...regButtons }).catch(() => {});
    else ctx.replyWithMarkdown(text, regButtons);
};

const showPaper = (ctx) => {
    const text = `📄 **TECHNICAL WHITEPAPER**\n━━━━━━━━━━━━━━━━━━━━━\n*Deep dive into the Stallion logic:*\n▫️ **Smart Contract Architecture**\n▫️ **Mint & Burn Algorithm**\n▫️ **Sustainability Model**\n\n👇 *Tap below to view the full document:*`;
    const paperButtons = Markup.inlineKeyboard([
        [Markup.button.url('📄 View Whitepaper', CONFIG.whitepaper)],
        [Markup.button.callback('🔙 Back to Menu', 'SHOW_MENU')]
    ]);
    if(ctx.callbackQuery) ctx.editMessageText(text, { parse_mode: 'Markdown', ...paperButtons }).catch(() => {});
    else ctx.replyWithMarkdown(text, paperButtons);
};

// --- 1. START & MENU COMMANDS ---
const sendMenu = (ctx) => {
    const menuText = `📘 **MAIN MENU • STALLION EXCHANGE**\n━━━━━━━━━━━━━━━━━━━━━\n*Select a topic to learn more:*`;
    const menuButtons = Markup.inlineKeyboard([
        [Markup.button.callback('ℹ️ About Us', 'ABOUT'), Markup.button.callback('💰 How to Buy', 'BUY')],
        [Markup.button.callback('📝 Register', 'REGISTER'), Markup.button.callback('📞 Support', 'SUPPORT')],
        [Markup.button.callback('📄 Whitepaper', 'PAPER'), Markup.button.callback('🛡 Audit Report', 'AUDIT')],
        [Markup.button.callback('🗺 Roadmap', 'MAP'), Markup.button.callback('❓ FAQs', 'FAQ')],
        [Markup.button.url('🌐 Visit Website', CONFIG.website)]
    ]);
    if (ctx.callbackQuery) ctx.editMessageText(menuText, { parse_mode: 'Markdown', ...menuButtons }).catch(() => {});
    else ctx.replyWithMarkdown(menuText, menuButtons);
};

bot.start((ctx) => {
    const payload = ctx.payload;
    if (payload === 'about') return showAbout(ctx);
    if (payload === 'buy') return showBuy(ctx);
    if (payload === 'register') return showRegister(ctx);
    if (payload === 'paper') return showPaper(ctx);
    if (payload === 'menu') return sendMenu(ctx);

    const welcomeMsg = `🚀 **STALLION EXCHANGE PROTOCOL**\n━━━━━━━━━━━━━━━━━━━━━\n*The First Smart-Contract Based Mint & Burn Exchange on Polygon.*\n\n💎 **Why Stallion?**\n✅ **Buy** = Token Mint (Supply Up)\n✅ **Sell** = Token Burn (Supply Down)\n✅ **Auto-Liquidity** on every trade\n\n🌍 *Choose an option niche:*`;
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('📘 Open Main Menu', 'SHOW_MENU')],
        [Markup.button.url('🌐 Visit Website', CONFIG.website), Markup.button.url('📢 Channel', `https://t.me/${CONFIG.channel.replace('@', '')}`)]
    ]);
    ctx.replyWithMarkdown(welcomeMsg, keyboard);
});

bot.command('menu', (ctx) => sendMenu(ctx));
bot.action('SHOW_MENU', (ctx) => sendMenu(ctx));
bot.action('ABOUT', (ctx) => showAbout(ctx));
bot.action('BUY', (ctx) => showBuy(ctx));
bot.action('REGISTER', (ctx) => showRegister(ctx));
bot.action('PAPER', (ctx) => showPaper(ctx));

bot.action('AUDIT', (ctx) => {
    const text = `🛡 **SECURITY AUDIT REPORT**\n━━━━━━━━━━━━━━━━━━━━━\n✅ **Audited Smart Contracts**\n✅ **No Backdoors / Hidden functions**\n\n👇 *View the full Audit Report below:*`;
    const auditButtons = Markup.inlineKeyboard([
        [Markup.button.url('🛡 View Audit Report', CONFIG.audit)],
        [Markup.button.callback('🔙 Back to Menu', 'SHOW_MENU')]
    ]);
    ctx.editMessageText(text, { parse_mode: 'Markdown', ...auditButtons }).catch(() => {});
});

bot.action('MAP', (ctx) => {
    const text = `🗺 **PROJECT ROADMAP**\n━━━━━━━━━━━━━━━━━━━━━\n📍 **PHASE 1 (Current):** Smart Contract & Website\n📍 **PHASE 2:** Global Marketing & Listings\n📍 **PHASE 3:** Multi-Chain Expansion`;
    const mapButtons = Markup.inlineKeyboard([
        [Markup.button.url('🗺 View Roadmap', CONFIG.roadmapPdf)],
        [Markup.button.callback('🔙 Back to Menu', 'SHOW_MENU')]
    ]);
    ctx.editMessageText(text, { parse_mode: 'Markdown', ...mapButtons }).catch(() => {});
});

bot.action('FAQ', (ctx) => {
    const text = `❓ **FAQs**\n━━━━━━━━━━━━━━━━━━━━━\n**Q: Is this centralized?**\nA: No, it's 100% smart-contract based.\n**Q: Who controls the price?**\nA: The Market.\n\n👇 *View full FAQs List:*`;
    const faqButtons = Markup.inlineKeyboard([
        [Markup.button.url('❓ View FAQs', CONFIG.faqPdf)],
        [Markup.button.callback('🔙 Back to Menu', 'SHOW_MENU')]
    ]);
    ctx.editMessageText(text, { parse_mode: 'Markdown', ...faqButtons }).catch(() => {});
});

bot.action('SUPPORT', (ctx) => {
    const text = `📞 **CONTACT & SUPPORT**\n━━━━━━━━━━━━━━━━━━━━━\n📢 **Official Channel:** ${CONFIG.channel}\n💬 **24/7 Admin Support:** ${CONFIG.support}\n\n⚠️ **SECURITY WARNING:**\n*Admins will NEVER DM you first.*`;
    ctx.editMessageText(text, { parse_mode: 'Markdown', ...backButton }).catch(() => {});
});

// --- 5. NEW MEMBER WELCOME ---
bot.on('new_chat_members', async (ctx) => {
    const newMembers = ctx.message.new_chat_members;
    for (const member of newMembers) {
        if (member.id === ctx.botInfo.id) continue;
        const firstName = member.first_name || 'Member';
        const welcomeText = `👋 **Welcome, ${firstName}!**\n\n🚀 **Welcome to the Stallion Exchange Community!**\n\n💎 **Quick Links:**\n👇 Select an option below to get started:`;
        const welcomeButtons = Markup.inlineKeyboard([
            [Markup.button.url('🌐 Website', CONFIG.website)],
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
    const botUser = ctx.botInfo.username;
    const postText = `🚀 **WELCOME TO STALLION EXCHANGE**\n━━━━━━━━━━━━━━━━━━━━━\n*The Future of Decentralized Trading on Polygon.*\n\n👇 **Use the Menu below:**\nClick a button to get details privately.`;
    const postButtons = Markup.inlineKeyboard([
        [Markup.button.url('ℹ️ About Us', `https://t.me/${botUser}?start=about`), Markup.button.url('💰 How to Buy', `https://t.me/${botUser}?start=buy`)],
        [Markup.button.url('📝 Register', `https://t.me/${botUser}?start=register`), Markup.button.url('📄 Whitepaper', `https://t.me/${botUser}?start=paper`)],
        [Markup.button.url('📂 Main Menu', `https://t.me/${botUser}?start=menu`), Markup.button.url('🌐 Visit Website', CONFIG.website)]
    ]);
    try {
        await ctx.telegram.sendMessage(CONFIG.channel, postText, { parse_mode: 'Markdown', ...postButtons });
        ctx.reply(`✅ **Success!** Intro posted to Channel.`);
    } catch (error) { ctx.reply(`❌ **Error:** ${error.message}`); }
});

// --- 8. AUTOMATIC CHANNEL ENGAGEMENT (ROTATION) ---
const startAutoPosting = async () => {
    const intervalMinutes = 30;
    const channelUsername = CONFIG.channel;

    // Har baar username fresh check karega
    if (!BOT_USERNAME) {
        const me = await bot.telegram.getMe();
        BOT_USERNAME = me.username;
    }

    const sendRandomMessage = async () => {
        const timestamp = new Date().toLocaleTimeString();
        const botUrl = `https://t.me/${BOT_USERNAME}`;

        const AUTO_MESSAGES = [
            {
                text: `💎 **DID YOU KNOW?**\n━━━━━━━━━━━━━━━━\n**Stallion Exchange** operates on a unique "Mint & Burn" mechanism.\n\n✅ **Buy** = Token Mint\n✅ **Sell** = Token Burn\n\n👇 **Start Trading:**`,
                buttons: Markup.inlineKeyboard([[Markup.button.url('💰 How to Buy', `${botUrl}?start=buy`)],[Markup.button.url('🌐 Visit Website', CONFIG.website)]])
            },
            {
                text: `🚀 **JOIN THE REVOLUTION**\n━━━━━━━━━━━━━━━━\nThe most advanced exchange on the Polygon Network!\n\nInvite your friends and grow the community.💧`,
                buttons: Markup.inlineKeyboard([[Markup.button.url('📂 Open Menu', `${botUrl}?start=menu`)],[Markup.button.url('🔗 Register Now', CONFIG.register)]])
            },
            {
                text: `🗺 **OUR VISION**\n━━━━━━━━━━━━━━━━\nOur mission is to build a truly community-driven exchange.\n\n🔹 No Manual Manipulation\n🔹 Auto-Liquidity Locking`,
                buttons: Markup.inlineKeyboard([[Markup.button.url('📄 Whitepaper', CONFIG.whitepaper)],[Markup.button.url('🗺 Roadmap', CONFIG.roadmapPdf)]])
            },
            {
                text: `💰 **READY TO INVEST?**\n━━━━━━━━━━━━━━━━\nYou can start with as little as **$1**!\n\nMinimum Investment: $1 USDT`,
                buttons: Markup.inlineKeyboard([[Markup.button.url('💰 Buy Guide', `${botUrl}?start=buy`)],[Markup.button.url('🌐 Website', CONFIG.website)]])
            }
        ];

        const randomItem = AUTO_MESSAGES[Math.floor(Math.random() * AUTO_MESSAGES.length)];

        try {
            await bot.telegram.sendMessage(channelUsername, randomItem.text, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true,
                ...randomItem.buttons
            });
            console.log(`[${timestamp}] ✅ Auto-Post SENT.`);
        } catch (error) {
            console.log(`[${timestamp}] ❌ Auto-Post FAILED:`, error.message);
        }
    };

    console.log(`✅ Auto-Posting Started! (Every ${intervalMinutes} mins)`);
    
    // 🔥 STEP 1: Pehla message turant
    sendRandomMessage();

    // 🔥 STEP 2: Interval timer
    setInterval(sendRandomMessage, intervalMinutes * 60 * 1000);

    // 🔥 STEP 3: Heartbeat log
    setInterval(() => {
        console.log(`[${new Date().toLocaleTimeString()}] ⏳ Heartbeat: Bot is alive.`);
    }, 60000); 
};

// --- 7. STARTUP ---
bot.launch().then(() => {
    console.log(`✅ Stallion Bot is Online!`);
    startAutoPosting(); 
}).catch((err) => console.log("Startup Error:", err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));