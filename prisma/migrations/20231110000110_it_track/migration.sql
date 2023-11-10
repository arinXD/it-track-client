/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `student` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` DROP COLUMN `updatedAt`,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
