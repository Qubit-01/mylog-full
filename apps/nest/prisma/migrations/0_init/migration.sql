-- CreateTable
CREATE TABLE `log` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userid` INTEGER UNSIGNED NOT NULL,
    `type` VARCHAR(50) NOT NULL DEFAULT 'log',
    `sendtime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `logtime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `content` LONGTEXT NOT NULL,
    `tags` JSON NOT NULL,
    `imgs` JSON NOT NULL,
    `videos` JSON NOT NULL,
    `audios` JSON NOT NULL,
    `files` JSON NOT NULL,
    `location` JSON NOT NULL,
    `people` JSON NOT NULL,
    `info` JSON NOT NULL,

    INDEX `nor_type`(`type`),
    INDEX `nor_userid`(`userid`),
    FULLTEXT INDEX `fulltext_content`(`content`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relation` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userid` INTEGER UNSIGNED NOT NULL,
    `from` VARCHAR(255) NULL,
    `name` VARCHAR(255) NOT NULL,
    `info` JSON NULL,

    INDEX `nor_userid`(`userid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userid` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `img` TEXT NULL,
    `info` JSON NULL,
    `setting` JSON NULL,
    `createtime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uni_userid`(`userid`),
    UNIQUE INDEX `uni_name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userlogin` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `pswd` VARCHAR(255) NOT NULL,
    `unionid_qq` VARCHAR(255) NULL,
    `unionid_weixin` VARCHAR(255) NULL,

    UNIQUE INDEX `uni_name`(`name`),
    UNIQUE INDEX `uni_unionid_qq`(`unionid_qq`),
    UNIQUE INDEX `uni_unionid_weixin`(`unionid_weixin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `log` ADD CONSTRAINT `ref_log_user` FOREIGN KEY (`userid`) REFERENCES `userlogin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `relation` ADD CONSTRAINT `ref_relation_user` FOREIGN KEY (`userid`) REFERENCES `userlogin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `ref_user_user` FOREIGN KEY (`userid`) REFERENCES `userlogin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

