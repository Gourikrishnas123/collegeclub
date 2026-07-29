const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log('Could not set custom DNS servers');
}

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Club = require('./models/Club');
const Transaction = require('./models/Transaction');
const GalleryEvent = require('./models/GalleryEvent');
const Notice = require('./models/Notice');

const seedData = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      console.error('MONGO_URI missing in .env file!');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Club.deleteMany({});
    await Transaction.deleteMany({});
    await GalleryEvent.deleteMany({});
    await Notice.deleteMany({});
    console.log('🧹 Cleared existing database records.');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // 1. Create Super Admin
    const superAdmin = await User.create({
      name: 'Dr. Alex Vance (Dean)',
      email: 'admin@college.edu',
      passwordHash,
      role: 'super_admin',
      clubId: null,
      year: 'Faculty'
    });
    console.log('👤 Created Super Admin: admin@college.edu / password123');

    // 2. Create Sample Clubs
    const clubs = await Club.insertMany([
      {
        name: 'Computer Science Society',
        department: 'Computer Engineering',
        mark: 'CS',
        description: 'Official student organization driving coding competitions, hackathons, and software dev workshops.',
        budgetTotal: 15000,
        budgetSpent: 0,
        isActive: true
      },
      {
        name: 'Robotics & Automation Club',
        department: 'Electrical & Mechatronics',
        mark: 'RO',
        description: 'Pioneering autonomous robots, combat bots, and IoT hardware projects for national expos.',
        budgetTotal: 25000,
        budgetSpent: 0,
        isActive: true
      },
      {
        name: 'Mechanical Innovators Guild',
        department: 'Mechanical Engineering',
        mark: 'ME',
        description: 'Design, CAD modeling, Formula Student vehicle building, and thermal engineering research.',
        budgetTotal: 18000,
        budgetSpent: 0,
        isActive: true
      },
      {
        name: 'Design & Creative Media Club',
        department: 'Arts & Design',
        mark: 'DS',
        description: 'UI/UX design, digital art, videography, branding, and motion graphics for campus events.',
        budgetTotal: 12000,
        budgetSpent: 0,
        isActive: true
      }
    ]);

    const csClub = clubs[0];
    const roClub = clubs[1];
    const meClub = clubs[2];
    const dsClub = clubs[3];

    // 3. Create Club Admins & Members
    const csAdmin = await User.create({
      name: 'Elena Rostova',
      email: 'cs_admin@college.edu',
      passwordHash,
      role: 'club_admin',
      clubId: csClub._id,
      year: '4th Year'
    });

    const csMember1 = await User.create({
      name: 'Julian Thorne',
      email: 'cs_member@college.edu',
      passwordHash,
      role: 'member',
      clubId: csClub._id,
      year: '3rd Year'
    });

    const csMember2 = await User.create({
      name: 'Sarah Connor',
      email: 'cs_member2@college.edu',
      passwordHash,
      role: 'member',
      clubId: csClub._id,
      year: '2nd Year'
    });

    const roAdmin = await User.create({
      name: 'Marcus Brody',
      email: 'ro_admin@college.edu',
      passwordHash,
      role: 'club_admin',
      clubId: roClub._id,
      year: '4th Year'
    });

    const meAdmin = await User.create({
      name: 'David Miller',
      email: 'me_admin@college.edu',
      passwordHash,
      role: 'club_admin',
      clubId: meClub._id,
      year: '3rd Year'
    });

    const dsAdmin = await User.create({
      name: 'Sophia Chen',
      email: 'ds_admin@college.edu',
      passwordHash,
      role: 'club_admin',
      clubId: dsClub._id,
      year: '3rd Year'
    });

    console.log('👥 Created Club Admins and Members.');

    // 4. Create Transactions & Update budgetSpent
    const csTransactions = [
      {
        clubId: csClub._id,
        description: 'Sponsorship intake from TechCorp Inc.',
        category: 'Sponsorship',
        type: 'in',
        amount: 8000,
        addedBy: csAdmin._id,
        date: new Date('2026-06-10')
      },
      {
        clubId: csClub._id,
        description: 'Microcontrollers & Sensors for IoT Workshop',
        category: 'Equipment',
        type: 'out',
        amount: 3200,
        addedBy: csAdmin._id,
        date: new Date('2026-06-15')
      },
      {
        clubId: csClub._id,
        description: 'Auditorium Booking for Hackathon',
        category: 'Venue',
        type: 'out',
        amount: 4500,
        addedBy: csAdmin._id,
        date: new Date('2026-07-01')
      },
      {
        clubId: csClub._id,
        description: 'Catering & Refreshments for Participants',
        category: 'Supplies',
        type: 'out',
        amount: 2800,
        addedBy: csAdmin._id,
        date: new Date('2026-07-12')
      }
    ];

    await Transaction.insertMany(csTransactions);
    // CS spent: 3200 + 4500 + 2800 = 10500 out of 15000 (70% utilization)
    await Club.findByIdAndUpdate(csClub._id, { budgetSpent: 10500 });

    // RO Transactions (High spend to trigger > 90% utilization warning)
    const roTransactions = [
      {
        clubId: roClub._id,
        description: '3D Printer Filament & High-Torque Stepper Motors',
        category: 'Equipment',
        type: 'out',
        amount: 18500,
        addedBy: roAdmin._id,
        date: new Date('2026-06-20')
      },
      {
        clubId: roClub._id,
        description: 'RoboWars Battle Arena Construction Materials',
        category: 'Venue',
        type: 'out',
        amount: 4800,
        addedBy: roAdmin._id,
        date: new Date('2026-07-05')
      }
    ];

    await Transaction.insertMany(roTransactions);
    // RO spent: 18500 + 4800 = 23300 out of 25000 (93.2% utilization -> RED WARNING)
    await Club.findByIdAndUpdate(roClub._id, { budgetSpent: 23300 });

    console.log('💰 Seeded transactions and calculated budget utilization.');

    // 5. Create Notices
    await Notice.insertMany([
      {
        clubId: csClub._id,
        title: 'MANDATORY GENERAL BODY MEETING FOR HACKATHON 2026',
        body: 'All computer science club members must attend the strategic planning session for the upcoming 48-hour hackathon. Attendance will be recorded.',
        tag: 'Urgent',
        pinned: true,
        postedBy: csAdmin._id,
        createdAt: new Date('2026-07-28')
      },
      {
        clubId: csClub._id,
        title: 'Call for Mentors: Intro to Rust Workshop',
        body: 'We are looking for senior members to co-host the upcoming Rust programming workshop series next month. Submit your session plan to Elena.',
        tag: 'Events',
        pinned: true,
        postedBy: csAdmin._id,
        createdAt: new Date('2026-07-25')
      },
      {
        clubId: csClub._id,
        title: 'Q2 Financial Audit & Project Reimbursement Guidelines',
        body: 'All team leads submitting receipts for components purchased during the summer break must submit claims before Friday 5 PM.',
        tag: 'Finance',
        pinned: false,
        postedBy: csAdmin._id,
        createdAt: new Date('2026-07-20')
      },
      {
        clubId: roClub._id,
        title: 'URGENT: SAFETY INSPECTION FOR ROBOWARS BOTS',
        body: 'All pneumatic and spinner weapon bots must undergo technical safety clearance before entering the arena test bench.',
        tag: 'Urgent',
        pinned: true,
        postedBy: roAdmin._id,
        createdAt: new Date('2026-07-27')
      }
    ]);

    console.log('📌 Seeded notices with pinned and urgent statuses.');

    // 6. Create Gallery Events
    await GalleryEvent.insertMany([
      {
        clubId: csClub._id,
        title: 'CodeCraft 2026 Annual Hackathon',
        description: '48 hours of uninterrupted coding, pitch sessions, and product showcases with industry judges.',
        date: new Date('2026-06-15'),
        images: [
          { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80', caption: 'Teams debugging during midnight sprint' },
          { url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80', caption: 'Winning team presenting their AI application' }
        ],
        createdBy: csAdmin._id
      },
      {
        clubId: csClub._id,
        title: 'Cloud Architecture & Kubernetes Workshop',
        description: 'Hands-on training session covering container orchestration and microservice deployment.',
        date: new Date('2026-05-10'),
        images: [
          { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', caption: 'Hands-on lab session with lab computers' }
        ],
        createdBy: csAdmin._id
      },
      {
        clubId: roClub._id,
        title: 'National RoboWars Championship',
        description: 'High-intensity heavyweight combat robot tournament hosted in the campus quad.',
        date: new Date('2026-07-08'),
        images: [
          { url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', caption: 'Team testing custom titanium chassis' }
        ],
        createdBy: roAdmin._id
      }
    ]);

    console.log('🖼️ Seeded gallery events.');
    console.log('🎉 Seeding complete! Database is ready.');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
