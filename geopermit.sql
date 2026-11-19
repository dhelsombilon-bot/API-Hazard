-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 19, 2026 at 03:35 AM
-- Server version: 8.0.44
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `geopermit`
--

-- --------------------------------------------------------

--
-- Table structure for table `barangays`
--

CREATE TABLE `barangays` (
  `barangay_id` bigint UNSIGNED NOT NULL,
  `barangay_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `buildings`
--

CREATE TABLE `buildings` (
  `building_id` bigint UNSIGNED NOT NULL,
  `building_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `building_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `building_type_id` bigint UNSIGNED NOT NULL,
  `building_status_id` bigint UNSIGNED NOT NULL,
  `barangay_id` bigint UNSIGNED NOT NULL,
  `street_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `managing_office` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year_built` smallint DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `elevation_m` decimal(8,2) DEFAULT NULL,
  `coordinate_source` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `verified_by` bigint UNSIGNED DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `building_activity_logs`
--

CREATE TABLE `building_activity_logs` (
  `log_id` bigint UNSIGNED NOT NULL,
  `building_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'building',
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `building_hazard_assessments`
--

CREATE TABLE `building_hazard_assessments` (
  `hazard_assessment_id` bigint UNSIGNED NOT NULL,
  `building_id` bigint UNSIGNED NOT NULL,
  `hazard_type_id` bigint UNSIGNED NOT NULL,
  `hazard_level` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataset_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assessment_date` date DEFAULT NULL,
  `assessment_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `building_landscape_features`
--

CREATE TABLE `building_landscape_features` (
  `assessment_id` bigint UNSIGNED NOT NULL,
  `building_id` bigint UNSIGNED NOT NULL,
  `feature_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `feature_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distance_m` int DEFAULT NULL,
  `assessment_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `building_statuses`
--

CREATE TABLE `building_statuses` (
  `building_status_id` bigint UNSIGNED NOT NULL,
  `status_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `building_types`
--

CREATE TABLE `building_types` (
  `building_type_id` bigint UNSIGNED NOT NULL,
  `type_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document_types`
--

CREATE TABLE `document_types` (
  `document_type_id` bigint UNSIGNED NOT NULL,
  `document_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_required` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hazard_layers`
--

CREATE TABLE `hazard_layers` (
  `layer_id` bigint UNSIGNED NOT NULL,
  `hazard_type_id` bigint UNSIGNED NOT NULL,
  `dataset_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_agency` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_year` year DEFAULT NULL,
  `geojson` longtext COLLATE utf8mb4_unicode_ci,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hazard_levels`
--

CREATE TABLE `hazard_levels` (
  `hazard_level_id` bigint UNSIGNED NOT NULL,
  `level_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `severity_order` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hazard_types`
--

CREATE TABLE `hazard_types` (
  `hazard_type_id` bigint UNSIGNED NOT NULL,
  `hazard_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_10_26_000001_create_roles_table', 1),
(5, '2026_10_26_000002_create_lookup_tables', 1),
(6, '2026_10_26_000003_create_buildings_table', 1),
(7, '2026_10_26_000004_create_permits_table', 1),
(8, '2026_10_26_000005_create_hazard_layers_and_reports_table', 1),
(9, '2026_10_26_140618_create_personal_access_tokens_table', 1),
(10, '2026_11_14_000001_create_notification_reads_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notification_reads`
--

CREATE TABLE `notification_reads` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `notification_key` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permits`
--

CREATE TABLE `permits` (
  `permit_id` bigint UNSIGNED NOT NULL,
  `permit_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `building_id` bigint UNSIGNED NOT NULL,
  `permit_type_id` bigint UNSIGNED NOT NULL,
  `permit_status_id` bigint UNSIGNED NOT NULL,
  `issue_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `issuing_authority` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permit_fee_amount` decimal(12,2) DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `recorded_by` bigint UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permit_compliance_checks`
--

CREATE TABLE `permit_compliance_checks` (
  `check_id` bigint UNSIGNED NOT NULL,
  `permit_id` bigint UNSIGNED NOT NULL,
  `check_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `result` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `checked_by` bigint UNSIGNED DEFAULT NULL,
  `checked_at` timestamp NULL DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permit_documents`
--

CREATE TABLE `permit_documents` (
  `permit_document_id` bigint UNSIGNED NOT NULL,
  `permit_id` bigint UNSIGNED NOT NULL,
  `document_type_id` bigint UNSIGNED NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_reference` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_submitted` date DEFAULT NULL,
  `verification_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `uploaded_by` bigint UNSIGNED DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permit_findings`
--

CREATE TABLE `permit_findings` (
  `finding_id` bigint UNSIGNED NOT NULL,
  `permit_id` bigint UNSIGNED NOT NULL,
  `check_id` bigint UNSIGNED DEFAULT NULL,
  `severity` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Minor',
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Open',
  `reported_by` bigint UNSIGNED DEFAULT NULL,
  `reported_at` timestamp NULL DEFAULT NULL,
  `resolved_by` bigint UNSIGNED DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `resolution_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permit_statuses`
--

CREATE TABLE `permit_statuses` (
  `permit_status_id` bigint UNSIGNED NOT NULL,
  `status_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permit_types`
--

CREATE TABLE `permit_types` (
  `permit_type_id` bigint UNSIGNED NOT NULL,
  `type_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_id` bigint UNSIGNED NOT NULL,
  `report_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `generated_by` bigint UNSIGNED DEFAULT NULL,
  `generated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parameters` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` bigint UNSIGNED NOT NULL,
  `role_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED DEFAULT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barangays`
--
ALTER TABLE `barangays`
  ADD PRIMARY KEY (`barangay_id`),
  ADD UNIQUE KEY `barangays_barangay_name_unique` (`barangay_name`);

--
-- Indexes for table `buildings`
--
ALTER TABLE `buildings`
  ADD PRIMARY KEY (`building_id`),
  ADD UNIQUE KEY `buildings_building_code_unique` (`building_code`),
  ADD KEY `buildings_building_type_id_foreign` (`building_type_id`),
  ADD KEY `buildings_building_status_id_foreign` (`building_status_id`),
  ADD KEY `buildings_barangay_id_foreign` (`barangay_id`),
  ADD KEY `buildings_verified_by_foreign` (`verified_by`),
  ADD KEY `buildings_created_by_foreign` (`created_by`);

--
-- Indexes for table `building_activity_logs`
--
ALTER TABLE `building_activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `building_activity_logs_building_id_foreign` (`building_id`),
  ADD KEY `building_activity_logs_user_id_foreign` (`user_id`);

--
-- Indexes for table `building_hazard_assessments`
--
ALTER TABLE `building_hazard_assessments`
  ADD PRIMARY KEY (`hazard_assessment_id`),
  ADD KEY `building_hazard_assessments_building_id_foreign` (`building_id`),
  ADD KEY `building_hazard_assessments_hazard_type_id_foreign` (`hazard_type_id`);

--
-- Indexes for table `building_landscape_features`
--
ALTER TABLE `building_landscape_features`
  ADD PRIMARY KEY (`assessment_id`),
  ADD KEY `building_landscape_features_building_id_foreign` (`building_id`);

--
-- Indexes for table `building_statuses`
--
ALTER TABLE `building_statuses`
  ADD PRIMARY KEY (`building_status_id`),
  ADD UNIQUE KEY `building_statuses_status_name_unique` (`status_name`);

--
-- Indexes for table `building_types`
--
ALTER TABLE `building_types`
  ADD PRIMARY KEY (`building_type_id`),
  ADD UNIQUE KEY `building_types_type_name_unique` (`type_name`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `document_types`
--
ALTER TABLE `document_types`
  ADD PRIMARY KEY (`document_type_id`),
  ADD UNIQUE KEY `document_types_document_name_unique` (`document_name`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Indexes for table `hazard_layers`
--
ALTER TABLE `hazard_layers`
  ADD PRIMARY KEY (`layer_id`),
  ADD KEY `hazard_layers_hazard_type_id_foreign` (`hazard_type_id`);

--
-- Indexes for table `hazard_levels`
--
ALTER TABLE `hazard_levels`
  ADD PRIMARY KEY (`hazard_level_id`),
  ADD UNIQUE KEY `hazard_levels_level_name_unique` (`level_name`);

--
-- Indexes for table `hazard_types`
--
ALTER TABLE `hazard_types`
  ADD PRIMARY KEY (`hazard_type_id`),
  ADD UNIQUE KEY `hazard_types_hazard_name_unique` (`hazard_name`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification_reads`
--
ALTER TABLE `notification_reads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `notification_reads_user_id_notification_key_unique` (`user_id`,`notification_key`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `permits`
--
ALTER TABLE `permits`
  ADD PRIMARY KEY (`permit_id`),
  ADD UNIQUE KEY `permits_permit_number_unique` (`permit_number`),
  ADD KEY `permits_building_id_foreign` (`building_id`),
  ADD KEY `permits_permit_type_id_foreign` (`permit_type_id`),
  ADD KEY `permits_permit_status_id_foreign` (`permit_status_id`),
  ADD KEY `permits_recorded_by_foreign` (`recorded_by`);

--
-- Indexes for table `permit_compliance_checks`
--
ALTER TABLE `permit_compliance_checks`
  ADD PRIMARY KEY (`check_id`),
  ADD KEY `permit_compliance_checks_permit_id_foreign` (`permit_id`),
  ADD KEY `permit_compliance_checks_checked_by_foreign` (`checked_by`);

--
-- Indexes for table `permit_documents`
--
ALTER TABLE `permit_documents`
  ADD PRIMARY KEY (`permit_document_id`),
  ADD KEY `permit_documents_permit_id_foreign` (`permit_id`),
  ADD KEY `permit_documents_document_type_id_foreign` (`document_type_id`),
  ADD KEY `permit_documents_uploaded_by_foreign` (`uploaded_by`);

--
-- Indexes for table `permit_findings`
--
ALTER TABLE `permit_findings`
  ADD PRIMARY KEY (`finding_id`),
  ADD KEY `permit_findings_permit_id_foreign` (`permit_id`),
  ADD KEY `permit_findings_check_id_foreign` (`check_id`),
  ADD KEY `permit_findings_reported_by_foreign` (`reported_by`),
  ADD KEY `permit_findings_resolved_by_foreign` (`resolved_by`);

--
-- Indexes for table `permit_statuses`
--
ALTER TABLE `permit_statuses`
  ADD PRIMARY KEY (`permit_status_id`),
  ADD UNIQUE KEY `permit_statuses_status_name_unique` (`status_name`);

--
-- Indexes for table `permit_types`
--
ALTER TABLE `permit_types`
  ADD PRIMARY KEY (`permit_type_id`),
  ADD UNIQUE KEY `permit_types_type_name_unique` (`type_name`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `reports_generated_by_foreign` (`generated_by`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `roles_role_name_unique` (`role_name`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_id_foreign` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barangays`
--
ALTER TABLE `barangays`
  MODIFY `barangay_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `buildings`
--
ALTER TABLE `buildings`
  MODIFY `building_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `building_activity_logs`
--
ALTER TABLE `building_activity_logs`
  MODIFY `log_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `building_hazard_assessments`
--
ALTER TABLE `building_hazard_assessments`
  MODIFY `hazard_assessment_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `building_landscape_features`
--
ALTER TABLE `building_landscape_features`
  MODIFY `assessment_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `building_statuses`
--
ALTER TABLE `building_statuses`
  MODIFY `building_status_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `building_types`
--
ALTER TABLE `building_types`
  MODIFY `building_type_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `document_types`
--
ALTER TABLE `document_types`
  MODIFY `document_type_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hazard_layers`
--
ALTER TABLE `hazard_layers`
  MODIFY `layer_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hazard_levels`
--
ALTER TABLE `hazard_levels`
  MODIFY `hazard_level_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hazard_types`
--
ALTER TABLE `hazard_types`
  MODIFY `hazard_type_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `notification_reads`
--
ALTER TABLE `notification_reads`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permits`
--
ALTER TABLE `permits`
  MODIFY `permit_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permit_compliance_checks`
--
ALTER TABLE `permit_compliance_checks`
  MODIFY `check_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permit_documents`
--
ALTER TABLE `permit_documents`
  MODIFY `permit_document_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permit_findings`
--
ALTER TABLE `permit_findings`
  MODIFY `finding_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permit_statuses`
--
ALTER TABLE `permit_statuses`
  MODIFY `permit_status_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permit_types`
--
ALTER TABLE `permit_types`
  MODIFY `permit_type_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `buildings`
--
ALTER TABLE `buildings`
  ADD CONSTRAINT `buildings_barangay_id_foreign` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`barangay_id`),
  ADD CONSTRAINT `buildings_building_status_id_foreign` FOREIGN KEY (`building_status_id`) REFERENCES `building_statuses` (`building_status_id`),
  ADD CONSTRAINT `buildings_building_type_id_foreign` FOREIGN KEY (`building_type_id`) REFERENCES `building_types` (`building_type_id`),
  ADD CONSTRAINT `buildings_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `buildings_verified_by_foreign` FOREIGN KEY (`verified_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `building_activity_logs`
--
ALTER TABLE `building_activity_logs`
  ADD CONSTRAINT `building_activity_logs_building_id_foreign` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`building_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `building_activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `building_hazard_assessments`
--
ALTER TABLE `building_hazard_assessments`
  ADD CONSTRAINT `building_hazard_assessments_building_id_foreign` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`building_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `building_hazard_assessments_hazard_type_id_foreign` FOREIGN KEY (`hazard_type_id`) REFERENCES `hazard_types` (`hazard_type_id`);

--
-- Constraints for table `building_landscape_features`
--
ALTER TABLE `building_landscape_features`
  ADD CONSTRAINT `building_landscape_features_building_id_foreign` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`building_id`) ON DELETE CASCADE;

--
-- Constraints for table `hazard_layers`
--
ALTER TABLE `hazard_layers`
  ADD CONSTRAINT `hazard_layers_hazard_type_id_foreign` FOREIGN KEY (`hazard_type_id`) REFERENCES `hazard_types` (`hazard_type_id`);

--
-- Constraints for table `notification_reads`
--
ALTER TABLE `notification_reads`
  ADD CONSTRAINT `notification_reads_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `permits`
--
ALTER TABLE `permits`
  ADD CONSTRAINT `permits_building_id_foreign` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`building_id`),
  ADD CONSTRAINT `permits_permit_status_id_foreign` FOREIGN KEY (`permit_status_id`) REFERENCES `permit_statuses` (`permit_status_id`),
  ADD CONSTRAINT `permits_permit_type_id_foreign` FOREIGN KEY (`permit_type_id`) REFERENCES `permit_types` (`permit_type_id`),
  ADD CONSTRAINT `permits_recorded_by_foreign` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `permit_compliance_checks`
--
ALTER TABLE `permit_compliance_checks`
  ADD CONSTRAINT `permit_compliance_checks_checked_by_foreign` FOREIGN KEY (`checked_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `permit_compliance_checks_permit_id_foreign` FOREIGN KEY (`permit_id`) REFERENCES `permits` (`permit_id`) ON DELETE CASCADE;

--
-- Constraints for table `permit_documents`
--
ALTER TABLE `permit_documents`
  ADD CONSTRAINT `permit_documents_document_type_id_foreign` FOREIGN KEY (`document_type_id`) REFERENCES `document_types` (`document_type_id`),
  ADD CONSTRAINT `permit_documents_permit_id_foreign` FOREIGN KEY (`permit_id`) REFERENCES `permits` (`permit_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `permit_documents_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `permit_findings`
--
ALTER TABLE `permit_findings`
  ADD CONSTRAINT `permit_findings_check_id_foreign` FOREIGN KEY (`check_id`) REFERENCES `permit_compliance_checks` (`check_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `permit_findings_permit_id_foreign` FOREIGN KEY (`permit_id`) REFERENCES `permits` (`permit_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `permit_findings_reported_by_foreign` FOREIGN KEY (`reported_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `permit_findings_resolved_by_foreign` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_generated_by_foreign` FOREIGN KEY (`generated_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
