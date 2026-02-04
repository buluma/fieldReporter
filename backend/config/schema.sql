-- SQL Schema for Field Reporter Backend

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    password TEXT NOT NULL, -- Hashed password
    assigned VARCHAR(50) DEFAULT 'field', -- 'field' or 'team-leader'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Login Logs Table
CREATE TABLE IF NOT EXISTS login_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Link to users table
    username VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    event_type VARCHAR(50) NOT NULL -- 'login' or 'logout'
);

-- Stores Table
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    region VARCHAR(255),
    location VARCHAR(255),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    contact_person VARCHAR(255),
    notes TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Assigned user
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Checkin Sessions Table
CREATE TABLE IF NOT EXISTS checkin_sessions (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL, -- Unique identifier for the check-in session
    checkin_time TIMESTAMP WITH TIME ZONE NOT NULL,
    checkin_place VARCHAR(255), -- Latitude,Longitude
    checkout_time TIMESTAMP WITH TIME ZONE,
    checkout_place VARCHAR(255), -- Latitude,Longitude
    submitter VARCHAR(255) NOT NULL,
    store_name VARCHAR(255) NOT NULL, -- Denormalized for easier query
    day DATE NOT NULL
);

-- Availability Records Table
CREATE TABLE IF NOT EXISTS availability_records (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    coords VARCHAR(255), -- Latitude,Longitude
    available_wl_1l TEXT,
    available_wl_35cl TEXT,
    available_wl_75cl TEXT,
    submitter VARCHAR(255) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Placement Records Table
CREATE TABLE IF NOT EXISTS placement_records (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    coords VARCHAR(255), -- Latitude,Longitude
    sell_wl_1l TEXT,
    sell_wl_35cl TEXT,
    sell_wl_75cl TEXT,
    submitter VARCHAR(255) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activation Records Table
CREATE TABLE IF NOT EXISTS activation_records (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    coords VARCHAR(255), -- Latitude,Longitude
    activation_status TEXT,
    storming_status TEXT,
    submitter VARCHAR(255) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Visibility Records Table
CREATE TABLE IF NOT EXISTS visibility_records (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    coords VARCHAR(255), -- Latitude,Longitude
    wall_branding TEXT,
    sign_board TEXT,
    eye_level TEXT,
    poster_available TEXT,
    poster_placement TEXT,
    visibility_potential TEXT,
    submitter VARCHAR(255) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TL Focus Records Table
CREATE TABLE IF NOT EXISTS tl_focus_records (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    coords VARCHAR(255), -- Latitude,Longitude
    title VARCHAR(255),
    focus_areas TEXT,
    next_action TEXT,
    start_date DATE,
    end_date DATE,
    submitter VARCHAR(255) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TL Objectives Records Table
CREATE TABLE IF NOT EXISTS tl_objectives_records (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    coords VARCHAR(255), -- Latitude,Longitude
    objective TEXT,
    achieved TEXT,
    challenge TEXT,
    plan TEXT,
    submitter VARCHAR(255) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Objectives Records Table (Field Staff)
CREATE TABLE IF NOT EXISTS objectives_records (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    coords VARCHAR(255), -- Latitude,Longitude
    target_score INTEGER,
    num_facings INTEGER,
    target_facings INTEGER,
    current_facings INTEGER,
    current_percentage NUMERIC(5,2),
    achieved TEXT,
    if_no_why TEXT,
    action_point TEXT,
    submitter VARCHAR(255) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Other Objectives Records Table (Field Staff)
CREATE TABLE IF NOT EXISTS other_objectives_records (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    coords VARCHAR(255), -- Latitude,Longitude
    objective TEXT,
    achieved TEXT,
    challenge TEXT,
    plan TEXT,
    submitter VARCHAR(255) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Listings Records Table
CREATE TABLE IF NOT EXISTS listings_records (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    coords VARCHAR(255), -- Latitude,Longitude
    listing TEXT,
    listed BOOLEAN,
    submitter VARCHAR(255) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Brands Table (Master list)
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Brand Stocks Records Table
CREATE TABLE IF NOT EXISTS brand_stocks_records (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    coords VARCHAR(255), -- Latitude,Longitude
    brand VARCHAR(255) NOT NULL,
    stock_date DATE,
    current_stock INTEGER,
    sale INTEGER,
    order_placed BOOLEAN,
    delivery BOOLEAN,
    stock_out BOOLEAN,
    remarks TEXT,
    submitter VARCHAR(255) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Records Table
CREATE TABLE IF NOT EXISTS performance_records (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    coords VARCHAR(255), -- Latitude,Longitude
    rtd_actual INTEGER,
    udv_actual INTEGER,
    kbl_actual INTEGER,
    comments TEXT,
    submitter VARCHAR(255) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Daily Planner Records Table
CREATE TABLE IF NOT EXISTS daily_planner_records (
    id SERIAL PRIMARY KEY,
    coords VARCHAR(255), -- Latitude,Longitude
    daily_date DATE NOT NULL,
    start_time_input TIME,
    end_time_input TIME,
    daily_challenges TEXT,
    daily_notes TEXT,
    stores_visited JSONB, -- Store JSON data
    submitter VARCHAR(255) NOT NULL,
    week INTEGER,
    month INTEGER,
    year INTEGER,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Checklist Records Table
CREATE TABLE IF NOT EXISTS checklist_records (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    coords VARCHAR(255), -- Latitude,Longitude
    beer_bottles INTEGER,
    beer INTEGER,
    rtds INTEGER,
    vodka INTEGER,
    liqeur INTEGER,
    brandy INTEGER,
    whisky INTEGER,
    tequila INTEGER,
    rums INTEGER,
    anads INTEGER,
    gins INTEGER,
    canes INTEGER,
    cold_space TEXT,
    comments TEXT,
    submitter VARCHAR(255) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
