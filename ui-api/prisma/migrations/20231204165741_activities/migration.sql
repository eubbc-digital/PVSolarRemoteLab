-- CreateTable
CREATE TABLE `User` (
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `verifiedToken` VARCHAR(191) NULL,
    `tokenExpiry` DATETIME(3) NULL,
    `isVerified` BOOLEAN NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userEmail` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Student_userEmail_key`(`userEmail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userEmail` VARCHAR(191) NOT NULL,
    `authorized` BOOLEAN NOT NULL,

    UNIQUE INDEX `Teacher_userEmail_key`(`userEmail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `teacherId` VARCHAR(191) NULL,
    `startDate` VARCHAR(191) NOT NULL,
    `endDate` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Request` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `courseId` INTEGER NULL,
    `studentEmail` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Experiment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `experimentDate` VARCHAR(191) NOT NULL,
    `experimentTime` VARCHAR(191) NOT NULL,
    `timezone` VARCHAR(191) NOT NULL,
    `studentEmail` VARCHAR(191) NULL,
    `courseId` INTEGER NULL,
    `modified` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CityLab` (
    `id` VARCHAR(191) NOT NULL,
    `departmentName` VARCHAR(191) NOT NULL,
    `experimentId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Activity` (
    `id` VARCHAR(191) NOT NULL,
    `activityNumber` INTEGER NOT NULL,
    `panelAngle` INTEGER NULL,
    `temperature` DOUBLE NULL,
    `power` DOUBLE NULL,
    `efficiencyPorcentaje` DOUBLE NULL,
    `optimalAngle` DOUBLE NULL,
    `uvaRadiation` DOUBLE NULL,
    `radiation` DOUBLE NULL,
    `cityLabId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EfficiencyCurve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activityId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EfficiencyRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `current` DOUBLE NOT NULL,
    `voltage` DOUBLE NOT NULL,
    `power` DOUBLE NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `degree` INTEGER NULL,
    `radiation` DOUBLE NULL,
    `temperature` DOUBLE NULL,
    `datetime` DATETIME(3) NULL,
    `timestamp` VARCHAR(191) NULL,
    `uvaRadiation` DOUBLE NULL,
    `efficiencyCurveId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Datalogger` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datetime` VARCHAR(191) NOT NULL,
    `record` INTEGER NOT NULL,
    `solarRadiationCMP` DOUBLE NULL,
    `solarRadiationCMPAvg` DOUBLE NULL,
    `uvaRadiationLP` DOUBLE NULL,
    `uvaRadiationLPAvg` DOUBLE NULL,
    `batteryVoltage` DOUBLE NULL,
    `voltage` DOUBLE NULL,
    `current` DOUBLE NULL,
    `solarRadiationCS320` DOUBLE NULL,
    `uvaRadiationSU202` DOUBLE NULL,
    `uvaRadiationSU202Avg` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataloggerLPZ` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datetime` VARCHAR(191) NOT NULL,
    `record` INTEGER NOT NULL,
    `solarRadiationCS320` DOUBLE NULL,
    `solarRadiationCS320Avg` DOUBLE NULL,
    `uvaRadiationSU202` DOUBLE NULL,
    `uvaRadiationSU202Avg` DOUBLE NULL,
    `voltage` DOUBLE NULL,
    `current` DOUBLE NULL,
    `angle` DOUBLE NULL,
    `batteryVoltage` DOUBLE NULL,
    `tempDL` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataloggerSCZ` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datetime` VARCHAR(191) NOT NULL,
    `record` INTEGER NOT NULL,
    `solarRadiationCS320` DOUBLE NULL,
    `solarRadiationCS320Avg` DOUBLE NULL,
    `uvaRadiationSU202` DOUBLE NULL,
    `uvaRadiationSU202Avg` DOUBLE NULL,
    `voltage` DOUBLE NULL,
    `current` DOUBLE NULL,
    `angle` DOUBLE NULL,
    `batteryVoltage` DOUBLE NULL,
    `tempDL` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CourseToStudent` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CourseToStudent_AB_unique`(`A`, `B`),
    INDEX `_CourseToStudent_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`userEmail`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_studentEmail_fkey` FOREIGN KEY (`studentEmail`) REFERENCES `Student`(`userEmail`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experiment` ADD CONSTRAINT `Experiment_studentEmail_fkey` FOREIGN KEY (`studentEmail`) REFERENCES `Student`(`userEmail`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experiment` ADD CONSTRAINT `Experiment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CityLab` ADD CONSTRAINT `CityLab_experimentId_fkey` FOREIGN KEY (`experimentId`) REFERENCES `Experiment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_cityLabId_fkey` FOREIGN KEY (`cityLabId`) REFERENCES `CityLab`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EfficiencyCurve` ADD CONSTRAINT `EfficiencyCurve_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EfficiencyRecord` ADD CONSTRAINT `EfficiencyRecord_efficiencyCurveId_fkey` FOREIGN KEY (`efficiencyCurveId`) REFERENCES `EfficiencyCurve`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToStudent` ADD CONSTRAINT `_CourseToStudent_A_fkey` FOREIGN KEY (`A`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToStudent` ADD CONSTRAINT `_CourseToStudent_B_fkey` FOREIGN KEY (`B`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
