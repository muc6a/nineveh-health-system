import db from '../db.js';

// Issue a new closure or fine
export const issueClosure = async (req, res) => {
  try {
    const { est_id, duration_days, start_date, end_date, closure_photo, tracker_id } = req.body;

    const result = await db.query(
      `INSERT INTO closures (est_id, duration_days, start_date, end_date, closure_photo, tracker_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [est_id, duration_days, start_date, end_date, closure_photo, tracker_id]
    );

    // Also update establishment status to closed
    await db.query(`UPDATE establishments SET status = 'closed' WHERE est_id = $1`, [est_id]);

    res.status(201).json({ status: 'success', message: 'تم إصدار وتوثيق الإغلاق بنجاح', data: result.rows[0] });
  } catch (error) {
    console.error('Error issuing closure:', error);
    res.status(500).json({ status: 'error', message: 'خطأ في إصدار الإغلاق' });
  }
};

// Get all closures (for trackers to monitor)
export const getActiveClosures = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, e.est_name, e.district_id, u.full_name as tracker_name 
       FROM closures c
       JOIN establishments e ON c.est_id = e.est_id
       LEFT JOIN users u ON c.tracker_id = u.user_id
       WHERE c.is_breached = false AND c.end_date >= CURRENT_DATE
       ORDER BY c.created_at DESC`
    );

    res.status(200).json({ status: 'success', data: result.rows });
  } catch (error) {
    console.error('Error fetching closures:', error);
    res.status(500).json({ status: 'error', message: 'خطأ في جلب بيانات الإغلاقات' });
  }
};

// Report a breach of closure
export const reportBreach = async (req, res) => {
  try {
    const { id } = req.params;
    const { breach_photo } = req.body;

    const result = await db.query(
      `UPDATE closures 
       SET is_breached = true, breach_photo = $1, updated_at = NOW() 
       WHERE closure_id = $2 RETURNING *`,
      [breach_photo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'لم يتم العثور على الإغلاق' });
    }

    res.status(200).json({ status: 'success', message: 'تم الإبلاغ عن كسر التشميع وسيتم اتخاذ الإجراء القانوني', data: result.rows[0] });
  } catch (error) {
    console.error('Error reporting breach:', error);
    res.status(500).json({ status: 'error', message: 'خطأ في توثيق كسر التشميع' });
  }
};
