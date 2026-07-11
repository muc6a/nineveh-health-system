-- ========================================================
-- Smart Health Inspection System - PostgreSQL Schema
-- ========================================================

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
-- Store Directors, Field Teams, and Public Health Monitors
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('director', 'central_director', 'team', 'monitor', 'superadmin')),
    sector VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ESTABLISHMENTS TABLE
-- Store Restaurants, Salons, Bakeries, etc.
CREATE TABLE establishments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    license_number VARCHAR(100) UNIQUE,
    property_number VARCHAR(100),
    sector VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    access_code VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'monitoring' CHECK (status IN ('compliant', 'monitoring', 'critical', 'closed', 'new')),
    current_score INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. EVALUATIONS (INSPECTIONS) TABLE
-- Store inspection visits and their details (Audit Trail)
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    notes TEXT,
    items_checked JSONB NOT NULL, -- Detailed checklist results
    evidence_images TEXT[],       -- Array of image URLs/paths
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CLOSURES (PENALTIES & DIRECTIVES) TABLE
-- Store closures, warnings, and penalties
CREATE TABLE closures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
    issued_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('warning', 'fine', 'closure')),
    reason TEXT NOT NULL,
    amount DECIMAL(10, 2) DEFAULT 0.00, -- For fines
    is_active BOOLEAN DEFAULT true,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
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
