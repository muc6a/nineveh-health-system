import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_ninveh_2026';

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Check if user exists
    const result = await db.query('SELECT * FROM users WHERE username = $1 OR email = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ status: 'error', message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const user = result.rows[0];

    // 2. Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ status: 'error', message: 'هذا الحساب مجمد أو غير نشط' });
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    // 4. Generate JWT Token
    const payload = {
      id: user.user_id,
      role: user.role,
      username: user.username,
      district_ids: user.district_ids || []
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

    // 5. Send response (exclude password_hash)
    delete user.password_hash;
    
    res.status(200).json({
      status: 'success',
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ status: 'error', message: 'خطأ في الخادم' });
  }
};
