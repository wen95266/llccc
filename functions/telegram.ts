// File: functions/telegram.ts
import { Env, LotteryType } from './types';
import { PredictionEngine } from './lib/prediction';

type PagesFunction<T = unknown> = (context: {
  request: Request;
  env: T;
  params: any;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: any;
}) => Response | Promise<Response>;

// --- 辅助逻辑：映射表 ---
const ZODIACS_MAP: Record<number, string> = {};
const WAVES_MAP: Record<number, string> = {};

const initMaps = () => {
  const zodiacs = {
    '蛇': [1, 13, 25, 37, 49], '马': [12, 24, 36, 48], '羊': [11, 23, 35, 47],
    '猴': [10, 22, 34, 46], '鸡': [9, 21, 33, 45], '狗': [8, 20, 32, 44],
    '猪': [7, 19, 31, 43], '鼠': [6, 18, 30, 42], '牛': [5, 17, 29, 41],
    '虎': [4, 16, 28, 40], '兔': [3, 15, 27, 39], '龙': [2, 14, 26, 38]
  };
  for (const [z, nums] of Object.entries(zodiacs)) {
    nums.forEach(n => ZODIACS_MAP[n] = z);
  }
  const waves = {
    'red': [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
    'blue': [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
    'green': [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]
  };
  for (const [w, nums] of Object.entries(waves)) {
    nums.forEach(n => WAVES_MAP[n] = w);
  }
};
initMaps();

const getZodiac = (n: number) => ZODIACS_MAP[n] || '';
const getWave = (n: number) => WAVES_MAP[n] || 'red';

// --- GET 请求: 用于浏览器诊断 ---
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const status = {
     status: "Active",
     message: "Telegram Bot Function is running.",
     env_check: {
        TELEGRAM_TOKEN: env.TELEGRAM_TOKEN ? "✅ Configured" : "❌ Missing",
        ADMIN_CHAT_ID: env.ADMIN_CHAT_ID ? "✅ Configured" : "❌ Missing",
        DB: env.DB ? "✅ Connected" : "❌ Missing",
     },
     timestamp: new Date().toISOString()
  };
  return new Response(JSON.stringify(status, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
};

// --- POST 请求: 处理 Telegram Webhook ---
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    // 检查 Token 是否配置
    if (!env.TELEGRAM_TOKEN) {
      console.error("TELEGRAM_TOKEN is missing");
      return new Response("Configuration Error", { status: 500 });
    }

    const body: any = await request.json();
    
    // 忽略非消息更新
    if (!body.message) return new Response('OK');

    const chatId = body.message.chat.id;
    const text = body.message.text || '';
    
    const args = text.trim().split(/\s+/);
    const command = args[0];
    const rawType = args[1]?.toUpperCase();

    // 1. 优先处理 /start 和 /id (无需权限)
    if (command === '/start' || command === '/id') {
      const isAdmin = String(chatId) === String(env.ADMIN_CHAT_ID);
      let msg = `👋 <b>Lottery Bot Online</b>\n\n`;
      msg += `🆔 Your ID: <code>${chatId}</code>\n`;
      msg += `⚙️ System Status: ${isAdmin ? '✅ Admin' : '⚠️ Guest'}`;
      
      if (isAdmin) {
        msg += `\n\n发送 /menu 打开菜单`;
        const keyboard = {
            keyboard: [
              [{ text: "/sync HK" }, { text: "/sync NEW" }, { text: "/sync OLD" }, { text: "/sync 2230" }],
              [{ text: "/predict HK" }, { text: "/predict NEW" }, { text: "/predict OLD" }, { text: "/predict 2230" }],
              [{ text: "/list HK" }, { text: "/list NEW" }, { text: "/list OLD" }, { text: "/list 2230" }],
              [{ text: "/help" }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        };
        await sendMessage(env.TELEGRAM_TOKEN, chatId, msg, { parse_mode: 'HTML', reply_markup: keyboard });
      } else {
        msg += `\n\n请在后台配置 ADMIN_CHAT_ID 为此 ID 以使用管理功能。`;
        await sendMessage(env.TELEGRAM_TOKEN, chatId, msg, { parse_mode: 'HTML' });
      }
      return new Response('OK');
    }

    // 2. 权限校验 (针对其他命令)
    if (String(chatId) !== String(env.ADMIN_CHAT_ID)) {
      // 可选：回复未授权提示
      // await sendMessage(env.TELEGRAM_TOKEN, chatId, "🚫 Unauthorized");
      return new Response('OK'); // 返回 OK 避免 Telegram 重试
    }

    // 3. 解析彩种
    const resolveType = (t: string): LotteryType | null => {
      if (!t) return null;
      if (['HK', '香港'].includes(t)) return LotteryType.HK;
      if (['NEW', 'MO_NEW', '新澳'].includes(t)) return LotteryType.MO_NEW;
      if (['OLD', 'MO_OLD', '老澳'].includes(t)) return LotteryType.MO_OLD;
      if (['2230', 'MO_OLD_2230'].includes(t)) return LotteryType.MO_OLD_2230;
      return null;
    };

    const targetType = resolveType(rawType);

    // 4. 业务逻辑
    if (command === '/menu' || command === '/help') {
      const keyboard = {
        keyboard: [
          [{ text: "/sync HK" }, { text: "/sync NEW" }, { text: "/sync OLD" }, { text: "/sync 2230" }],
          [{ text: "/predict HK" }, { text: "/predict NEW" }, { text: "/predict OLD" }, { text: "/predict 2230" }],
          [{ text: "/list HK" }, { text: "/list NEW" }, { text: "/list OLD" }, { text: "/list 2230" }],
          [{ text: "/help" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      };
      await sendMessage(env.TELEGRAM_TOKEN, chatId, "🎮 <b>控制台</b>", { parse_mode: 'HTML', reply_markup: keyboard });
    }

    else if (command === '/sync') {
      if (!targetType) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, "⚠️ 格式: /sync [Type]");
        return new Response('OK');
      }
      await sendMessage(env.TELEGRAM_TOKEN, chatId, `🔄 同步 ${targetType}...`);
      try {
        const count = await syncData(env, targetType);
        await sendMessage(env.TELEGRAM_TOKEN, chatId, `✅ 成功同步 ${count} 条`);
      } catch (e: any) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, `❌ 失败: ${e.message}`);
      }
    }

    else if (command === '/predict') {
      if (!targetType) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, "⚠️ 格式: /predict [Type]");
        return new Response('OK');
      }
      await sendMessage(env.TELEGRAM_TOKEN, chatId, `🔮 分析 ${targetType}...`);
      const { results } = await env.DB.prepare(
        "SELECT * FROM lottery_records WHERE lottery_type = ? ORDER BY expect DESC LIMIT 50"
      ).bind(targetType).all();

      if (!results || results.length === 0) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, `❌ 无数据，请先 /sync`);
        return new Response('OK');
      }

      const predictionData = PredictionEngine.generate(results as any[], targetType);
      const lastExpect = (results[0] as any).expect;
      const nextExpect = String(BigInt(lastExpect) + 1n);
      
      await env.DB.prepare(
        `INSERT OR REPLACE INTO predictions (lottery_type, target_expect, prediction_numbers, created_at) VALUES (?, ?, ?, ?)`
      ).bind(targetType, nextExpect, JSON.stringify(predictionData), Date.now()).run();

      const waveName = (w: string) => w === 'red' ? '红' : w === 'blue' ? '蓝' : '绿';
      const msg = `✅ <b>第 ${nextExpect} 期预测</b>\n` +
                  `🐹 六肖: ${predictionData.zodiacs.join(' ')}\n` +
                  `🌊 波色: ${waveName(predictionData.wave.main)} / ${waveName(predictionData.wave.defense)}\n` +
                  `🔢 18码: ${predictionData.numbers.join(',')}`;

      await sendMessage(env.TELEGRAM_TOKEN, chatId, msg, { parse_mode: 'HTML' });
    }

    else if (command === '/list') {
      if (!targetType) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, "⚠️ 格式: /list [Type]");
        return new Response('OK');
      }
      const { results } = await env.DB.prepare(
        "SELECT expect, open_code, open_time FROM lottery_records WHERE lottery_type = ? ORDER BY expect DESC LIMIT 10"
      ).bind(targetType).all();

      let msg = `📂 <b>${targetType} 近10期:</b>\n`;
      results.forEach((r: any) => msg += `#${r.expect}: ${r.open_code}\n`);
      await sendMessage(env.TELEGRAM_TOKEN, chatId, msg, { parse_mode: 'HTML' });
    }

    else if (command === '/del') {
      if (!args[2]) { await sendMessage(env.TELEGRAM_TOKEN, chatId, "Need expect"); return new Response('OK'); }
      await env.DB.prepare("DELETE FROM lottery_records WHERE lottery_type = ? AND expect = ?").bind(targetType, args[2]).run();
      await sendMessage(env.TELEGRAM_TOKEN, chatId, `🗑 Deleted #${args[2]}`);
    }

    else if (command === '/add') {
      // 简化 Add 逻辑，同上
      if (!args[3]) { await sendMessage(env.TELEGRAM_TOKEN, chatId, "Need data"); return new Response('OK'); }
      // ... 简略实现 ...
      await sendMessage(env.TELEGRAM_TOKEN, chatId, "暂不支持手动添加 (代码简化)"); 
    }
    
    else {
      await sendMessage(env.TELEGRAM_TOKEN, chatId, "❓ 未知命令 /menu");
    }

    return new Response('OK');

  } catch (err: any) {
    console.error("Worker Error:", err);
    // 即使出错也返回 200，防止 TG 无限重试
    return new Response(`Error handled: ${err.message}`, { status: 200 }); 
  }
};

// --- 通用发送消息函数 ---
async function sendMessage(token: string, chatId: number, text: string, options: any = {}) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = { chat_id: chatId, text, ...options };
  
  try {
    const resp = await fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(body) 
    });
    
    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Telegram API Failed:', errText);
      // 不要抛出错误，否则会触发 catch 块返回 Response，
      // 这里只需记录日志
    }
  } catch (e) {
    console.error('Fetch Error:', e);
  }
}

async function syncData(env: Env, type: LotteryType): Promise<number> {
  // ... 同步逻辑保持不变 ...
  let apiUrl = '';
  switch (type) {
    case LotteryType.HK: apiUrl = env.URL_HK; break;
    case LotteryType.MO_NEW: apiUrl = env.URL_MO_NEW; break;
    case LotteryType.MO_OLD: apiUrl = env.URL_MO_OLD; break;
    case LotteryType.MO_OLD_2230: apiUrl = env.URL_MO_OLD_2230; break;
  }
  if (!apiUrl) throw new Error(`URL Not Set`);
  
  const resp = await fetch(apiUrl);
  if (!resp.ok) throw new Error(`API Error ${resp.status}`);
  const json: any = await resp.json();
  const list = json.data || json; 
  if (!Array.isArray(list)) return 0;
  const records = list.slice(0, 10);
  
  const stmt = env.DB.prepare(`
    INSERT OR IGNORE INTO lottery_records (lottery_type, expect, open_code, open_time, wave, zodiac)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const batch = [];
  for (const item of records) {
    if(!item.expect) continue;
    batch.push(stmt.bind(type, item.expect, item.openCode, item.openTime||'', item.wave||'', item.zodiac||''));
  }
  if (batch.length > 0) {
    const res = await env.DB.batch(batch);
    if(Array.isArray(res)) return res.reduce((a,b:any)=>a+(b.meta?.changes||0),0);
    return (res as any).meta?.changes || 0;
  }
  return 0;
}
