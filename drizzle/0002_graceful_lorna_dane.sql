CREATE TABLE `partnership_contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`investorName` varchar(128) NOT NULL,
	`regionCode` varchar(32) NOT NULL,
	`investmentAmountOMR` varchar(64) NOT NULL,
	`sharePercent` varchar(32) NOT NULL,
	`signatureHash` text NOT NULL,
	`status` varchar(32) NOT NULL DEFAULT 'signed',
	`signedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partnership_contracts_id` PRIMARY KEY(`id`)
);
