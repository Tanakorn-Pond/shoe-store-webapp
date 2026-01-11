








SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


;
;
;
;











CREATE TABLE `orders` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `shipping` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `items` json NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





INSERT INTO `orders` (`id`, `userId`, `subtotal`, `shipping`, `total`, `createdAt`, `updatedAt`, `items`, `status`) VALUES
(5, 12, 10600.00, 0.00, 10600.00, '2025-10-30 21:57:37.073699', '2025-10-30 21:57:37.073699', '[{\"qty\": 1, \"name\": \"ADIZERO ADIOS PRO 4\", \"price\": 8000, \"productId\": 9}, {\"qty\": 1, \"name\": \"Chuck Taylor All Star\", \"price\": 2600, \"productId\": 15}]', 'pending'),
(6, 12, 1800.00, 0.00, 1800.00, '2025-10-30 22:04:29.067040', '2025-10-30 22:04:29.067040', '[{\"qty\": 1, \"name\": \"Nike Air Heights\", \"price\": 1800, \"productId\": 8}]', 'pending'),
(7, 10, 2600.00, 0.00, 2600.00, '2025-10-30 22:08:10.276112', '2025-10-30 22:08:10.276112', '[{\"qty\": 1, \"name\": \"Chuck Taylor All Star\", \"size\": 38, \"price\": 2600, \"productId\": 15}]', 'pending'),
(8, 12, 46800.00, 0.00, 46800.00, '2025-10-30 23:24:31.392585', '2025-10-30 23:24:31.392585', '[{\"qty\": 9, \"name\": \"Nike Dunk Low Retro Limited\", \"size\": 40, \"price\": 5200, \"productId\": 6}]', 'pending'),
(9, 10, 1800.00, 0.00, 1800.00, '2025-10-31 08:22:54.409562', '2025-10-31 08:22:54.409562', '[{\"qty\": 1, \"name\": \"Nike Air Heights\", \"price\": 1800, \"productId\": 8}]', 'pending'),
(10, 10, 8000.00, 0.00, 8000.00, '2025-10-31 10:28:18.666812', '2025-10-31 10:28:18.666812', '[{\"qty\": 1, \"name\": \"ADIZERO ADIOS PRO 4\", \"price\": 8000, \"productId\": 9}]', 'pending');







CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `brand` varchar(60) NOT NULL,
  `sizes` text,
  `images` text,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





INSERT INTO `products` (`id`, `name`, `description`, `price`, `stock`, `brand`, `sizes`, `images`, `createdAt`, `updatedAt`) VALUES
(4, 'Nike Dunk Low Retro', 'Nike Dunk Low Retro สร้างสรรค์มาเพื่อคอร์ทพื้นไม้ แต่ก็เป็นที่นิยมในแนวสตรีท วันนี้กลับมาพร้อมส่วนหุ้มชั้นนอกเฉียบคมและสีสันประจำทีมแบบออริจินัล รองเท้าบาสเก็ตบอลรุ่นไอคอนคู่นี้ถ่ายทอดกลิ่นอายยุค 80 ด้วยหนังระดับพรีเมียมที่ส่วนบน ซึ่งนอกจากจะดูดีแล้วเวลาสวมใส่ยังรู้สึกดียิ่งกว่าเดิม นอกจากนี้ เทคโนโลยีรองเท้ายุคโมเดิร์นยังนำความสบายจากยุคเก่ามาสู่ยุคศตวรรษที่ 21 อีกด้วย', 3700.00, 50, 'Nike', '39,40,41', 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/0f76f73e-2578-4d62-abab-c5563ea4f78c/NIKE+DUNK+LOW+RETRO.png', '2025-10-30 12:31:09.000000', '2025-10-30 12:31:09.000000'),
(5, 'Nike Dunk Low x LEGO® Collection', 'รองเท้า Dunks คู่นี้เป็นหน้าต่างสู่จักรวาลอีกใบหรือเปล่า ผูกเชือกแล้วไปหาคำตอบกัน! เราซ่อนรูปทรง LEGO® ชิ้นโปรดทั้งหมดไว้ในลายพิมพ์ที่ได้แรงบันดาลใจจากกาแล็กซี แถมด้านบนยังเป็นหนังสังเคราะห์ที่ทนทาน และมีแผ่นรองเท้านุ่มๆ ใต้ฝ่าเท้าเพื่อความสบายทะลุโลก', 4400.00, 20, 'Nike', '[39,40,41,42]', '[\"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/6e684fe3-5a1c-4bb9-a974-9514f31dc941/NIKE+DUNK+LOW+x+LEGO+COL+GS.png\"]', '2025-10-30 12:38:50.101940', '2025-10-30 12:38:50.101940'),
(6, 'Nike Dunk Low Retro Limited', 'วางใจในความคลาสสิกได้เสมอ Dunk Low จับคู่สีคัลเลอร์บล็อคอันเป็นเอกลักษณ์เข้ากับวัสดุระดับพรีเมียมและชั้นบุนุ่มพิเศษ เพื่อความสบายที่ยาวนานแบบพลิกเกม ความเป็นไปได้ไม่มีที่สิ้นสุด แล้วคุณล่ะจะใส่ Dunk อย่างไร', 5200.00, 10, 'Nike', '[40,41,42,43,44]', '[\"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/9aaf9a22-34f5-4b07-9209-527ee281088d/NIKE+DUNK+LOW+RETRO+LTD+HWN.png\"]', '2025-10-30 12:40:55.824862', '2025-10-30 16:24:54.000000'),
(7, 'Nike Calm RealTree', 'เพลิดเพลินกับประสบการณ์ที่สงบและสบายไม่ว่าจะไปที่ไหนในวันหยุด ดีไซน์มินิมอลมาโดดเด่นด้วลายพิมพ์ RealTree ที่ผลิตจากโฟมนุ่มแต่รองรับได้ดีทำให้รองเท้าคู่นี้แต่งสไตล์ได้ง่ายไม่ว่าจะใส่หรือไม่ใส่ถุงเท้า ส่วนสายรัดที่ส้นก็ปรับได้และถอดออกได้เพื่อให้ความพอดีแบบเฉพาะตัว', 3000.00, 30, 'Nike', '[38,40,42]', '[\"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/4af9ab49-be2f-4db1-8d01-c90cf7ae2bc9/NIKE+CALM+MULE+-+REALTREE+WNTR.png\"]', '2025-10-30 12:45:20.157870', '2025-10-30 12:46:01.000000'),
(8, 'Nike Air Heights', 'ยุค 90 กลับมาอย่างยิ่งใหญ่ด้วย Nike Air Height รุ่นใหม่ที่ได้แรงบันดาลใจจากสไตล์เรโทร ดีไซน์หนาและโดดเด่นพร้อมรายละเอียดแบบโมเดิร์นพารองเท้าน้ำหนักเบาใส่สบายคู่นี้ไปสู่อีกระดับ', 1800.00, 3, 'Nike', '[45,35,38]', '[\"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/kizxcybslloojllx9wgf/WMNS+NIKE+AIR+HEIGHTS.png\"]', '2025-10-30 12:48:09.908883', '2025-10-31 01:22:54.000000'),
(9, 'ADIZERO ADIOS PRO 4', '', 8000.00, 12, 'Adidas', '[40,41,42,43]', '[\"https://www.jdsports.co.th/cdn/shop/files/jd_JS4495_a.jpg\"]', '2025-10-30 13:07:01.586613', '2025-10-31 03:28:18.000000'),
(11, 'Converse Omega Trainer', 'เปล่งประกายเจิดจรัสจนทำให้ลูกบอลดิสโก้ต้องอิจฉา รองเท้าหุ้มส้นเมทัลลิกให้ลุคหรูหราพร้อมไปปาร์ตี้\n• ส่วนบนทำจากผ้าใบทนทานเพื่อรูปลักษณ์และสัมผัสแบบ Chucks คลาสสิก\n• ระบบกันกระแทก OrthoLite ช่วยให้ความสบายใต้ฝ่าเท้าเหมาะสมที่สุด\n• ปลอกคอบุนวมบางๆ เพื่อการรองรับที่เพิ่มขึ้น\n• การเคลือบเมทัลลิกช่วยให้สไตล์ของคุณเปล่งประกาย\n• A18933C', 3300.00, 15, 'Converse', '[38,39,40,41,42,43,44]', '[\"https://www.converse.co.th/media/catalog/product/cache/8fcecb462959d400cda3532b9c3dc9f0/a/1/a18933cu_h5bkbr_8.jpg\"]', '2025-10-30 14:24:58.789258', '2025-10-30 14:25:33.000000'),
(12, 'All Star Classic Trainer', 'Run Star Trainer คือการเฉลิมฉลองให้กับกีฬา สไตล์ และมรดกทางวัฒนธรรม รายละเอียดอันทันสมัยและระบบรองรับแรงกระแทกอันหรูหรา เข้าคู่ได้อย่างลงตัวกับรองเท้าคู่โปรดของคุณ ทั้งกลางวันและกลางคืน ก้าวต่อไปของตำนาน Star Chevron มาถึงแล้ว\n• ส่วนบนที่ทำจากหนังกลับทนทานเพื่อรูปลักษณ์และสัมผัสที่หรูหรา\n• แผ่นรองพื้นรองเท้าเมมโมรี่โฟมสามชั้นช่วยให้สวมใส่สบายและนุ่มสบายเท้า\n• พื้นรองเท้าด้านนอกทำจากยางช่วยยึดเกาะ\n• รูร้อยเชือกแบบเจาะรูและเชือกผูกแบบเคลือบแว็กซ์เพิ่มสัมผัสพรีเมียม\n• A16387C', 2800.00, 20, 'Converse', '[38,39,40,41,42,43,44,45]', '[\"https://www.converse.co.th/media/catalog/product/cache/8fcecb462959d400cda3532b9c3dc9f0/a/1/a16433cm_h5gnxx.jpg\"]', '2025-10-30 14:27:59.095129', '2025-10-30 14:27:59.095129'),
(13, 'Converse Omega Trainer', 'คุณไม่จำเป็นต้องดูโดดเด่นเสมอไป เมื่อลุคของคุณดูเรียบง่ายขึ้น Omega ก็ตอบโจทย์ได้อย่างลงตัว ทั้งน้ำหนักเบา สวมใส่สบาย และสไตล์เหนือกาลเวลาที่คงอยู่ได้ยาวนานกว่าทุกเทรนด์\n• ส่วนบนที่ทำจากหนังกลับและตาข่ายที่ได้รับแรงบันดาลใจจากยุค 80 พร้อมรูปลักษณ์และสัมผัสที่เป็นเอกลักษณ์ของ Converse•แผ่นรองพื้นรองเท้า Converse Comfort และพื้นรองเท้าชั้นกลางโฟม EVA น้ำหนักเบาช่วยให้สวมใส่สบายสูงสุด\n• พื้นรองเท้าชั้นนอกที่ยึดเกาะได้ดีช่วยให้ยึดเกาะได้ดีแม้ในกิจกรรมเบาๆ\n• Star Chevron เป็นตัวแทนมรดก\n• A15432C', 2700.00, 140, 'Converse', '[38,39,40,41,42,43,44,45]', '[\"https://www.converse.co.th/media/catalog/product/cache/8fcecb462959d400cda3532b9c3dc9f0/a/1/a16367cu_h5bkgn.jpg\"]', '2025-10-30 14:29:20.916288', '2025-10-30 14:29:20.916288'),
(14, 'Star Player 76', 'Converse อยู่เคียงข้างคุณมาตั้งแต่ยุคเริ่มต้นของสเก็ตบอร์ด ย้อนรำลึกถึงตำนานด้วยรองเท้า Star Player 76 ที่ได้รับแรงบันดาลใจจากยุคเรโทร มาพร้อมดีไซน์ที่เหมือนหลุดออกมาจากสวนสเก็ต ตั้งแต่ส่วนบนที่ทำจากผ้าใบทนทาน ไปจนถึงพื้นรองเท้ายาง\n• ส่วนบนทำจากผ้าใบทนทานพร้อมรูปลักษณ์และสัมผัสแบบ Converse คลาสสิก\n• ระบบกันกระแทก OrthoLite ช่วยให้ความสบายใต้ฝ่าเท้าเหมาะสมที่สุด\n• สีสันสดใหม่ที่ได้รับแรงบันดาลใจจากวัฒนธรรมการเล่นสเก็ต\n• พื้นรองเท้าด้านนอกทำจากยางสีน้ำผึ้งเพื่อลุคที่ได้รับแรงบันดาลใจจากการเล่นสเก็ตบอร์ด\n• A17723C', 3000.00, 50, 'Converse', '[38,39,40,41,42,43,44,45]', '[\"https://www.converse.co.th/media/catalog/product/cache/8fcecb462959d400cda3532b9c3dc9f0/a/1/a17723cm_h5orxx.jpg\"]', '2025-10-30 14:31:24.218807', '2025-10-30 14:31:24.218807'),
(15, 'Chuck Taylor All Star', 'รองเท้าคู่นี้อยู่คู่กับคุณมาทุกยุคทุกสมัย รองเท้า Chucks สุดคลาสสิกของคุณไม่ต้องพูดถึงอะไรมากมาย เหลือแค่บอกว่ารองเท้าคู่นี้จะเพิ่มหนังกลับเข้าไปในคอลเลกชันของคุณ\n• ส่วนบนทำจากหนังกลับพร้อมรูปลักษณ์และสัมผัสแบบ Chucks คลาสสิก\n• ระบบกันกระแทก OrthoLite ช่วยให้ความสบายใต้ฝ่าเท้าเหมาะสมที่สุด\n• แพตช์ข้อเท้า Chuck Taylor อันเป็นเอกลักษณ์และป้ายทะเบียน All Star-\n• A14592C', 2600.00, 28, 'Converse', '[38,39,40,41,42,43,44,45]', '[\"https://www.converse.co.th/media/catalog/product/cache/8fcecb462959d400cda3532b9c3dc9f0/a/1/a14592cm_h5gyxx.jpg\"]', '2025-10-30 14:44:24.150875', '2025-10-30 15:08:10.000000'),
(16, 'รองเท้าผู้ชาย Samba OG', '', 1900.00, 60, 'Adidas', '[38,39,40,41,42,43,44,45]', '[\"https://cdn.shopify.com/s/files/1/0597/4209/3363/files/jd_TH-IE3675_b_480x526.jpg\"]', '2025-10-30 15:20:32.245786', '2025-10-30 15:23:44.000000'),
(17, 'รองเท้าผู้หญิง Samba OG', '', 3800.00, 55, 'Adidas', '[38,39,40,41,42,43,44,45]', '[\"https://cdn.shopify.com/s/files/1/0597/4209/3363/files/jd_JS1361_b_480x526.jpg\"]', '2025-10-30 15:22:46.097437', '2025-10-30 15:22:46.097437'),
(18, 'Adizero Evo SL', '', 5800.00, 30, 'Adidas', '[38,39,40,41,42,43,44,45]', '[\"https://cdn.shopify.com/s/files/1/0597/4209/3363/files/jd_JP7147-W_b_480x526.jpg\"]', '2025-10-30 15:25:15.819961', '2025-10-30 15:25:15.819961'),
(19, 'Adilette 22', '', 2000.00, 20, 'Adidas', '[38,39,40,41,42,43,44,45]', '[\"https://cdn.shopify.com/s/files/1/0597/4209/3363/files/jd_HQ4670_bl_480x526.jpg\"]', '2025-10-30 15:26:26.733928', '2025-10-30 15:26:26.733928'),
(20, 'VANS PREMIUM AUTHENTIC REISSUE 44 - BLACK/BLACK', '', 1794.00, 22, 'Vans', '[38,39,40,41,42,43,44,45]', '[\"https://media.lotsthailand.com/media/catalog/product/cache/1385b635fbcd2b4a1bd7d222a65ada37/v/n/vn0007qzbka-hero_1_1.jpg\"]', '2025-10-30 15:28:17.166451', '2025-10-30 15:28:17.166451'),
(21, 'VANS AUTHENTIC - MARK SBTG BLACK/MARSHMALLOW', '', 2280.00, 23, 'Vans', '[38,39,40,41,42,43,44,45]', '[\"https://media.lotsthailand.com/media/catalog/product/cache/1385b635fbcd2b4a1bd7d222a65ada37/h/o/ho24_aac_standard_photography_authentic_vn000bw5bpr_8_1.jpg\"]', '2025-10-30 15:29:17.200898', '2025-10-30 15:29:17.200898'),
(22, 'VANS SKATE AUTHENTIC - BLACK SPLATTER', '', 2600.00, 44, 'Vans', '[38,39,40,41,42,43,44,45]', '[\"https://media.lotsthailand.com/media/catalog/product/cache/1385b635fbcd2b4a1bd7d222a65ada37/v/n/vn000eercqq-hero_1.jpg\"]', '2025-10-30 15:30:30.535076', '2025-10-30 15:30:30.535076'),
(23, 'VANS PREMIUM SK8_HI REISSUE 38 - LX CHECKERBOARD BLACK/OFF', '', 4190.00, 39, 'Vans', '[38,39,40,41,42,43,44,45]', '[\"https://media.lotsthailand.com/media/catalog/product/cache/1385b635fbcd2b4a1bd7d222a65ada37/v/n/vn000cr02bo-hero_1_1.jpg\"]', '2025-10-30 15:32:00.697780', '2025-10-30 15:32:00.697780'),
(24, 'VANS SUPER LOWPRO - BLACK', '', 3000.00, 24, 'Vans', '[38,39,40,41,42,43,44,45]', '[\"https://media.lotsthailand.com/media/catalog/product/cache/1385b635fbcd2b4a1bd7d222a65ada37/v/n/vn000d83bla-hero_1_1.jpg\"]', '2025-10-30 15:33:32.511174', '2025-10-30 15:33:32.511174'),
(26, 'LV Tilted', 'รองเท้าผ้าใบรุ่น LV Tilted เป็นรองเท้าผ้าใบทรงโลว์ท็อปชิ้นสำคัญในตู้เสื้อผ้าบุรุษที่ได้รับแรงบันดาลใจจากสไตล์วินเทจยุค 2000 โดดเด่นด้วยสัญลักษณ์ LV ที่ปักเอียงเล็กน้อยบนลิ้นรองเท้า รังสรรค์จากหนังกลับลูกวัว ผสานกับหนัง natural อันเป็นเอกลักษณ์ของหลุยส์ วิตตอง สะท้อนถึงงานฝีมืออันประณีตของเมซง ดีเทลหลักของรุ่นนี้คือเชือกผูกรองเท้าแบบกว้างที่มอบลุคโดดเด่น และพื้นรองเท้ายางด้านนอกทรงหนาพร้อมหัวรองเท้าลาย Damier และพื้นรองเท้าด้านนอกตกแต่งด้วย Monogram Flower', 37600.00, 30, 'Louis Vuitton', '[38,39,40,41,42,43,44,45]', '[\"https://th.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-tilted-sneaker--BVU012SC02_PM2_Front%20view.png\"]', '2025-10-30 15:39:27.528301', '2025-10-30 15:39:27.528301'),
(27, 'LV Flash', '', 35900.00, 34, 'Louis Vuitton', '[38,39,40,41,42,43,44,45]', '[\"https://th.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-flash-sneaker--BVU01BPC02_PM2_Front%20view.png?wid=1090&hei=1090\"]', '2025-10-30 15:40:54.142051', '2025-10-30 15:41:20.000000'),
(28, 'LV BUTTERSOFT Sneaker', '', 43400.00, 40, 'Louis Vuitton', '[38,39,40,41,42,43,44,45]', '[\"https://th.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-buttersoft-sneaker--BVU02VNA01_PM2_Front%20view.png\"]', '2025-10-30 15:43:25.020174', '2025-10-30 15:43:25.020174'),
(29, 'Miami', '', 31700.00, 33, 'Louis Vuitton', '[38,39,40,41,42,43,44,45]', '[\"https://th.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-miami-mule--BVH00EMI02_PM2_Front%20view.png?wid=1090&hei=1090\"]', '2025-10-30 15:45:21.543083', '2025-10-30 15:45:21.543083'),
(30, 'LV Easy', 'รองเท้าสวมเปิดส้นรุ่น LV Easy สุดเอ็กซ์คลูซีฟดีไซน์ตามสุทรียศาสตร์แบบญี่ปุ่นจากแฟชั่นโชว์คอลเลกชันสุภาพบุรุษประจำฤดูกาล Fall-Winter 2025 ไอเท็มแพตช์เวิร์กเดนิม ผสานลายสัญลักษณ์ Monogram และ Damier ให้เอฟเฟ็กต์ลาย landscape ชวนให้นึกถึงเทคนิคการปะผ้าแบบ boro ของญี่ปุ่น รองเท้าสลิปออนสวมใส่ง่ายมาพร้อมสายคาดที่สามารถปรับระดับได้ ตกแต่งแอคเซสเซอรี่อักษรย่อ LV และพื้นรองเท้าด้านนอก EVA น้ำหนักเบา', 40100.00, 10, 'Louis Vuitton', '[38,39,40,41,42,43,44,45]', '[\"https://th.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-easy-mule--BVH008DN22_PM2_Front%20view.png?wid=1090&hei=1090\"]', '2025-10-30 15:46:58.670390', '2025-10-30 15:46:58.670390'),
(31, 'New Balance MR530', 'Inspired by our classic running shoes, the design is a throwback to the 1990s-2000s, especially the unique ABZORB® footbed. Each version has a breathable mesh upper for freshness and comfort.\n\nSize Disclaimer:\n\nThere may be a 1-2cm difference in measurements depending on the development and manufacturing process.\n\nColor Disclaimer:\n\nActual colors may vary. This is due to the fact that every computer monitor has a different capability to display colors, we cannot guarantee that the color you see accurately portrays the true color of the product.', 3900.00, 20, 'New Balance', '[38,39,40,41,42,43,44,45]', '[\"https://www.newbalance.co.th/media/catalog/product/cache/b444f50a64a092a2138a5e1cbd49879a/9/9/9991-NEWMR530SGD00W10H-1.jpg\"]', '2025-10-30 15:49:55.564203', '2025-10-30 15:54:21.000000'),
(32, 'New Balance Rebel V', 'The FuelCell Rebel v5 was built to look and feel fast. With its streamlined, race-inspired mesh upper and colorblocking designs, the resulting silhouette boasts a modern style that inspires, surprises, and confidently stands out ahead of the pack. Incredibly lightweight, its blend of PEBA and EVA foams and considered midsole geometry provide a responsive and energetic underfoot, ideal for those miles you want to feel fast. Equipped with FuelCell midsole technology, this upbeat trainer can easily transition from long, steady runs to something swifter and more spontaneous.', 5300.00, 40, 'New Balance', '[38,39,40,41,42,43,44,45]', '[\"https://www.newbalance.co.th/media/catalog/product/cache/b444f50a64a092a2138a5e1cbd49879a/9/9/9991-NEWMFCXPA501811H-1.jpg\"]', '2025-10-30 15:51:10.476996', '2025-10-30 15:54:01.000000'),
(33, 'New Balance Made In USA 990v6', 'The 990’s original designers were tasked with creating the single best running shoe on the market. The finished product more than lived up to its billing. When it hit shelves for the first time in 1982 the 990 sported an elegantly understated grey colorway, and a then unheard of three-figure price tag.\n\n \n\nSize Disclaimer:\n\nThere may be a 1-2cm difference in measurements depending on the development and manufacturing process.\n\nColor Disclaimer:\n\nActual colors may vary. This is due to the fact that every computer monitor has a different capability to display colors, we cannot guarantee that the color you see accurately portrays the true color of the product.', 9800.00, 12, 'New Balance', '[38,39,40,41,42,43,44,45]', '[\"https://www.newbalance.co.th/media/catalog/product/cache/b444f50a64a092a2138a5e1cbd49879a/9/9/9991-NEWM990GL6GRE013-1.jpg\"]', '2025-10-30 15:52:26.335323', '2025-10-30 15:53:50.000000'),
(34, 'New Balance Made In UK 991v2', 'Since its debut in 2001, the 991 has epitomized superior quality. The MADE in UK 991v2 builds on this legacy, offering an evolved take on the classic with a sleeker pigskin suede, mesh, and synthetic upper. The most notable update is the addition of full-length FuelCell cushioning, paired with ABZORB SBS pods and ENCAP features for enhanced comfort.\n\n \n\nSize Disclaimer:\n\nThere may be a 1-2cm difference in measurements depending on the development and manufacturing process.\n\nColor Disclaimer:\n\nActual colors may vary. This is due to the fact that every computer monitor has a different capability to display colors, we cannot guarantee that the color you see accurately portrays the true color of the product.', 10800.00, 27, 'New Balance', '[38,39,40,41,42,43,44,45]', '[\"https://www.newbalance.co.th/media/catalog/product/cache/b444f50a64a092a2138a5e1cbd49879a/9/9/9991-NEWU991VN200510H-1.jpg\"]', '2025-10-30 15:53:40.069556', '2025-10-30 15:53:40.069556'),
(35, 'New Balance 9060', 'The 9060 is a new expression of the refined style and innovation-led design of the classic 99X series. The 9060 reinterprets familiar 99X elements with a warped sensibility inspired by the proudly futuristic, visible tech aesthetic of the Y2K era. Sway bars, taken from the 990, are expanded and utilized throughout the entire upper for a sense of visible motion, while wavy lines and scaled up proportions on a sculpted pod midsole place an exaggerated emphasis on the familiar cushioning platforms of ABZORB and SBS.', 5700.00, 32, 'New Balance', '[38,39,40,41,42,43,44,45]', '[\"https://www.newbalance.co.th/media/catalog/product/cache/b444f50a64a092a2138a5e1cbd49879a/9/9/9991-NEWU9060CCCXM009H-1.jpg\"]', '2025-10-30 15:55:22.543416', '2025-10-30 15:55:22.543416');







CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(120) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(80) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'customer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





INSERT INTO `users` (`id`, `email`, `createdAt`, `updatedAt`, `name`, `passwordHash`, `role`) VALUES
(1, 'pond@example.com', '2025-10-28 15:30:37.000000', '2025-10-30 22:15:33.882525', '', '', 'customer'),
(6, 'www@gmail.com', '2025-10-30 19:27:50.633636', '2025-10-31 09:44:05.992925', 'pond', '12345678', 'customer'),
(7, 'tk@gmail.com', '2025-10-29 19:33:35.000000', '2025-10-31 09:44:09.664617', 'pond', '12345678', 'customer'),
(10, 'tkpd@gmail.com', '2025-10-29 19:33:35.000000', '2025-10-31 09:44:13.187457', 'pond', '12345678', 'customer'),
(11, '123@gmail.com', '2025-10-30 21:15:17.199394', '2025-10-31 09:44:17.827737', 'Pond', '12345678', 'admin'),
(12, '1234@gmail.com', '2025-10-01 21:17:02.000000', '2025-10-31 09:44:01.864924', 'Po', '12345678', 'admin');








ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_151b79a83ba240b0cb31b2302d1` (`userId`);




ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_4c9fb58de893725258746385e1` (`name`);




ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`);








ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;




ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;




ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;








ALTER TABLE `orders`
  ADD CONSTRAINT `FK_151b79a83ba240b0cb31b2302d1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

;
;
;
