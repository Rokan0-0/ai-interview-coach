// In server/prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// A helper function to "upsert" tracks and questions
// This prevents creating duplicates if we run the seed file multiple times
async function seedTrack(trackName, questions) {
  const track = await prisma.jobTrack.upsert({
    where: { name: trackName },
    update: {},
    create: { name: trackName },
  });

  console.log(`Upserted track: ${track.name} (ID: ${track.id})`);

  for (const q of questions) {
    await prisma.question.upsert({
      where: {
        // This is a way to find a "unique" question
        text_jobTrackId: {
          text: q,
          jobTrackId: track.id,
        },
      },
      update: {},
      create: {
        text: q,
        jobTrackId: track.id,
      },
    });
  }
  console.log(` -> Added ${questions.length} questions.`);
}

async function main() {
  console.log('Start seeding...');

  // --- 1. Software Engineer ---
  await seedTrack('Software Engineer', [
    'Tell me about a time you faced a difficult technical challenge and how you solved it.',
    'Describe a project where you had to work with a difficult team member. What was the situation and how did you handle it?',
    'How do you stay up-to-date with the latest technologies and trends in software development?',
    'Explain the difference between monolith and microservices architecture. When would you use each?',
    'Describe your process for debugging a complex issue.',
    'What is SOLID, and why is it important?',
  ]);

  // --- 2. Product Manager ---
  await seedTrack('Product Manager', [
    'Tell me about a project that was failing. What steps did you take to get it back on track?',
    'How do you handle scope creep and manage stakeholder expectations?',
    'Describe your process for prioritizing features for a new product.',
    'How would you measure the success of a new feature after launch?',
    'Tell me about a time you had to make a decision with incomplete data.',
  ]);

  // --- 3. Data Analyst ---
  await seedTrack('Data Analyst', [
    'Tell me about a time you used data to influence a business decision.',
    'How would you explain a p-value to a non-technical stakeholder?',
    'Describe a complex SQL query you had to write and what it was for.',
    'What is your process for cleaning a large, messy dataset?',
    'What are the differences between JOIN and UNION in SQL?',
  ]);

  // --- 4. UX/UI Designer ---
  await seedTrack('UX/UI Designer', [
    'Walk me through a project in your portfolio that you are most proud of.',
    'How do you handle negative feedback on one of your designs?',
    'What is the difference between user-centered design and human-centered design?',
    'Describe your process for conducting user research.',
    'Tell me about a time you had to balance user needs with business goals.',
  ]);

  // --- 5. DevOps Engineer ---
  await seedTrack('DevOps Engineer', [
    'What is your understanding of "Infrastructure as Code" (IaC) and what tools have you used?',
    'Explain your process for setting up a CI/CD pipeline.',
    'How would you monitor the health and performance of a production application?',
    'What is Kubernetes, and why is it used?',
    'Describe a time you had to respond to a production outage.',
  ]);
  
  // --- 6. Cybersecurity Analyst ---
  await seedTrack('Cybersecurity Analyst', [
    'What is the difference between a vulnerability and an exploit?',
    'How would you respond to a suspected phishing attack on an employee?',
    'Explain the concept of "defense in depth".',
    'What are the key components of a good incident response plan?',
    'What is the MITRE ATT&CK framework?',
  ]);

  // --- 7. Digital Marketer ---
  await seedTrack('Digital Marketer', [
    'Describe a successful marketing campaign you managed from start to finish.',
    'How do you measure the ROI of a social media campaign?',
    'What is SEO, and why is it important?',
    'How would you approach creating a content strategy for a new brand?',
    'What is the difference between CPC and CPM?',
  ]);

  console.log('Seeding finished.');
}

// Boilerplate to run the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

