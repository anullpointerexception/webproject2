-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 21. Apr 2022 um 15:34
-- Server-Version: 10.4.21-MariaDB
-- PHP-Version: 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `appointmentorganizer`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `location` varchar(200) NOT NULL,
  `expirationdate` datetime NOT NULL,
  `duration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `appointments`
--

INSERT INTO `appointments` (`id`, `title`, `location`, `expirationdate`, `duration`) VALUES
(1, 'Test', 'Wien', '0000-00-00 00:00:00', 0),
(2, 'Test2', 'Brixen', '0000-00-00 00:00:00', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `appointment_choices`
--

CREATE TABLE `appointment_choices` (
  `id` int(11) NOT NULL,
  `appointmentid` int(11) NOT NULL,
  `termin` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `userchoice`
--

CREATE TABLE `userchoice` (
  `userid` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `terminid` int(11) NOT NULL,
  `comment` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `appointment_choices`
--
ALTER TABLE `appointment_choices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointmentid` (`appointmentid`);

--
-- Indizes für die Tabelle `userchoice`
--
ALTER TABLE `userchoice`
  ADD PRIMARY KEY (`userid`),
  ADD KEY `terminid` (`terminid`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `appointment_choices`
--
ALTER TABLE `appointment_choices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `userchoice`
--
ALTER TABLE `userchoice`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `appointment_choices`
--
ALTER TABLE `appointment_choices`
  ADD CONSTRAINT `appointment_choices_ibfk_1` FOREIGN KEY (`appointmentid`) REFERENCES `appointments` (`id`);

--
-- Constraints der Tabelle `userchoice`
--
ALTER TABLE `userchoice`
  ADD CONSTRAINT `userchoice_ibfk_1` FOREIGN KEY (`terminid`) REFERENCES `appointment_choices` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
