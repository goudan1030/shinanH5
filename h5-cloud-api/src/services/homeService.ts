import Database from '../utils/db'
import { RowDataPacket } from 'mysql2'

export interface HomeStats extends RowDataPacket {
  totalMembers: number
  activeMembers: number
  todayNewMembers: number
  monthNewMembers: number
  totalMatches: number
  todayMatches: number
  monthMatches: number
}

export const homeService = {
  // 获取首页统计数据
  async getHomeStats(): Promise<HomeStats> {
    const pool = await Database.getInstance()
    
    // 使用单个查询获取所有统计数据
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM members) as totalMembers,
        (SELECT COUNT(*) FROM members WHERE status = 'ACTIVE') as activeMembers,
        (SELECT COUNT(*) FROM members WHERE DATE(created_at) = CURDATE()) as todayNewMembers,
        (SELECT COUNT(*) FROM members WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as monthNewMembers,
        (SELECT COUNT(*) FROM member_matches) as totalMatches,
        (SELECT COUNT(*) FROM member_matches WHERE DATE(match_time) = CURDATE()) as todayMatches,
        (SELECT COUNT(*) FROM member_matches WHERE DATE(match_time) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as monthMatches
    `

    const [rows] = await pool.execute<HomeStats[]>(sql)
    return rows[0]
  },

  // 获取最新会员
  async getLatestMembers(limit: number = 5) {
    const pool = await Database.getInstance()
    
    const sql = `
      SELECT id, member_no, type, status, gender, city, created_at 
      FROM members 
      ORDER BY created_at DESC 
      LIMIT ?
    `

    const [rows] = await pool.execute(sql, [limit])
    return rows
  },

  // 获取最新匹配记录
  async getLatestMatches(limit: number = 5) {
    const pool = await Database.getInstance()
    
    const sql = `
      SELECT 
        m.id,
        m.match_no,
        m.match_time,
        mem.member_no,
        mem.gender,
        mem.city
      FROM member_matches m
      LEFT JOIN members mem ON m.member_id = mem.id
      ORDER BY m.match_time DESC
      LIMIT ?
    `

    const [rows] = await pool.execute(sql, [limit])
    return rows
  }
} 