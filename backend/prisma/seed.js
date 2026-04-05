import prisma from '../src/config/db.js';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('Clearing existing data...');
    await prisma.transaction.deleteMany();
    await prisma.user.deleteMany();

    console.log('Seeding Administrative Users...');
    
    // Hash passwords securely
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedAnalystPassword = await bcrypt.hash('analyst123', 10);
    const hashedViewerPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.create({
        data: {
            name: 'System Admin',
            email: 'admin@finance.com',
            passwordHash: hashedAdminPassword,
            role: 'ADMIN',
        }
    });

    const analyst = await prisma.user.create({
        data: {
            name: 'Data Analyst',
            email: 'analyst@finance.com',
            passwordHash: hashedAnalystPassword,
            role: 'ANALYST',
        }
    });

    const viewer = await prisma.user.create({
        data: {
            name: 'Test Viewer',
            email: 'viewer@finance.com',
            passwordHash: hashedViewerPassword,
            role: 'VIEWER',
        }
    });

    console.log('Seeding Sample Transactions for Dashboard...');
    
    // Generate some mock transactions over the last 7 days
    const tx = [
        { amount: 6500, type: 'INCOME', category: 'Salary', notes: 'Monthly Salary' },
        { amount: 1500, type: 'INCOME', category: 'Freelance', notes: 'React Project' },
        { amount: 250, type: 'EXPENSE', category: 'Food & Dining', notes: 'Weekend Groceries' },
        { amount: 60, type: 'EXPENSE', category: 'Transport', notes: 'Uber Rides' },
        { amount: 1200, type: 'EXPENSE', category: 'Housing', notes: 'Monthly Rent' },
        { amount: 85, type: 'EXPENSE', category: 'Utilities', notes: 'Fiber Internet' },
        { amount: 450, type: 'INCOME', category: 'Investment', notes: 'Stock dividends' }
    ];

    for (let i = 0; i < tx.length; i++) {
        let d = new Date();
        d.setDate(d.getDate() - i); // Distribute over the last 7 days for the chart
        await prisma.transaction.create({
            data: {
                ...tx[i],
                date: d,
                user: { connect: { id: admin.id } }
            }
        });
    }

    console.log('Database seeded successfully! ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
