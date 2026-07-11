import db from '../db.js';

// Get all establishments (with optional district filtering)
export const getEstablishments = async (req, res) => {
  try {
    const { district_id } = req.query;
    let query = 'SELECT * FROM establishments';
    let params = [];

    if (district_id) {
      query += ' WHERE district_id = $1';
      params.push(district_id);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    res.status(200).json({ status: 'success', data: result.rows });
  } catch (error) {
    console.error('Error fetching establishments:', error);
    res.status(500).json({ status: 'error', message: 'خطأ في جلب بيانات المنشآت' });
  }
};

// Add a new establishment
export const createEstablishment = async (req, res) => {
  try {
    const { est_name, category, district_id } = req.body;

    const result = await db.query(
      `INSERT INTO establishments (est_name, category, district_id) 
       VALUES ($1, $2, $3) RETURNING *`,
      [est_name, category, district_id]
    );

    res.status(201).json({ status: 'success', message: 'تمت إضافة المنشأة بنجاح', data: result.rows[0] });
  } catch (error) {
    console.error('Error creating establishment:', error);
    res.status(500).json({ status: 'error', message: 'خطأ في إضافة المنشأة' });
  }
};

// Update establishment status/info
export const updateEstablishment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, last_eval_score } = req.body;

    const result = await db.query(
      `UPDATE establishments 
       SET status = COALESCE($1, status), last_eval_score = COALESCE($2, last_eval_score) 
       WHERE est_id = $3 RETURNING *`,
      [status, last_eval_score, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'المنشأة غير موجودة' });
    }

    res.status(200).json({ status: 'success', message: 'تم تحديث بيانات المنشأة', data: result.rows[0] });
  } catch (error) {
    console.error('Error updating establishment:', error);
    res.status(500).json({ status: 'error', message: 'خطأ في تحديث المنشأة' });
  }
};
