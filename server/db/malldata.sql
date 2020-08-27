use `mall`;


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- MySQL dump 10.13  Distrib 8.0.21, for osx10.15 (x86_64)
--
-- Host: localhost    Database: mall
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresslist`
--

DROP TABLE IF EXISTS `addresslist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresslist` (
  `addressId` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(64) NOT NULL,
  `userName` varchar(64) NOT NULL,
  `fullAddress` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `postCode` int NOT NULL,
  `tel` varchar(32) NOT NULL,
  `isDefault` tinyint(1) NOT NULL,
  PRIMARY KEY (`addressId`)
) ENGINE=InnoDB AUTO_INCREMENT=10016 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bannerName` varchar(128) NOT NULL,
  `bannerUri` varchar(256) NOT NULL,
  `isEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `bannerOrder` int NOT NULL,
  `desc` varchar(256) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(50) NOT NULL DEFAULT 'Admin',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `section` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--

-- Table structure for table `cartlist`
--

DROP TABLE IF EXISTS `cartlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cartlist` (
  `cartId` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(64) NOT NULL,
  `productId` int NOT NULL,
  `productName` varchar(128) NOT NULL,
  `productPrice` decimal(12,2) NOT NULL,
  `checked` tinyint NOT NULL DEFAULT '0',
  `qty` int NOT NULL,
  `productImg` varchar(256) NOT NULL,
  `totalPrice` decimal(12,2) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`cartId`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `CRM_company`
--

DROP TABLE IF EXISTS `CRM_company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CRM_company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tax_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CRM_company`
--

LOCK TABLES `CRM_company` WRITE;
/*!40000 ALTER TABLE `CRM_company` DISABLE KEYS */;
/*!40000 ALTER TABLE `CRM_company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CRM_user`
--

DROP TABLE IF EXISTS `CRM_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CRM_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(64) NOT NULL,
  `userName` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `userPwd` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `title` char(10) DEFAULT NULL,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `goods`
--

DROP TABLE IF EXISTS `goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `productName` varchar(128) NOT NULL,
  `productPrice` decimal(12,2) NOT NULL,
  `checked` varchar(32) NOT NULL DEFAULT '0',
  `productNum` int NOT NULL,
  `productImg` varchar(256) NOT NULL,
  `sub_title` varchar(128) NOT NULL,
  `limit_num` int NOT NULL,
  `desc` varchar(256) NOT NULL,
  `descImg` varchar(32) NOT NULL,
  `productDetails` varchar(126) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods` 
-- In case the data Not totally compatible with database (should be compatible), modify the sample data below
--
INSERT INTO `goods` (`id`, `productId`, `productName`, `productPrice`, `checked`, `productNum`, `productImg`, `sub_title`, `limit_num`, `desc`, `descImg`, `productDetails`) VALUES
(1, 10001, '小米6', 2499, '0', 0, 'mi6.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '', 'xiaomi6.jpg', '小米6 全网通 4GB+64GB 亮黑色 移动联通电信4G手机 双卡双待 小米6变焦双'),
(2, 10002, '小米笔记本', 3999, '0', 0, 'note.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '', 'xiaomi-matebook.jpg', '小米(MI)Air 13.3英寸全金属轻薄笔记本电脑(i5-7200U 8G 256G固态硬盘 全高清屏 背光键盘 Win10)银'),
(3, 10003, '小米音响', 199, '0', 0, '1.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '', '', '小米（MI）小钢炮蓝牙音箱2 迷你便携音响 户外蓝牙音响 免提通话（黑色）'),
(4, 10004, 'Leme1', 1999, '0', 0, '3.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '', '', '乐视（Letv） 无线头戴式 Leme蓝牙耳机2代 EB30 无线蓝牙4.1耳机包邮 红色'),
(5, 10005, '乐视盒子', 299, '0', 0, '5.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '', '', '乐视TV（Letv） 乐视盒子U4 Pro 3D 4K 四核高清电视硬盘播放器网络机顶盒 裸机版U4（不含影视会员）'),
(6, 10006, '小米插座', 99, '0', 0, '6.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '', '', '小米（MI）插排插线板 多功能接线板3/5孔插座拖线板米家6位排插企业办公定制LOGO刻字 米家插线板6位基础版-白色'),
(7, 10007, '小米耳机', 199, '0', 0, '7.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '', '', '小米（MI）耳机 小米活塞耳机 炫彩版 星空钛版耳机适用于红米NOTE华为系列 基础版-粉色'),
(8, 10008, '小米硬盘400G', 1999, '0', 0, '8.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '', '', '小米硬盘400G'),
(9, 10009, '小米智能电饭煲', 599, '0', 0, '9.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '', '', '米家（MIJIA）小米智能电饭煲 米家IH电饭煲 电磁环绕加热 4L容量 PFA粉体涂层'),
(10, 10010, '小米TV', 5999, '0', 0, '10.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '做高性能的好电视，让你的娱乐体验更畅快', 'xiaomi-tv.jpg', '小米（MI）小米电视4 L55M5-AB 55英寸 2GB+8GB 4.9mm超薄 4K超高清智能液晶平板电视机（黑色）'),
(11, 10011, 'Leme2', 1999, '0', 0, '4.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '', '', '乐视（Letv） 无线头戴式 Leme蓝牙耳机2代 EB30 无线蓝牙4.1耳机包邮 尊贵黑'),
(12, 10012, '数据线', 59, '0', 0, '15.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '', '', '品胜（PISEN）苹果数据线 8/7/6/5s手机充电线 1.2米 白色 适用于iphone5/5s/6/6s/Plus/7/8/X/iPad/Air/Pro'),
(13, 10013, '智能摄像头', 999, '0', 0, 'photo.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '', '', '萤石 EZVIZ C6升级版 摄像头 云台智能网络摄像机 语音交互 wifi远程监控防盗摄像头 家居无线摄像头ip camera 海康威视 旗下品牌'),
(14, 10014, '小米平衡车', 1999, '0', 0, 'pingheng.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '', '', '小米（MI） 定制版Ninebot 九号平衡车 智能代步电动体感车（白）'),
(15, 10015, '自拍杆', 34, '0', 0, 'zipai.jpg', '此仅为支付测试商品 拍下不会发货\n', 10, '', '', '荣耀自拍杆轻巧便携自拍即插即用手机通用AF11L（黑色）'),
(16, 10016, 'iphoneX', 8388, '0', 0, 'iphoneX.jpg', '【256G银9088！国行正品,京东配送】', 10, '', 'iphoneX.jpg', 'Apple iPhone X (A1865) 64GB 深空灰色 移动联通电信4G手机');



--
-- Table structure for table `OMS_order_product_relation`
--

DROP TABLE IF EXISTS `OMS_order_product_relation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OMS_order_product_relation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` varchar(64) NOT NULL,
  `productId` int NOT NULL,
  `productName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `productPrice` decimal(12,2) NOT NULL,
  `productQty` int NOT NULL,
  `productImg` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `productDiscount` decimal(12,2) DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orderId` (`orderId`,`productId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `OMS_orders`
--

DROP TABLE IF EXISTS `OMS_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OMS_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` varchar(64) NOT NULL,
  `userId` varchar(64) NOT NULL,
  `subTotal` decimal(12,2) NOT NULL COMMENT 'product charge',
  `shipping` decimal(12,2) NOT NULL COMMENT 'shipping charge',
  `insurance` decimal(12,2) NOT NULL COMMENT 'insurance charge',
  `discount` decimal(12,2) NOT NULL COMMENT 'discount amount for order',
  `contactPerson` varchar(64) NOT NULL COMMENT '收货人',
  `contactNumber` varchar(32) NOT NULL COMMENT '收货人号码',
  `contactAddress` varchar(250) NOT NULL COMMENT '收货人地址',
  `contactPostalCode` varchar(20) NOT NULL COMMENT '收货人地址邮编',
  `buyerExpDeliveryDate` date DEFAULT NULL COMMENT '期望送达日期',
  `buyerExpDelTimeFrom` time DEFAULT NULL COMMENT '期望送达时间-起始',
  `buyerExpDelTimeTo` time DEFAULT NULL COMMENT '期望送达时间-结束',
  `buyerComment` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT 'Buyer''s comments when submit order',
  `orderStatus` tinyint NOT NULL COMMENT '0=null, 1=to pay,2=to deliver, 3=complete, 8=cancelled 9=refunded',
  `createdAt` timestamp NOT NULL COMMENT '下单时间',
  `paymentOption` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `paymentStatus` tinyint NOT NULL DEFAULT '1' COMMENT '0=null, 1=to pay, 2=partial paid, 3=paid',
  `paymentTime` timestamp NULL DEFAULT NULL COMMENT '付款时间',
  `deliveryStatus` tinyint NOT NULL DEFAULT '0' COMMENT '0=null, 1=in process, 2=deliverd',
  `deliveryCompany` varchar(59) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '快递公司',
  `deliveyTrackingId` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '快递单号',
  `deliveryTime` timestamp NULL DEFAULT NULL COMMENT '送达时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `orderId` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orderlist`
--

DROP TABLE IF EXISTS `orderlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderlist` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'order data entry ID',
  `orderId` varchar(128) NOT NULL,
  `userId` varchar(64) NOT NULL,
  `productId` int NOT NULL,
  `productName` varchar(128) NOT NULL,
  `productPrice` int NOT NULL,
  `productNum` int NOT NULL,
  `productImg` varchar(256) NOT NULL,
  `totalPrice` varchar(64) NOT NULL,
  `streetName` varchar(256) NOT NULL,
  `postName` varchar(32) NOT NULL,
  `postCode` varchar(32) NOT NULL,
  `tel` varchar(32) NOT NULL,
  `itemPrice` varchar(32) NOT NULL,
  `discount` varchar(32) NOT NULL COMMENT '折扣',
  `shipPrice` varchar(32) NOT NULL COMMENT '配送费',
  `freightRisk` varchar(32) NOT NULL COMMENT '运费险',
  `createDate` varchar(32) NOT NULL,
  `ifPay` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
