
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

// --- 辅助逻辑：用于手动录入时自动计算属性 ---
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

// --- 主处理逻辑 ---

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const body: any = await request.json();
    
    // 忽略非消息更新
    if (!body.message) return new Response('OK');

    const chatId = body.message.chat.id;
    const text = body.message.text || '';
    
    const args = text.trim().split(/\s+/);
    const command = args[0];
    const rawType = args[1]?.toUpperCase();

    // 1. 优先处理不需要权限的命令：/start 和 /id
    // 这样用户可以获取自己的 Chat ID 去配置环境变量
    if (command === '/start' || command === '/id') {
      const isAdmin = String(chatId) === String(env.ADMIN_CHAT_ID);
      let msg = `👋 <b>欢迎使用 Lottery Prophet Bot</b>\n\n`;
      msg += `🆔 您的 Chat ID: <code>${chatId}</code>\n`;
      
      if (isAdmin) {
        msg += `✅ <b>身份验证通过 (管理员)</b>\n\n发送 /menu 查看功能菜单。`;
        // 如果是管理员，顺便显示菜单键盘
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
        msg += `⚠️ <b>未授权访问</b>\n请将上面的 ID 填入 Cloudflare Pages 后台变量 <code>ADMIN_CHAT_ID</code> 中。`;
        await sendMessage(env.TELEGRAM_TOKEN, chatId, msg, { parse_mode: 'HTML' });
      }
      return new Response('OK');
    }

    // 2. 权限校验 (针对其他命令)
    if (String(chatId) !== String(env.ADMIN_CHAT_ID)) {
      // 未授权时不回复，避免骚扰，或者可以选择回复一条拒绝信息
      // await sendMessage(env.TELEGRAM_TOKEN, chatId, "🚫 Unauthorized");
      return new Response('Unauthorized');
    }

    // 3. 解析彩种类型
    const resolveType = (t: string): LotteryType | null => {
      if (!t) return null;
      if (['HK', '香港'].includes(t)) return LotteryType.HK;
      if (['NEW', 'MO_NEW', '新澳'].includes(t)) return LotteryType.MO_NEW;
      if (['OLD', 'MO_OLD', '老澳'].includes(t)) return LotteryType.MO_OLD;
      if (['2230', 'MO_OLD_2230'].includes(t)) return LotteryType.MO_OLD_2230;
      return null;
    };

    const targetType = resolveType(rawType);

    // 4. 业务命令处理
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
      await sendMessage(env.TELEGRAM_TOKEN, chatId, "🎮 <b>管理控制台</b>\n请选择操作：", { parse_mode: 'HTML', reply_markup: keyboard });
    }

    else if (command === '/sync') {
      if (!targetType) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, "⚠️ 格式: /sync [Type]");
        return new Response('OK');
      }
      await sendMessage(env.TELEGRAM_TOKEN, chatId, `🔄 正在同步 ${targetType} ...`);
      try {
        const count = await syncData(env, targetType);
        await sendMessage(env.TELEGRAM_TOKEN, chatId, `✅ 同步成功！新增/更新: ${count} 条`);
      } catch (e: any) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, `❌ 同步失败: ${e.message}`);
      }
    }

    else if (command === '/predict') {
      if (!targetType) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, "⚠️ 格式: /predict [Type]");
        return new Response('OK');
      }
      await sendMessage(env.TELEGRAM_TOKEN, chatId, `🔮 正在分析 ${targetType} ...`);
      const { results } = await env.DB.prepare(
        "SELECT * FROM lottery_records WHERE lottery_type = ? ORDER BY expect DESC LIMIT 50"
      ).bind(targetType).all();

      if (!results || results.length === 0) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, `❌ 无记录，请先 /sync`);
        return new Response('OK');
      }

      const predictionData = PredictionEngine.generate(results as any[], targetType);
      const lastExpect = (results[0] as any).expect;
      const nextExpect = String(BigInt(lastExpect) + 1n);
      const jsonString = JSON.stringify(predictionData);

      await env.DB.prepare(
        `INSERT OR REPLACE INTO predictions (lottery_type, target_expect, prediction_numbers, created_at) VALUES (?, ?, ?, ?)`
      ).bind(targetType, nextExpect, jsonString, Date.now()).run();

      const waveName = (w: string) => w === 'red' ? '红' : w === 'blue' ? '蓝' : '绿';
      const msg = `✅ <b>第 ${nextExpect} 期预测已发布</b>\n\n` +
                  `🐹 <b>六肖:</b> ${predictionData.zodiacs.join(' ')}\n` +
                  `🌊 <b>波色:</b> 主${waveName(predictionData.wave.main)} / 防${waveName(predictionData.wave.defense)}\n` +
                  `🔢 <b>头数:</b> ${predictionData.heads.join(', ')}\n` +
                  `🔚 <b>尾数:</b> ${predictionData.tails.join(', ')}\n` +
                  `🎱 <b>18码:</b> ${predictionData.numbers.join(',')}`;

      await sendMessage(env.TELEGRAM_TOKEN, chatId, msg, { parse_mode: 'HTML' });
    }

    else if (command === '/list' || command === '/ls') {
      if (!targetType) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, "⚠️ 格式: /list [Type]");
        return new Response('OK');
      }
      const { results } = await env.DB.prepare(
        "SELECT expect, open_code, open_time FROM lottery_records WHERE lottery_type = ? ORDER BY expect DESC LIMIT 10"
      ).bind(targetType).all();

      if (!results.length) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, `📂 ${targetType} 暂无数据。`);
      } else {
        let msg = `📂 <b>${targetType} 最近 10 期:</b>\n\n`;
        results.forEach((r: any) => {
          const timeShort = r.open_time ? r.open_time.split(' ')[0] : '';
          msg += `<code>#${r.expect}</code> [${timeShort}]\n${r.open_code}\n\n`;
        });
        await sendMessage(env.TELEGRAM_TOKEN, chatId, msg, { parse_mode: 'HTML' });
      }
    }

    else if (command === '/del' || command === '/delete') {
      const expect = args[2];
      if (!targetType || !expect) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, "⚠️ 格式: /del [Type] [期号]");
        return new Response('OK');
      }
      await env.DB.prepare("DELETE FROM lottery_records WHERE lottery_type = ? AND expect = ?")
        .bind(targetType, expect).run();
      await sendMessage(env.TELEGRAM_TOKEN, chatId, `🗑 已删除 #${expect}`);
    }

    else if (command === '/del_last') {
      if (!targetType) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, "⚠️ 格式: /del_last [Type]");
        return new Response('OK');
      }
      const last = await env.DB.prepare("SELECT expect FROM lottery_records WHERE lottery_type = ? ORDER BY expect DESC LIMIT 1").bind(targetType).first();
      if (!last) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, "❌ 无记录");
      } else {
        await env.DB.prepare("DELETE FROM lottery_records WHERE lottery_type = ? AND expect = ?").bind(targetType, last.expect).run();
        await sendMessage(env.TELEGRAM_TOKEN, chatId, `🗑 已删除最新期 #${last.expect}`);
      }
    }

    else if (command === '/add') {
      const expect = args[2];
      const codeStr = args[3];
      if (!targetType || !expect || !codeStr) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, "⚠️ 格式: /add [Type] [期号] [号码]");
        return new Response('OK');
      }
      const codes = codeStr.replace(/，/g, ',').split(',');
      if (codes.length !== 7) {
        await sendMessage(env.TELEGRAM_TOKEN, chatId, "❌ 必须7个号码");
        return new Response('OK');
      }
      const waves = codes.map(c => getWave(parseInt(c))).join(',');
      const zodiacs = codes.map(c => getZodiac(parseInt(c))).join(',');
      const nowTime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
      
      await env.DB.prepare(`
        INSERT OR REPLACE INTO lottery_records (lottery_type, expect, open_code, open_time, wave, zodiac)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(targetType, expect, codeStr, nowTime, waves, zodiacs).run();
      await sendMessage(env.TELEGRAM_TOKEN, chatId, `✅ 录入成功 #${expect}`);
    }
    
    else {
      // 未知命令
      await sendMessage(env.TELEGRAM_TOKEN, chatId, "❓ 未知命令，输入 /menu 查看菜单");
    }
    return new Response('OK');

  } catch (err: any) {
    console.error(err);
    // 只有在开发调试阶段，或者对于特定用户，才返回错误详情
    // 为了让您能看到报错，这里先强制返回错误信息给 Telegram (如果能获取到 chatId)
    // 这里的 context.request 读取过了，如果 body 读取流被消耗可能无法再次读取
    // 简单起见，我们只能在 catch 中做有限处理
    return new Response(`Error: ${err.message}`, { status: 200 }); 
  }
};

async function sendMessage(token: string, chatId: number, text: string, options: any = {}) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body: any = { chat_id: chatId, text, ...options };
  // 增加 fetch 错误处理
  const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!resp.ok) {
    const errText = await resp.text();
    console.error('Telegram API Error:', errText);
    throw new Error(`TG API Error: ${resp.status} ${errText}`);
  }
}

async function syncData(env: Env, type: LotteryType): Promise<number> {
  let apiUrl = '';
  switch (type) {
    case LotteryType.HK: apiUrl = env.URL_HK; break;
    case LotteryType.MO_NEW: apiUrl = env.URL_MO_NEW; break;
    case LotteryType.MO_OLD: apiUrl = env.URL_MO_OLD; break;
    case LotteryType.MO_OLD_2230: apiUrl = env.URL_MO_OLD_2230; break;
  }
  
  if (!apiUrl) throw new Error(`未配置 ${type} 的 URL`);
  
  const resp = await fetch(apiUrl);
  if (!resp.ok) throw new Error(`数据源 API 错误: ${resp.status}`);
  
  const json: any = await resp.json();
  const list = json.data || json; // 兼容不同的 API 格式
  
  if (!Array.isArray(list) || list.length === 0) return 0;

  const records = list.slice(0, 10); 
  const stmt = env.DB.prepare(`
    INSERT OR IGNORE INTO lottery_records (lottery_type, expect, open_code, open_time, wave, zodiac)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const batch = [];
  for (const item of records) {
    if(!item.expect || !item.openCode) continue;
    batch.push(stmt.bind(type, item.expect, item.openCode, item.openTime || new Date().toISOString(), item.wave || '', item.zodiac || ''));
  }
  if (batch.length > 0) {
    const results = await env.DB.batch(batch);
    // D1 batch 返回结果可能是数组
    if (Array.isArray(results)) {
       return results.reduce((acc: number, res: any) => acc + (res.meta?.changes || 0), 0);
    }
    return (results as any).meta?.changes || 0;
  }
  return 0;
}
