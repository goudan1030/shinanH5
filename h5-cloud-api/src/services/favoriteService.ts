import Database from '../utils/db'

export class FavoriteService {
  // 添加收藏
  async add(userId: number, targetId: number | string, targetType: string) {
    const pool = await Database.getInstance()
    await pool.execute(
      'INSERT INTO favorites (user_id, target_id, target_type) VALUES (?, ?, ?)',
      [userId, targetId, targetType]
    )
  }

  // 取消收藏
  async remove(userId: number, targetId: number | string, targetType: string) {
    const pool = await Database.getInstance()
    await pool.execute(
      'DELETE FROM favorites WHERE user_id = ? AND target_id = ? AND target_type = ?',
      [userId, targetId, targetType]
    )
  }

  // 检查是否已收藏
  async check(userId: number, targetId: number | string, targetType: string) {
    const pool = await Database.getInstance()
    const [rows] = await pool.execute<any[]>(
      'SELECT 1 FROM favorites WHERE user_id = ? AND target_id = ? AND target_type = ? LIMIT 1',
      [userId, targetId, targetType]
    )
    return rows.length > 0
  }
}

export const favoriteService = new FavoriteService() 