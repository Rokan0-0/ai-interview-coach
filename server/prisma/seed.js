// In server/prisma/seed.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- Create Job Tracks ---
  const swe = await prisma.jobTrack.create({
    data: {
      name: 'Software Engineer',
    },
  });

  const pm = await prisma.jobTrack.create({
    data: {
      name: 'Project Manager',
    },
  });

  console.log('Created job tracks:', swe, pm);

  // --- Create SWE Questions ---
  await prisma.question.create({
    data: {
      text: 'Tell me about a time you faced a difficult technical challenge and how you solved it.',
      jobTrackId: swe.id,
    },
  });
  await prisma.question.create({
    data: {
      text: 'Describe a project where you had to work with a difficult team member. What was the situation and how did you handle it?',
      jobTrackId: swe.id,
    },
  });
  await prisma.question.create({
    data: {
      text: 'How do you stay up-to-date with the latest technologies and trends in software development?',
      jobTrackId: swe.id,
    },
  });

  // --- Create PM Questions ---
  await prisma.question.create({
    data: {
      text: 'Tell me about a project that was failing. What steps did you take to get it back on track?',
      jobTrackId: pm.id,
    },
  });
  await prisma.question.create({
    data: {
      text: 'How do you handle scope creep and manage stakeholder expectations?',
      jobTrackId: pm.id,
    },
  });

  console.log('Seeding finished.');
}

// This boilerplate runs the 'main' function and handles success/failure
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });