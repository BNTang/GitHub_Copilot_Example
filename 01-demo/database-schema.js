/**
 * 广告数据系统 - 数据库模式设计
 */

// 用户表
const UserSchema = {
    id: "UUID PRIMARY KEY",
    username: "VARCHAR(50) UNIQUE NOT NULL",
    email: "VARCHAR(100) UNIQUE NOT NULL",
    password: "VARCHAR(100) NOT NULL", // 存储加密后的密码
    role: "ENUM('admin', 'manager', 'viewer') DEFAULT 'viewer'",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    updated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    last_login: "TIMESTAMP NULL",
    status: "ENUM('active', 'inactive', 'suspended') DEFAULT 'active'"
};

// 广告平台表
const AdPlatformSchema = {
    id: "UUID PRIMARY KEY",
    name: "VARCHAR(50) NOT NULL",
    api_key: "VARCHAR(100)", 
    api_secret: "VARCHAR(100)",
    platform_type: "VARCHAR(50)", // 如: 'google_ads', 'facebook', 'baidu' 等
    status: "ENUM('active', 'paused', 'disconnected') DEFAULT 'active'",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    updated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    user_id: "UUID REFERENCES users(id) ON DELETE CASCADE" // 创建者
};

// 广告活动表
const CampaignSchema = {
    id: "UUID PRIMARY KEY",
    name: "VARCHAR(100) NOT NULL",
    platform_id: "UUID REFERENCES ad_platforms(id) ON DELETE CASCADE",
    platform_campaign_id: "VARCHAR(100)", // 平台上的原始ID
    start_date: "DATE NOT NULL",
    end_date: "DATE",
    status: "ENUM('active', 'paused', 'completed', 'archived') DEFAULT 'active'",
    budget: "DECIMAL(10,2)",
    budget_type: "ENUM('daily', 'total') DEFAULT 'daily'",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    updated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
};

// 广告组表
const AdGroupSchema = {
    id: "UUID PRIMARY KEY",
    name: "VARCHAR(100) NOT NULL",
    campaign_id: "UUID REFERENCES campaigns(id) ON DELETE CASCADE",
    platform_adgroup_id: "VARCHAR(100)", // 平台上的原始ID
    status: "ENUM('active', 'paused', 'archived') DEFAULT 'active'",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    updated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
};

// 广告创意表
const AdCreativeSchema = {
    id: "UUID PRIMARY KEY",
    name: "VARCHAR(100) NOT NULL",
    adgroup_id: "UUID REFERENCES ad_groups(id) ON DELETE CASCADE",
    platform_creative_id: "VARCHAR(100)", // 平台上的原始ID
    creative_type: "ENUM('image', 'video', 'carousel', 'text') NOT NULL",
    content: "JSON", // 存储创意内容的JSON数据
    status: "ENUM('active', 'paused', 'archived', 'rejected') DEFAULT 'active'",
    rejection_reason: "TEXT",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    updated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
};

// 每日广告数据表
const DailyAdDataSchema = {
    id: "UUID PRIMARY KEY",
    date: "DATE NOT NULL",
    platform_id: "UUID REFERENCES ad_platforms(id)",
    campaign_id: "UUID REFERENCES campaigns(id)",
    adgroup_id: "UUID REFERENCES ad_groups(id)",
    creative_id: "UUID REFERENCES ad_creatives(id)",
    impressions: "INT DEFAULT 0",
    clicks: "INT DEFAULT 0",
    cost: "DECIMAL(10,2) DEFAULT 0.00",
    conversions: "INT DEFAULT 0",
    conversion_value: "DECIMAL(10,2) DEFAULT 0.00",
    ctr: "DECIMAL(5,4) DEFAULT 0.00", // 点击率
    cpc: "DECIMAL(10,2) DEFAULT 0.00", // 每次点击成本
    cpm: "DECIMAL(10,2) DEFAULT 0.00", // 每千次展示成本
    requests: "INT DEFAULT 0", // 广告请求数
    fill_rate: "DECIMAL(5,4) DEFAULT 0.00", // 填充率
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    updated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    INDEX: "idx_date_platform (date, platform_id)",
    UNIQUE: "unique_daily_data (date, platform_id, campaign_id, adgroup_id, creative_id)"
};

// 受众分析表
const AudienceAnalyticsSchema = {
    id: "UUID PRIMARY KEY",
    date: "DATE NOT NULL",
    platform_id: "UUID REFERENCES ad_platforms(id)",
    campaign_id: "UUID REFERENCES campaigns(id)",
    age_group: "VARCHAR(20)", // 如: '18-24', '25-34'
    gender: "VARCHAR(10)", // 如: 'male', 'female', 'unknown'
    location: "VARCHAR(100)", // 城市或地区
    device_type: "VARCHAR(50)", // 如: 'mobile', 'desktop', 'tablet'
    os: "VARCHAR(50)", // 操作系统
    browser: "VARCHAR(50)", // 浏览器
    impressions: "INT DEFAULT 0",
    clicks: "INT DEFAULT 0",
    ctr: "DECIMAL(5,4) DEFAULT 0.00",
    conversions: "INT DEFAULT 0",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    INDEX: "idx_date_campaign (date, campaign_id)"
};

// 自定义报告表
const CustomReportSchema = {
    id: "UUID PRIMARY KEY",
    name: "VARCHAR(100) NOT NULL",
    user_id: "UUID REFERENCES users(id) ON DELETE CASCADE",
    type: "ENUM('daily', 'weekly', 'monthly', 'custom') DEFAULT 'daily'",
    config: "JSON", // 存储报告配置的JSON
    schedule: "VARCHAR(50)", // 如CRON表达式
    recipients: "JSON", // 存储接收者邮箱列表
    last_generated: "TIMESTAMP NULL",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    updated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
};

// 系统日志表
const SystemLogSchema = {
    id: "UUID PRIMARY KEY",
    log_level: "ENUM('info', 'warning', 'error', 'critical') NOT NULL",
    source: "VARCHAR(100) NOT NULL", // 如: 'api', 'cron', 'sync'
    message: "TEXT NOT NULL",
    details: "JSON",
    user_id: "UUID REFERENCES users(id) NULL", // 相关用户ID，如果适用
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    INDEX: "idx_level_created (log_level, created_at)"
};

// 导出所有表模式
module.exports = {
    UserSchema,
    AdPlatformSchema,
    CampaignSchema,
    AdGroupSchema,
    AdCreativeSchema,
    DailyAdDataSchema,
    AudienceAnalyticsSchema,
    CustomReportSchema,
    SystemLogSchema
};
