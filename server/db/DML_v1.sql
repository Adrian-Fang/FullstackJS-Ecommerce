-- @Adrian Fang
-- @2022-05-21 12:46
ALTER TABLE crm_user ADD UNIQUE(userId);
ALTER TABLE `crm_user` ADD COLUMN verified VARCHAR(4) NOT NULL DEFAULT 'N';


-- ----------------------------
-- Table structure for AUTH_OPT
-- ----------------------------
DROP TABLE IF EXISTS `AUTH_OTP`;
CREATE TABLE `AUTH_OTP` (
    `id` int NOT NULL AUTO_INCREMENT,
    `ref_code` VARCHAR(50) DEFAULT NULL,
    `code` VARCHAR(20) DEFAULT NULL,
    `type` TINYINT UNSIGNED COMMENT '1=Registration, 2=ResetPassword, 3=Payment',
    `email` VARCHAR(100) DEFAULT NULL,
    `mobile` VARCHAR(20) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `created_by` VARCHAR(100) DEFAULT 'SYSTEM',
    PRIMARY KEY(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3;