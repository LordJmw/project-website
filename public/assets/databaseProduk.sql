-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

-- Database: `databaseuas`
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `store`;

-- Table: store
CREATE TABLE IF NOT EXISTS `store` (
  `store_id` int(5) NOT NULL AUTO_INCREMENT,
  `store_name` varchar(255) NOT NULL,
  `store_image_link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Inserting data into `store`
INSERT INTO `store` (`store_id`, `store_name`, `store_image_link`) VALUES
(1, 'Stellar Space', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTN4pf4RlBgswwGOFn5vhE2rkvARSLMR22Pw&s'),
(2, 'Neon Nest', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh6kKXKG31EI32C-NeBCrmjfscoqL76vihyw&s'),
(3, 'Galaxy Computer', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0u-KaBqRh1ySp6PprZhhMe9GXrOoUzMpWug&s'),
(4, 'Visual Appeal Max', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvIoKwG69OJ-6ZY0nEXGm76c5A8XD1DrNEwA&s'),
(5, 'Fiesta', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReYIwIX3sYJeG3443eXsW6ww1rgxirpY0xFw&s'),
(6, 'Snacks official', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr0Gl93ji_e-YPwPhOhK8JKUnkl5SM-PEb5g&s'),
(7, 'Crystal Cove electrics', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwxq8ENoQSUG3R5C_X2oPkVp9CUXDvanhOBw&s'),
(8, 'Mulholland Clothes Store', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrT2t6n86RqVucRoM0vcUzMlbfZyjHTOS24g&s'),
(9, 'Golden Grove Spareparts', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGNuc_lmbDw_MN-45j1m7BFUAFDeYsLxZNjg&s'),
(10, 'Maxwell Furniture shop', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGdx4TWwE0rD1i8vCXliZTYbhki7Q6XdxNiw&s');

-- Table: products
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int(5) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `store_id` int(5) NOT NULL,
  `product_price` int(10) NOT NULL,
  `product_image_link` varchar(255) DEFAULT NULL,
  `discount` decimal(5,2) DEFAULT NULL,
  `isChecked` tinyint(1) DEFAULT 0,
  `quantity` int(11) DEFAULT 1,
  `note` varchar(255) default NULL,
  `description` varchar(255) default "ini deskripsi",
  `category` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Inserting data into `products`
INSERT INTO `products` (`product_id`, `product_name`, `store_id`, `product_price`, `product_image_link`, `discount`, `isChecked`, `quantity`,`description`,`category`) VALUES
(1, 'Kamera Canon', 1, 10000000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgQ9cLB10vjdEZpaiA2P3tG9F5JBfBQWJTmw&s', 0.20, 0, 1,'Kamera dengan kualitas gambar tajam & fitur canggih untuk hasil profesional','Elektronik '),
(2, 'Polaroid A500 5.0MP Camera', 1, 8000000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMes_HeQYG4MBPSGZJQKgq_Xvn7rAqMqiwxw&s', 0.50, 0, 1,'Kamera digital sederhana dengan resolusi 5 megapiksel, dirancang untuk penggunaan dasar','Elektronik'),
(3, 'Rolex:Submariner Date', 2, 2500000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxIKw57-bz11cbAG3CIW6h28whW4YBxZ-ZZg&s', 0.05, 0, 1,'Jam tangan ikonik dengan desain elegan dan ketahanan luar biasa untuk eksplorasi bawah laut','Aksesoris'),
(4, 'Jam Tangan G-Shock', 2, 1700000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxiPci0zoevgJREtegkY8mNaCUMOc9h1d-fg&s', 0.08, 0, 1,'Jam tangan Casio dengan daya tahan ekstrem, tahan benturan, dan tahan air','Aksesoris'),
(5, 'GeForce RTX 3060 Desktop Computers', 3, 500000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwoLHzB0wtlNPx4OJamVXMycwqX8MBI9yIlw&s', 0.04, 0, 1,'Komputer desktop dengan kartu grafis GeForce RTX 3060 dirancang untuk kebutuhan gaming dan produktivitas tinggi', 'Elektronik'),
(6, 'Asus ROG Zephyrus G15', 3, 2000000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx3j-Vr-BnEsUo-OEEyC3rO7biMmQr7rIsgA&s', 0.1, 0, 1,'Laptop gaming premium yang menggabungkan performa tinggi dan desain portabel','Elektronik'),
(7, 'Ipad Pro 11', 4, 45000000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiTV8ryEAG9b1_tzGDxvHj0artrQIVQibazw&s', 0.20, 0, 1,'Tablet canggih dari Apple dengan layar Liquid Retina 11 inci yang mendukung ProMotion, True Tone, dan warna luas P3 untuk visual yang tajam dan responsif','Elektronik'),
(8, 'Iphone 15 PRO Max', 4, 2500000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu3vKPSTQYhYMTeunonObQ9jj8OuJTZ47oFQ&s', 0.60, 0, 1,'Model flagship Apple dengan bodi titanium ringan, layar Super Retina XDR 6,7 inci, dan chip A17 Pro untuk performa luar biasa','Elektronik'),
(9, 'Fiesta Spicy Chick', 5, 67000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSna1HG-1PLhokHR4Bs90RrAxRTW-grL8jh9w&s', 0.13, 0, 1,'Makanan beku siap saji berupa nugget ayam pedas yang dibuat dari daging ayam berkualitas', 'Makanan'),
(10, 'Fiesta Chicken Nugget', 5, 58500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6IRUnJCFBwFclqpT2XfKQXFeedCYGjI7S-A&s', 0.17, 0, 1,'Terbuat dari daging ayam berkualitas, dilapisi dengan tepung roti yang renyah','Makanan'),
(11, 'Dubai Chocolate', 6, 270000, 'https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/9/21/7cb06eed-bb4d-427f-b1ff-d2f7de3b4456.jpg', 0.05, 0, 1,'Chocolate premium dengan cita rasa mewah khas Timur Tengah','Makanan'),
(12, 'Osem Apropo Corn Snack', 6, 15000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7XSuqtvg0lvXXnalNGrHglYQ4FDfB5dHuxw&s', 0.10, 0, 1,'cemilan jagung renyah dengan rasa gurih yang memanjakan lidah','Makanan'),
(13, 'Stecker Arde', 7, 35000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMzTimpTM193ioBh2vPhAYo5yR21UwZmQsjw&s', 0.30, 0, 1,'Stecker berkualitas tinggi, aman dan andal untuk kebutuhan listrik rumah tangga.','Aksesori elektronik'),
(14, 'Kabel Data 4in1 Fast Charging 65W Dual Input Usb', 7, 53000, 'https://images.tokopedia.net/img/cache/700/hDjmkQ/2024/7/24/b87bc201-c2a5-4633-ab6c-a496e3fdfbba.jpg', 0.02, 0, 0,'Kabel data 4in1 fast charging 65W dengan dual input USB, praktis dan multifungsi untuk berbagai perangkat','Aksesori Elektronik'),
(15, 'T-Shirt Casual', 8, 120000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv-whIzQaOLT4niU5RobYvF9dckUJa1_G_wg&s', 0.20, 0, 1,'T-shirt casual dengan desain modern, nyaman dipakai sehari-hari, cocok untuk segala aktivitas','Pakaian'),
(16, 'Oversized Hoodie', 8, 263000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9HPrN__BjxQzw9vcid-QScXW4y1QMEbaCfA&s', 0.40, 0, 1,'Oversize hoodie trendy, nyaman dipakai, dengan bahan lembut dan desain stylish untuk gaya santai sehari-hari','Pakaian'),
(17, 'Busi Motor Honda Beat', 9, 399000, 'https://astraotoshop.com/asset/article-aop/busi-2-tak%20(1)_20240321.webp', 0.08, 0, 1,'Busi motor honda beat, performa tinggi dengan daya tahan ekstra untuk mesin yang lebih responsif dan irit bahan bakar','Spare part'),
(18, 'Kampas Rem', 9, 56000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1ZiqbfnmPqcLK5l_5p1jObOMVLRNpNS71dg&s', 0.10, 0, 1,'Kampas rem kualitas tinggi, tahan lama, dan memberikan pengereman yang maksimal untuk keamanan berkendara','Spare part'),
(19, 'Sofa Bed', 10, 339000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRAcbNBT3xva3hxdixFrl7WKVB8RJI1we7sw&s', 0.09, 0, 1,'Sofa bed multifungsi yang nyaman,ideal untuk ruang tamu atau kamar tidur','Furniture'),
(20, 'Lemari Pakaian', 10, 399000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr3JbYIkL9LYlhiXAPEQm7VEimzKwb-rdc4A&s', 0.15, 0, 1,'Lemari pakaian luas dengan desain modern untuk menyimpan barang dengan rapi','Furniture');

COMMIT;
