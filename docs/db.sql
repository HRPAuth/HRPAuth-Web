-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2026-04-10 22:08:03
-- 服务器版本： 5.7.44-log
-- PHP 版本： 8.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `hademo`
--

-- --------------------------------------------------------

--
-- 表的结构 `profiles`
--

CREATE TABLE `profiles` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` enum('default','slim') COLLATE utf8mb4_unicode_ci DEFAULT 'default',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `profiles`
--

INSERT INTO `profiles` (`id`, `user_id`, `name`, `model`) VALUES
('demo-profile-1234567890abcdef', 'demo-uuid-1234567890abcdef', 'demoplayer', 'default');

-- --------------------------------------------------------

--
-- 表的结构 `profile_properties`
--

CREATE TABLE `profile_properties` (
  `id` int(11) NOT NULL,
  `profile_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `signature` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `profile_properties`
--

INSERT INTO `profile_properties` (`id`, `profile_id`, `name`, `value`) VALUES
(1, 'demo-profile-1234567890abcdef', 'textures', 'eyJ0aW1lc3RhbXAiOjE2MDAwMDAwMDAsInByb2ZpbGVJZCI6ImRlbW8tcHJvZmlsZS0xMjM0NTY3ODkwYWJjZGVmIiwicHJvZmlsZU5hbWUiOiJkZW1vcGxheWVyIiwidGV4dHVyZXMiOnsiU0tJTlMiOnsidXJsIjoiaHR0cDovL2F1dGguc2FtdWVsY2hlc3QuY29tL3RleHR1cmVzL3NraW4ucG5nIn19fQ==');

-- --------------------------------------------------------

--
-- 表的结构 `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `profile_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `server_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `access_token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `selected_profile_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issued_at` bigint(20) NOT NULL,
  `expires_in_days` int(11) DEFAULT '15',
  `state` enum('valid','temporarily_invalid','invalid') COLLATE utf8mb4_unicode_ci DEFAULT 'valid',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `tokens`
--

INSERT INTO `tokens` (`id`, `access_token`, `client_token`, `user_id`, `selected_profile_id`, `issued_at`, `expires_in_days`, `state`) VALUES
(1, 'demo-access-token-1234567890', 'demo-client-token-1234567890', 'demo-uuid-1234567890abcdef', 'demo-profile-1234567890abcdef', 1775826381372, 15, 'valid');

-- --------------------------------------------------------

--
-- 表的结构 `users`
--

CREATE TABLE `users` (
  `uid` int(10) UNSIGNED NOT NULL,
  `uuid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locale` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `avatar` int(11) NOT NULL DEFAULT '0',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_dark_mode` tinyint(1) NOT NULL DEFAULT '0',
  `permission` int(11) NOT NULL DEFAULT '0',
  `last_sign_at` datetime DEFAULT NULL,
  `register_at` datetime DEFAULT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `verification_token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastlogin` bigint(20) DEFAULT NULL,
  `x` double NOT NULL DEFAULT '0',
  `y` double NOT NULL DEFAULT '0',
  `z` double NOT NULL DEFAULT '0',
  `world` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'world',
  `regdate` bigint(20) NOT NULL DEFAULT '0',
  `regip` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `yaw` double(8,2) DEFAULT NULL,
  `pitch` double(8,2) DEFAULT NULL,
  `isLogged` smallint(6) NOT NULL DEFAULT '0',
  `hasSession` smallint(6) NOT NULL DEFAULT '0',
  `totp` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `users`
--

INSERT INTO `users` (`uid`, `uuid`, `email`, `username`, `password`, `verified`) VALUES
(1, 'demo-uuid-1234567890abcdef', 'user@samuelchest.com', 'demoplayer', '$2y$10$jt/H6Rmyh11rP7SHg/Ol9Oxp2W5pwf/XxvfpMKLoGA3i7y2bTZ7DK', 1);

-- --------------------------------------------------------

--
-- 表的结构 `user_properties`
--

CREATE TABLE `user_properties` (
  `id` int(11) NOT NULL,
  `user_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `signature` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `user_properties`
--

INSERT INTO `user_properties` (`id`, `user_id`, `name`, `value`) VALUES
(1, 'demo-uuid-1234567890abcdef', 'preferredLanguage', 'en_US');

--
-- 转储表的索引
--

--
-- 表的索引 `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_profiles_name` (`name`);

--
-- 表的索引 `profile_properties`
--
ALTER TABLE `profile_properties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profile_id` (`profile_id`);

--
-- 表的索引 `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profile_id` (`profile_id`),
  ADD KEY `idx_sessions_server_id` (`server_id`),
  ADD KEY `idx_sessions_expires_at` (`expires_at`);

--
-- 表的索引 `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `access_token` (`access_token`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `selected_profile_id` (`selected_profile_id`),
  ADD KEY `idx_tokens_access_token` (`access_token`),
  ADD KEY `idx_tokens_client_token` (`client_token`);

--
-- 表的索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`),
  ADD KEY `idx_uuid` (`uuid`);

--
-- 表的索引 `user_properties`
--
ALTER TABLE `user_properties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `profile_properties`
--
ALTER TABLE `profile_properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用表AUTO_INCREMENT `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- 使用表AUTO_INCREMENT `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用表AUTO_INCREMENT `user_properties`
--
ALTER TABLE `user_properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 限制导出的表
--

--
-- 限制表 `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`uuid`) ON DELETE CASCADE;

--
-- 限制表 `profile_properties`
--
ALTER TABLE `profile_properties`
  ADD CONSTRAINT `profile_properties_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE;

--
-- 限制表 `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE;

--
-- 限制表 `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`uuid`) ON DELETE CASCADE,
  ADD CONSTRAINT `tokens_ibfk_2` FOREIGN KEY (`selected_profile_id`) REFERENCES `profiles` (`id`) ON DELETE SET NULL;

--
-- 限制表 `user_properties`
--
ALTER TABLE `user_properties`
  ADD CONSTRAINT `user_properties_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`uuid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
