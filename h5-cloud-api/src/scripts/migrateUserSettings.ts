import Database from '../utils/db'
import { User } from '../types/user'
import { RowDataPacket } from 'mysql2'

async function migrateUserSettings() {
  const db = await Database.getInstance()
  
  try {
    // 获取所有没有设置数据的用户
    const [rows] = await db.execute<(User & RowDataPacket)[]>(
      `SELECT u.* FROM users u 
       LEFT JOIN user_settings us ON u.id = us.user_id 
       WHERE us.id IS NULL`
    )
    
    // 为每个用户创建设置数据
    for (const user of rows) {
      await db.execute(
        'INSERT INTO user_settings (user_id) VALUES (?)',
        [user.id]
      )
      console.log(`Created settings for user ${user.id}`)
    }
    
    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await db.end()
  }
}

migrateUserSettings() 