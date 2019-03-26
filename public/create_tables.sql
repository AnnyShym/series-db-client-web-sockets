
// create database

CREATE TABLE IF NOT EXISTS `actors` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `citizenship` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `series` (
  `title` varchar(50) NOT NULL,
  `country` varchar(50) DEFAULT NULL,
  `description` tinytext,
  `rating` enum('1','2','3','4','5') DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `IX_SERIES_TITLE` (`title`),
  KEY `IX_SERIES_RATING` (`rating`),
  KEY `IX_SERIES_COUNTRY` (`country`),
  KEY `country` (`country`,`rating`)
) ENGINE=MyISAM AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(50) NOT NULL,
  `password` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;

DROP TRIGGER IF EXISTS `TRG_Users_OnInsert`;
DELIMITER $$
CREATE TRIGGER `TRG_Users_OnInsert` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
  SET NEW.password = md5(NEW.password);
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `TRG_Users_OnUpdate`;
DELIMITER $$
CREATE TRIGGER `TRG_Users_OnUpdate` BEFORE UPDATE ON `users` FOR EACH ROW BEGIN
  SET NEW.password = md5(NEW.password);
END
$$
DELIMITER ;
COMMIT;
