import db from '../db.js';

// Submit a new inspection evaluation
export const createEvaluation = async (req, res) => {
  try {
    const { est_id, score, penalty_type, audit_log } = req.body;
    const team_id = req.user.id; // From authMiddleware

    // 1. Insert the evaluation record
    const result = await db.query(
      `INSERT INTO evaluations (est_id, team_id, score, penalty_type, audit_log) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [est_id, team_id, score, penalty_type, JSON.stringify(audit_log || [])]
    );

    // 2. Automatically update the establishment's last score
    await db.query(
      `UPDATE establishments SET last_eval_score = $1 WHERE est_id = $2`,
      [score, est_id]
    );

    res.status(201).json({ status: 'success', message: 'تم إرسال وحفظ التقييم بنجاح', data: result.rows[0] });
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    res.status(500).json({ status: 'error', message: 'حدث خطأ أثناء حفظ الكشف' });
  }
};

// Get evaluation history for a specific establishment
export const getEstablishmentEvaluations = async (req, res) => {
  try {
    const { est_id } = req.params;

    const result = await db.query(
      `SELECT e.*, u.full_name as team_name 
       FROM evaluations e
       JOIN users u ON e.team_id = u.user_id
       WHERE e.est_id = $1 
       ORDER BY e.created_at DESC`,
      [est_id]
    );

    res.status(200).json({ status: 'success', data: result.rows });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ status: 'error', message: 'خطأ في جلب سجل التقييمات' });
  }
};
