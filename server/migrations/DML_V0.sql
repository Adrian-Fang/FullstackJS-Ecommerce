use `mall`;
drop table if exists banners;
CREATE TABLE IF NOT EXISTS `banners` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `bannerName` varchar(128) NOT NULL,
  `bannerUri` VARCHAR(256) NOT NULL,
  `isEnabled`tinyint(1) NOT NULL DEFAULT 1,
  `bannerOrder` int(16) NOT NULL,
  `desc` varchar(256) NOT NULL,
	`createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
	`createdBy` VARCHAR(50) NOT NULL DEFAULT 'Admin',
	`updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`section` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `banners` (`id`, `bannerName`, `bannerUri`, `isEnabled`, `bannerOrder`, `desc`, `createdBy`, `section`)
VALUES
(1, 'Banner 1', 'https://i.imgur.com/jXaxEYi.jpg', 1, 1, 'This banner can be kept until tye world ends', 'Admin', 'mall main'),
(2, 'Banner 2', 'https://i.imgur.com/HvlCDXF.jpg', 1, 2, 'This banner can be kept until tye world ends', 'Admin', 'mall main'),
(3, 'Banner 3', 'https://i.imgur.com/egQvWfS.jpg', 1, 3, 'This banner can be kept until tye world ends', 'Admin', 'mall main'),
(4, 'Banner 4', 'https://i.imgur.com/X0OIU47.jpg', 1, 3, 'This banner can be kept until tye world ends', 'Admin', 'mall main');
