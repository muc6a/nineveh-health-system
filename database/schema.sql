-- ========================================================
-- Smart Health Inspection System - PostgreSQL Schema (Revised)
-- ========================================================

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Manager', 'Team', 'Tracker')),
    district_ids TEXT[], -- Array of districts the user manages/covers
    email VARCHAR(150) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ESTABLISHMENTS TABLE
CREATE TABLE establishments (
    est_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    est_name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    district_id VARCHAR(100) NOT NULL, -- Links to specific district/sector
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    last_eval_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. EVALUATIONS TABLE
CREATE TABLE evaluations (
    eval_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    est_id UUID NOT NULL REFERENCES establishments(est_id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    penalty_type VARCHAR(50) CHECK (penalty_type IN ('none', 'warning', 'fine', 'closure')),
    audit_log JSONB DEFAULT '[]'::jsonb, -- Edit history/audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CLOSURES TABLE
CREATE TABLE closures (
    closure_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    est_id UUID NOT NULL REFERENCES establishments(est_id) ON DELETE CASCADE,
    duration_days INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    closure_photo TEXT, -- URL to closure seal photo
    breach_photo TEXT,  -- URL to broken seal photo
    tracker_id UUID REFERENCES users(user_id) ON DELETE SET NULL, -- The tracker responsible
    is_breached BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- TRIGGERS FOR UPDATED_AT
-- ========================================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_establishments_modtime
    BEFORE UPDATE ON establishments
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_closures_modtime
    BEFORE UPDATE ON closures
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
