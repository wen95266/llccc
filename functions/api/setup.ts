
import { Env } from '../types';

type PagesFunction<T = unknown> = (context: {
  request: Request;
  env: T;
  params: any;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: any;
}) => Response | Promise<Response>;

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  
  // 定义 SQL 语句
  const sql = `
    DROP TABLE IF EXISTS lottery_records;
    CREATE TABLE lottery_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lottery_type TEXT NOT NULL,
      expect TEXT NOT NULL,
      open_code TEXT NOT NULL,
      open_time TEXT,
      wave TEXT,
      zodiac TEXT,
      UNIQUE(lottery_type, expect)
    );

    DROP TABLE IF EXISTS predictions;
    CREATE TABLE predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lottery_type TEXT NOT NULL,
      target_expect TEXT NOT NULL,
      prediction_numbers TEXT,
      created_at INTEGER,
      UNIQUE(lottery_type, target_expect)
    );
  `;

  try {
    // 使用 exec 执行多条语句 (D1 API 支持)
    await env.DB.exec(sql);
    
    return new Response("✅ 数据库初始化成功！表结构已创建。", {
      headers: { "content-type": "text/plain;charset=UTF-8" }
    });
  } catch (e: any) {
    return new Response(`❌ 初始化失败: ${e.message}`, {
      status: 500,
      headers: { "content-type": "text/plain;charset=UTF-8" }
    });
  }
};
