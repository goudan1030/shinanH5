import Database from '../utils/db'

async function migrate() {
  let connection;
  try {
    const db = await Database.getInstance()
    connection = await db.getConnection()

    console.log('Starting migration...')

    // 检查数据库名称
    const [dbResult] = await connection.query('SELECT DATABASE() as db')
    console.log('Current database:', dbResult)

    // 检查所有表
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `)
    console.log('All tables:', tables)

    // 删除并重新创建 user_settings 表
    console.log('Dropping user_settings table...')
    await connection.query('DROP TABLE IF EXISTS user_settings')
    
    console.log('Creating user_settings table...')
    await connection.query(`
      CREATE TABLE user_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        username VARCHAR(50),
        password VARCHAR(100),
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // 检查表结构
    console.log('Checking user_settings table structure...')
    const [columns] = await connection.query('SHOW COLUMNS FROM user_settings')
    console.log('user_settings columns:', JSON.stringify(columns, null, 2))

    // 检查 users 表结构
    console.log('Checking users table structure...')
    const [userColumns] = await connection.query('SHOW COLUMNS FROM users')
    console.log('users columns:', JSON.stringify(userColumns, null, 2))

    // 为现有用户创建设置记录
    console.log('Creating settings for existing users...')
    const [users] = await connection.query('SELECT id FROM users')
    console.log('Found users:', users)

    if (Array.isArray(users) && users.length > 0) {
      await connection.query(`
        INSERT INTO user_settings (user_id)
        SELECT id FROM users
      `)
    }

    // 检查数据
    const [count] = await connection.query('SELECT COUNT(*) as count FROM user_settings')
    console.log('Number of records in user_settings:', count)

    // 检查一条记录的内容
    const [sampleRecord] = await connection.query('SELECT * FROM user_settings LIMIT 1')
    console.log('Sample user_settings record:', JSON.stringify(sampleRecord, null, 2))
    
    // 添加执行迁移脚本的代码
    console.log('Updating verification_codes table...')
    await connection.query(`
      USE ${process.env.DB_NAME};  -- 使用环境变量中的数据库名称
      
      ALTER TABLE verification_codes 
      MODIFY COLUMN type ENUM('LOGIN', 'REGISTER', 'RESET_PASSWORD') NOT NULL DEFAULT 'LOGIN'
    `)

    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      })
    }
    throw error
  } finally {
    if (connection) {
      connection.release()
    }
    process.exit()
  }
}

migrate() 