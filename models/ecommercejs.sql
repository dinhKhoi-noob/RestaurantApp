-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 09, 2022 at 06:54 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommercejs`
--
CREATE DATABASE IF NOT EXISTS `ecommercejs` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ecommercejs`;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `visible_id` varchar(10) NOT NULL,
  `category_id` varchar(10) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONSHIPS FOR TABLE `categories`:
--   `category_id`
--       `categories` -> `visible_id`
--

--
-- Dumping data for table `categories`
--

INSERT DELAYED INTO `categories` (`visible_id`, `category_id`, `title`) VALUES
('appetizer', 'appetizer', 'Appetizer'),
('cake', 'dessert', 'Cake'),
('cupcake', 'dessert', 'Cupcake'),
('dessert', 'dessert', 'Dessert'),
('drink', 'drink', 'Drink'),
('france', 'france', 'France'),
('italia', 'italia', 'Italia'),
('italianood', 'italia', 'Noodles'),
('juice', 'drink', 'Juice'),
('mostfavor', 'mostfavor', 'Most Favorite'),
('muffin', 'dessert', 'Muffin'),
('others', 'others', 'Others'),
('pizza', 'italia', 'Pizza'),
('salad', 'appetizer', 'Salad'),
('smoothies', 'drink', 'Smoothies'),
('soup', 'appetizer', 'Soup'),
('vietnam', 'vietnam', 'Vietnam'),
('vietnoodle', 'vietnam', 'Rice Noodles'),
('wine', 'drink', 'Wine');

-- --------------------------------------------------------

--
-- Table structure for table `discounted_dishes`
--

CREATE TABLE `discounted_dishes` (
  `visible_id` varchar(10) NOT NULL,
  `dish_id` varchar(10) DEFAULT NULL,
  `discount_id` varchar(10) DEFAULT NULL,
  `sale_percent` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONSHIPS FOR TABLE `discounted_dishes`:
--   `discount_id`
--       `discounts` -> `visible_id`
--   `dish_id`
--       `products` -> `visible_id`
--

--
-- Dumping data for table `discounted_dishes`
--

INSERT DELAYED INTO `discounted_dishes` (`visible_id`, `dish_id`, `discount_id`, `sale_percent`) VALUES
('1234567890', 'mostfav02', '1234567891', 25),
('1234567891', 'france03', '1234567890', 20),
('1234567892', 'france01', '1234567890', 30),
('1234567893', 'vietnoo02', '1234567890', 20),
('1234567894', 'mostfav04', '1234567890', 20),
('1234567895', 'soup01', '1234567890', 10),
('1234567896', 'redwine', '1234567890', 30),
('1234567897', 'pasta04', '1234567890', 15),
('1234567898', 'muffin03', '1234567890', 50);

-- --------------------------------------------------------

--
-- Table structure for table `discounts`
--

CREATE TABLE `discounts` (
  `visible_id` varchar(10) NOT NULL,
  `title` varchar(200) NOT NULL,
  `desc` varchar(1000) NOT NULL,
  `date_begin` datetime NOT NULL DEFAULT current_timestamp(),
  `date_end` datetime NOT NULL DEFAULT current_timestamp(),
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modified` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONSHIPS FOR TABLE `discounts`:
--

--
-- Dumping data for table `discounts`
--

INSERT DELAYED INTO `discounts` (`visible_id`, `title`, `desc`, `date_begin`, `date_end`, `date_created`, `date_modified`) VALUES
('1234567890', 'Christmas', 'For Christmas day 2021', '2021-01-21 15:18:58', '2022-01-28 15:18:58', '2022-01-12 15:20:32', '2022-01-12 15:20:32'),
('1234567891', 'New year', 'For New year event', '2022-01-01 16:39:39', '2022-01-10 16:39:39', '2022-01-12 16:40:13', '2022-01-12 16:40:13');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `visible_id` varchar(10) NOT NULL,
  `user_id` varchar(10) DEFAULT NULL,
  `date_created` date DEFAULT current_timestamp(),
  `status` enum('pending','inprogress','refunded','deliveried') NOT NULL DEFAULT 'inprogress'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONSHIPS FOR TABLE `orders`:
--   `user_id`
--       `users` -> `visible_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `visible_id` varchar(10) NOT NULL,
  `order_id` varchar(10) NOT NULL,
  `product_id` varchar(10) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONSHIPS FOR TABLE `order_items`:
--   `order_id`
--       `orders` -> `visible_id`
--   `product_id`
--       `products` -> `visible_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `visible_id` varchar(10) NOT NULL,
  `order_id` varchar(10) NOT NULL,
  `total_payment` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONSHIPS FOR TABLE `payments`:
--   `order_id`
--       `orders` -> `visible_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `visible_id` varchar(10) NOT NULL,
  `category_id` varchar(10) NOT NULL,
  `price` int(11) NOT NULL,
  `sale_percent` int(11) DEFAULT NULL,
  `on_sale` tinyint(1) DEFAULT 0,
  `root_category` varchar(10) NOT NULL,
  `thumbnail` varchar(200) NOT NULL,
  `service` varchar(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(1000) NOT NULL DEFAULT 'No desc',
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `date_modified` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONSHIPS FOR TABLE `products`:
--   `category_id`
--       `categories` -> `visible_id`
--   `root_category`
--       `categories` -> `visible_id`
--

--
-- Dumping data for table `products`
--

INSERT DELAYED INTO `products` (`visible_id`, `category_id`, `price`, `sale_percent`, `on_sale`, `root_category`, `thumbnail`, `service`, `title`, `description`, `is_active`, `date_modified`) VALUES
('cake01', 'cake', 10, 20, 1, 'dessert', 'cake-dinner-black-forest.jpg', 'dinner', 'Black Forest Cake', 'No desc', 1, '2022-01-12 14:20:36'),
('cake02', 'cake', 12, 0, 0, 'dessert', 'cake-dinner-chocolate-cake.jpg', 'breakfast', 'Chocolate Cake', 'No desc', 1, '2022-01-12 14:20:36'),
('cake03', 'cake', 10, 0, 0, 'dessert', 'cake-dinner-matcha.jpg', 'breakfast', 'Matcha Cake', 'No desc', 1, '2022-01-12 14:20:36'),
('cake04', 'cake', 12, 0, 0, 'dessert', 'cake-dinner-funfetti.jpg', 'breakfast', 'Funfetti Cake', 'No desc', 1, '2022-01-12 14:20:36'),
('cupcake01', 'cupcake', 8, 0, 0, 'dessert', 'cupcake-breakfast-marshmallow.jpg', 'breakfast', 'Marshmallow Cupcake', 'No desc', 1, '2022-01-12 14:20:36'),
('cupcake02', 'cupcake', 9, 0, 0, 'dessert', 'cupcake-breakfast-snowflake.jpg', 'breakfast', 'Snowflake Cupcake', 'No desc', 1, '2022-01-12 14:20:36'),
('cupcake03', 'cupcake', 9, 0, 0, 'dessert', 'cupcake-breakfast-teacup.jpg', 'breakfast', 'Teacup Cupcake', 'No desc', 1, '2022-01-12 14:20:36'),
('cupcake04', 'cupcake', 10, 30, 1, 'dessert', 'cupcake.jpg', 'breakfast', 'Chocolate Cupcake', 'No desc', 1, '2022-01-12 14:20:36'),
('france01', 'france', 15, 40, 1, 'france', 'france-dinner-boeuf-bourguignon.jpg', 'dinner', 'Boeuf Bourguignon', 'No desc', 1, '2022-01-12 14:20:36'),
('france02', 'france', 18, 0, 0, 'france', 'france-dinner-cassoulet.jpg', 'lunch', 'Cassoulet', 'No desc', 1, '2022-01-12 14:20:36'),
('france03', 'france', 10, 20, 1, 'france', 'france-dinner-quiche-lorraine.jpg', 'lunch', 'Quiche Lorraine', 'No desc', 1, '2022-01-12 14:20:36'),
('france04', 'france', 15, 20, 1, 'france', 'france-lunch-croque-monsieur.jpg', 'lunch', 'Croque Monsieur', 'No desc', 1, '2022-01-12 14:20:36'),
('france05', 'france', 8, 0, 0, 'france', 'franch-breakfast-concombre-menthe.jpg', 'breakfast', 'Concombre Menthe', 'No desc', 1, '2022-01-12 14:20:36'),
('mostfav01', 'mostfavor', 20, 50, 1, 'mostfavor', 'bbq.jpg', 'dinner', 'BBQ', 'No desc', 1, '2022-01-12 14:20:36'),
('mostfav02', 'mostfavor', 40, 30, 1, 'mostfavor', 'lamb-red-wine.jpg', 'dinner', 'Lamb Red Wine Sauces', 'No desc', 1, '2022-01-12 14:20:36'),
('mostfav03', 'mostfavor', 15, 40, 1, 'mostfavor', 'italia-dishes-1.jpg', 'dinner', 'Italia Dishes', 'No desc', 1, '2022-01-12 14:20:36'),
('mostfav04', 'mostfavor', 25, 20, 1, 'mostfavor', 'most-lunch-spinach-falafel.webp', 'lunch', 'Spinach Falafel', 'No desc', 1, '2022-01-12 14:20:36'),
('mostfav05', 'mostfavor', 20, 50, 1, 'mostfavor', 'lunch-BBQ-salad.jpg', 'lunch', 'BBQ Salad', 'No desc', 1, '2022-01-12 14:20:36'),
('muffin01', 'muffin', 4, 0, 0, 'dessert', 'muffin-breakfast-banana_carrot.jpg', 'breakfast', 'Banana Carrot Muffin', 'No desc', 1, '2022-01-12 14:20:36'),
('muffin02', 'muffin', 5, 20, 1, 'dessert', 'muffin-breakfast-quinoa-plum.jpg', 'breakfast', 'Quinoa Plum Muffin', 'No desc', 1, '2022-01-12 14:20:36'),
('muffin03', 'muffin', 5, 0, 0, 'dessert', 'muffin-breakfast-blueberry-muffins.jpg', 'breakfast', 'Blueberry Muffin', 'No desc', 1, '2022-01-12 14:20:36'),
('muffin04', 'muffin', 5, 0, 0, 'dessert', 'muffin-breakfast-cranberry-apple-carrot.jpg', 'breakfast', 'Craberry Apple Muffin', 'No desc', 1, '2022-01-12 14:20:36'),
('pasta01', 'italianood', 15, 0, 0, 'italia', 'pasta-breakfast-shrimp-fettuccine-alfredo.jpeg', 'breakfast', 'Shrimp Fettuccine Alfredo Pasta', 'No desc', 1, '2022-01-12 14:20:36'),
('pasta02', 'italianood', 12, 20, 1, 'italia', 'italian-lunch-avocado-pasta.jpg', 'lunch', 'Avocado Pasta', 'No desc', 1, '2022-01-12 14:20:36'),
('pasta03', 'italianood', 15, 0, 0, 'italia', 'italian-lunch-storecupboard-pasta.jpg', 'dinner', 'Storecupboard Pasta', 'No desc', 1, '2022-01-12 14:20:36'),
('pasta04', 'italianood', 10, 0, 0, 'italia', 'pasta-breakfast-alla-vodka.jpg', 'breakfast', 'Alla Vodka Pasta', 'No desc', 1, '2022-01-12 14:20:36'),
('pasta05', 'italianood', 12, 0, 0, 'italia', 'pasta-breakfast-bucatini-allamatriciana.jpg', 'breakfast', 'Bucatini Allamatriciana Pasta', 'No desc', 1, '2022-01-12 14:20:36'),
('redwine', 'wine', 50, 10, 1, 'drink', 'red-wine.jpg', 'dinner', 'Red Wine', 'No desc', 1, '2022-01-12 14:20:36'),
('soup01', 'soup', 8, 0, 0, 'dessert', 'soup-lunch-lentil-soup.jpg', 'lunch', 'Lentil Soup', 'No desc', 1, '2022-01-12 14:20:36'),
('soup02', 'soup', 10, 0, 0, 'dessert', 'soup-lunch-vegatable-soup.jpg', 'lunch', 'Vegatable Soup', 'No desc', 1, '2022-01-12 14:20:36'),
('spaghetti', 'italianood', 10, 0, 0, 'italia', 'spaghetti.jpg', 'dinner', 'Spaghetti', 'No desc', 1, '2022-01-12 14:20:36'),
('vietnoo01', 'vietnoodle', 10, 0, 0, 'vietnam', 'noodles-breakfast-bun-bo-hue.jpg', 'breakfast', 'Bun Bo Hue', 'No desc', 1, '2022-01-12 14:20:36'),
('vietnoo02', 'vietnoodle', 12, 0, 0, 'vietnam', 'noodles-breakfast-bun-cha.jpg', 'breakfast', 'Bun Cha', 'No desc', 1, '2022-01-12 14:20:36'),
('vietnoo03', 'vietnoodle', 10, 0, 0, 'vietnam', 'noodles-breakfast-bun-rieu.jpg', 'breakfast', 'Bun Rieu', 'No desc', 1, '2022-01-12 14:20:36'),
('vietnoo04', 'vietnoodle', 15, 20, 1, 'vietnam', 'noodles-breakfast-pho.jpg', 'breakfast', 'Pho', 'No desc', 1, '2022-01-12 14:20:36');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `visible_id` varchar(21) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `login_by` enum('email','google','facebook','') NOT NULL DEFAULT 'email',
  `role` enum('superuser','manager','chef','manager','customer') NOT NULL DEFAULT 'customer',
  `is_admin` tinyint(4) NOT NULL DEFAULT 0,
  `is_confirmed` tinyint(4) NOT NULL DEFAULT 0,
  `is_logged` tinyint(4) NOT NULL DEFAULT 0,
  `latest_logged_in` datetime NOT NULL DEFAULT current_timestamp(),
  `address` varchar(200) DEFAULT NULL,
  `phone` varchar(11) DEFAULT NULL,
  `balance` int(11) NOT NULL DEFAULT 0,
  `total_saving` float NOT NULL DEFAULT 0,
  `avatar` varchar(100) NOT NULL DEFAULT 'user_avatar'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONSHIPS FOR TABLE `users`:
--

--
-- Dumping data for table `users`
--

INSERT DELAYED INTO `users` (`visible_id`, `username`, `password`, `email`, `login_by`, `role`, `is_admin`, `is_confirmed`, `is_logged`, `latest_logged_in`, `address`, `phone`, `balance`, `total_saving`, `avatar`) VALUES
('111157150398778491825', 'Đình Khôi', NULL, 'khoip1305@gmail.com', 'google', 'customer', 0, 0, 1, '2022-01-10 20:30:03', NULL, NULL, 0, 0, 'user_avatar'),
('G1EaMu9R05', 'DinhKhoiDepTr', '$2a$10$SoAyJhg.1J952Cmuf4flxu1CALNi1KdIsRE9CKo8eSLtpsgPR524y', 'khoib1805777@student.ctu.edu.vn', 'email', 'customer', 0, 1, 1, '2022-01-09 00:00:00', NULL, NULL, 0, 0, 'user_avatar');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`visible_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `discounted_dishes`
--
ALTER TABLE `discounted_dishes`
  ADD PRIMARY KEY (`visible_id`),
  ADD KEY `discount_id` (`discount_id`),
  ADD KEY `dish_id` (`dish_id`);

--
-- Indexes for table `discounts`
--
ALTER TABLE `discounts`
  ADD PRIMARY KEY (`visible_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`visible_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`visible_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`visible_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`visible_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `root_category` (`root_category`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`visible_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`visible_id`);

--
-- Constraints for table `discounted_dishes`
--
ALTER TABLE `discounted_dishes`
  ADD CONSTRAINT `discounted_dishes_ibfk_1` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`visible_id`),
  ADD CONSTRAINT `discounted_dishes_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `products` (`visible_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`visible_id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`visible_id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`visible_id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`visible_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`visible_id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`root_category`) REFERENCES `categories` (`visible_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
