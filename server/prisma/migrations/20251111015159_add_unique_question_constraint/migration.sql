/*
  Warnings:

  - A unique constraint covering the columns `[text,jobTrackId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Question_text_jobTrackId_key" ON "Question"("text", "jobTrackId");
