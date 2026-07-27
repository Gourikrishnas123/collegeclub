import { useMemo, useState } from 'react';

export const dashboardStats = [
  { label: 'Total Clubs', value: 6 },
  { label: 'Total Members', value: 181 },
  { label: 'Active Clubs', value: 5 },
  { label: 'Faculty Coordinators', value: 6 },
  { label: 'Upcoming Events', value: 4 },
  { label: 'Events Conducted', value: 18 },
  { label: 'Club Registrations', value: 62 },
  { label: 'Total Volunteers', value: 48 },
  { label: 'Total Budget', value: '₹101.7k' },
  { label: 'Total Expenses', value: '₹72.3k' },
  { label: 'Remaining Budget', value: '₹29.4k' },
  { label: 'Total Season Points', value: 368 },
  { label: 'Competitions Won', value: 9 },
  { label: 'Certificates Issued', value: 182 },
  { label: 'Blood Donation Camps', value: 4 },
  { label: 'Tree Plantation Drives', value: 5 },
  { label: 'Workshops Conducted', value: 11 },
  { label: 'Seminars Conducted', value: 7 },
  { label: 'Community Service Programs', value: 6 },
  { label: 'Active Announcements', value: 5 },
];

export const clubs = [
  {
    name: 'English Club',
    logo: 'EC',
    category: 'Language',
    coordinator: 'Miss Anjali',
    president: 'Amina',
    members: 32,
    events: 6,
    upcoming: 'Language Debate',
    attendance: 89,
    budget: 14000,
    expenses: 10400,
    points: 76,
    status: 'Active',
    color: 'from-sky-500 to-indigo-500',
  },
  {
    name: 'Malayalam Club',
    logo: 'MC',
    category: 'Arts',
    coordinator: 'Miss Nisha',
    president: 'Nikhil',
    members: 28,
    events: 5,
    upcoming: 'Cultural Night',
    attendance: 84,
    budget: 13000,
    expenses: 9800,
    points: 68,
    status: 'Active',
    color: 'from-purple-500 to-fuchsia-500',
  },
  {
    name: 'Maths Club',
    logo: 'MaC',
    category: 'STEM',
    coordinator: 'Miss Shalini',
    president: 'Arjun',
    members: 30,
    events: 7,
    upcoming: 'Quiz Championship',
    attendance: 92,
    budget: 15500,
    expenses: 11800,
    points: 81,
    status: 'Active',
    color: 'from-emerald-500 to-cyan-500',
  },
  {
    name: 'Science Club',
    logo: 'SC',
    category: 'Science',
    coordinator: 'Miss Kavitha',
    president: 'Faisal',
    members: 27,
    events: 6,
    upcoming: 'Innovation Expo',
    attendance: 87,
    budget: 16200,
    expenses: 12000,
    points: 82,
    status: 'Active',
    color: 'from-lime-500 to-emerald-500',
  },
  {
    name: 'Technical Club',
    logo: 'TC',
    category: 'Technology',
    coordinator: 'Miss Meera',
    president: 'Kavya',
    members: 35,
    events: 8,
    upcoming: 'Hackathon Sprint',
    attendance: 94,
    budget: 19000,
    expenses: 15000,
    points: 92,
    status: 'Active',
    color: 'from-blue-500 to-sky-500',
  },
  {
    name: 'Arts Club',
    logo: 'AC',
    category: 'Arts',
    coordinator: 'Miss Sadhana',
    president: 'Neha',
    members: 29,
    events: 5,
    upcoming: 'Art Showcase',
    attendance: 86,
    budget: 11800,
    expenses: 8600,
    points: 67,
    status: 'Active',
    color: 'from-pink-500 to-rose-500',
  },
];

export const upcomingEvents = [
  { name: 'Language Debate', club: 'English Club', date: '2026-08-12', time: '10:00 AM', venue: 'Auditorium', status: 'Open' },
  { name: 'Cultural Night', club: 'Malayalam Club', date: '2026-08-15', time: '06:00 PM', venue: 'Central Lawn', status: 'Open' },
  { name: 'Tech Hackathon', club: 'Technical Club', date: '2026-08-22', time: '09:00 AM', venue: 'Lab 4', status: 'Closing' },
  { name: 'Innovation Expo', club: 'Science Club', date: '2026-08-28', time: '11:00 AM', venue: 'Hall B', status: 'Open' },
];

export const recentActivities = [
  { title: 'Workshop completed', club: 'Technical Club', note: 'AI & Robotics', date: 'Aug 02' },
  { title: 'Competition won', club: 'Maths Club', note: 'Intercollege Quiz', date: 'Aug 01' },
  { title: 'Blood donation camp', club: 'Malayalam Club', note: 'Community health drive', date: 'Jul 29' },
  { title: 'NSS activity', club: 'Arts Club', note: 'Village outreach program', date: 'Jul 27' },
  { title: 'Tree plantation', club: 'Science Club', note: 'Campus green drive', date: 'Jul 24' },
  { title: 'Cultural festival', club: 'Arts Club', note: 'Utsav celebration', date: 'Jul 20' },
  { title: 'Guest lecture', club: 'English Club', note: 'Media & Communication', date: 'Jul 18' },
  { title: 'Technical seminar', club: 'Technical Club', note: 'Cloud architectures', date: 'Jul 15' },
];

export const quickActions = [
  'Add Club',
  'Register Member',
  'Create Event',
  'Record Attendance',
  'Upload Gallery',
  'Publish Announcement',
  'Generate Report',
];

export const certificateTemplates = [
  'Participation Certificate',
  'Winner Certificate',
  'Volunteer Certificate',
  'Organizer Certificate',
  'Appreciation Certificate',
];

export const galleryItems = [
  { type: 'Image', name: 'Debate Highlights.jpg', club: 'English Club', size: '3.2 MB', uploaded: 'Aug 02', category: 'Event Images' },
  { type: 'Video', name: 'Hackathon Reel.mp4', club: 'Technical Club', size: '12.8 MB', uploaded: 'Aug 22', category: 'Videos' },
  { type: 'Poster', name: 'Cultural Poster.png', club: 'Malayalam Club', size: '1.5 MB', uploaded: 'Aug 15', category: 'Posters' },
  { type: 'Document', name: 'Volunteer Roster.pdf', club: 'Science Club', size: '560 KB', uploaded: 'Jul 29', category: 'Documents' },
  { type: 'Presentation', name: 'Innovation Pitch.pptx', club: 'Science Club', size: '4.4 MB', uploaded: 'Aug 28', category: 'Presentations' },
];

export const galleryTypes = ['All', 'Event Images', 'Videos', 'Posters', 'Documents', 'Presentations'];

export const announcementTemplates = [
  { title: 'General Announcement', target: 'All Clubs', channel: 'Dashboard Alert', description: 'Weekly campus briefing and reminders.', status: 'Published' },
  { title: 'Club Announcement', target: 'Selected Clubs', channel: 'Email', description: 'Club-specific event updates and deadlines.', status: 'Scheduled' },
  { title: 'Emergency Notice', target: 'All Students', channel: 'Push Notification', description: 'Immediate alert for urgent campus safety messages.', status: 'Sent' },
  { title: 'Event Reminder', target: 'Participants', channel: 'Dashboard Alert', description: 'Reminder for upcoming event check-in and schedules.', status: 'Published' },
];

export const notificationTypes = ['Push Notification', 'Email', 'Dashboard Alert'];

export const facultyCoordinators = [
  { name: 'Miss Anjali', department: 'English', email: 'anjali@college.edu', phone: '+91 98765 43210', assignedClubs: ['English Club', 'Debate Society'], activityHistory: ['Language Debate', 'Media Seminar'], status: 'Active' },
  { name: 'Miss Nisha', department: 'Arts', email: 'nisha@college.edu', phone: '+91 91234 56789', assignedClubs: ['Malayalam Club', 'Cultural Team'], activityHistory: ['Cultural Night', 'Art Workshop'], status: 'Active' },
  { name: 'Miss Meera', department: 'Engineering', email: 'meera@college.edu', phone: '+91 99876 54321', assignedClubs: ['Technical Club', 'Robotics Team'], activityHistory: ['Hackathon Sprint', 'Cloud Seminar'], status: 'Active' },
  { name: 'Miss Kavitha', department: 'Science', email: 'kavitha@college.edu', phone: '+91 95678 43210', assignedClubs: ['Science Club', 'Research Forum'], activityHistory: ['Innovation Expo', 'Community Camp'], status: 'Active' },
];

export const activityTemplates = [
  'Workshop Template',
  'Seminar Template',
  'Competition Template',
  'Technical Event Template',
  'Cultural Program Template',
];

export const registrations = [
  { student: 'Aisha Khan', activity: 'Language Debate', club: 'English Club', status: 'Pending Approval', receipt: 'RCPT-0012' },
  { student: 'Rahul Sharma', activity: 'Tech Hackathon', club: 'Technical Club', status: 'Approved', receipt: 'RCPT-0020' },
  { student: 'Priya Menon', activity: 'Art Showcase', club: 'Arts Club', status: 'Rejected', receipt: 'RCPT-0018' },
  { student: 'Sameer Jose', activity: 'Blood Donation Camp', club: 'Malayalam Club', status: 'Approved', receipt: 'RCPT-0023' },
];

export const attendanceRecords = [
  { activity: 'Language Debate', date: '2026-08-12', mode: 'QR Code', present: 68, late: 4, percentage: '85%' },
  { activity: 'Tech Hackathon', date: '2026-08-22', mode: 'Manual', present: 72, late: 6, percentage: '78%' },
  { activity: 'Art Showcase', date: '2026-07-10', mode: 'QR Code', present: 54, late: 2, percentage: '90%' },
  { activity: 'Blood Donation Camp', date: '2026-07-29', mode: 'Manual', present: 44, late: 0, percentage: '88%' },
];

export const approvals = [
  { activity: 'Innovation Expo', stage: 'Pending Approval', approver: 'Miss Kavitha', role: 'Faculty Coordinator' },
  { activity: 'Cultural Night', stage: 'Approved', approver: 'Amina Patel', role: 'President' },
  { activity: 'Tech Hackathon', stage: 'Published', approver: 'Admin Team', role: 'Administrator' },
  { activity: 'Campus Cleanup', stage: 'Cancelled', approver: 'Miss Anjali', role: 'Faculty Coordinator' },
];

export const budgetRequests = [
  { club: 'Technical Club', type: 'Sponsorship', amount: '₹25,000', status: 'Approved' },
  { club: 'English Club', type: 'Donations', amount: '₹8,000', status: 'Pending' },
  { club: 'Arts Club', type: 'Expense', amount: '₹14,500', status: 'Approved' },
  { club: 'Science Club', type: 'Budget Request', amount: '₹18,000', status: 'Review' },
];

export const calendarEvents = [
  { title: 'Language Debate', type: 'Competition', date: '2026-08-12', time: '10:00 AM' },
  { title: 'Cultural Night', type: 'Cultural Program', date: '2026-08-15', time: '06:00 PM' },
  { title: 'Tech Hackathon', type: 'Technical Event', date: '2026-08-22', time: '09:00 AM' },
  { title: 'Innovation Expo', type: 'Exhibition', date: '2026-08-28', time: '11:00 AM' },
  { title: 'Blood Donation Camp', type: 'Community Service', date: '2026-07-29', time: '09:00 AM' },
  { title: 'Guest Lecture', type: 'Guest Lecture', date: '2026-07-18', time: '02:00 PM' },
];

export const reportCards = [
  { label: 'Club Performance', value: '81.4%' },
  { label: 'Event Performance', value: '76.2%' },
  { label: 'Attendance Rate', value: '84.2%' },
  { label: 'Budget Remaining', value: '₹29.4k' },
  { label: 'Membership Growth', value: '+12%' },
  { label: 'Pending Approvals', value: '4' },
];

export const userRoles = ['Super Admin', 'Faculty Admin', 'President', 'Vice President', 'Secretary', 'Executive Member', 'Student'];

export const studentActions = ['Join Club', 'Leave Club', 'Register Activity', 'View Certificates', 'View Attendance', 'Track Participation'];
export const adminActions = ['Manage Clubs', 'Manage Members', 'Manage Activities', 'Manage Budgets', 'Generate Reports', 'System Settings'];

export const notifications = [
  { title: 'New member request', description: '5 new registrations pending approval' },
  { title: 'Upcoming event reminder', description: 'Language Debate starts tomorrow' },
  { title: 'Pending approvals', description: 'Budget approvals awaiting faculty sign-off' },
  { title: 'Budget request', description: 'Tech Club budget escalation needs review' },
  { title: 'Executive committee updated', description: 'New executive assignment completed' },
];

export const executiveCommittee = [
  { profilePhoto: '', name: 'Amina Patel', studentId: 'CLB1001', department: 'English', semester: '6th', email: 'amina.patel@example.edu', phone: '+91 98765 43210', position: 'President', club: 'English Club', joined: '2026-06-15', status: 'Active' },
  { profilePhoto: '', name: 'Nikhil Rao', studentId: 'CLB1002', department: 'Arts', semester: '5th', email: 'nikhil.rao@example.edu', phone: '+91 91234 56789', position: 'Vice President', club: 'Malayalam Club', joined: '2026-06-22', status: 'Active' },
  { profilePhoto: '', name: 'Arjun Menon', studentId: 'CLB1003', department: 'Mathematics', semester: '6th', email: 'arjun.menon@example.edu', phone: '+91 99876 54321', position: 'Secretary', club: 'Maths Club', joined: '2026-07-01', status: 'Active' },
  { profilePhoto: '', name: 'Kavya Iyer', studentId: 'CLB1004', department: 'Engineering', semester: '7th', email: 'kavya.iyer@example.edu', phone: '+91 98765 12340', position: 'President', club: 'Technical Club', joined: '2026-07-05', status: 'Active' },
  { profilePhoto: '', name: 'Neha Varma', studentId: 'CLB1005', department: 'Fine Arts', semester: '5th', email: 'neha.varma@example.edu', phone: '+91 95678 43210', position: 'Secretary', club: 'Arts Club', joined: '2026-07-08', status: 'Inactive' },
];

export const activities = [
  { title: 'Language Debate', club: 'English Club', category: 'Debate', description: 'Intercollege debate with judging panel and awards.', date: '2026-08-12', time: '10:00 AM', venue: 'Auditorium', organizer: 'Amina Patel', facultyCoordinator: 'Miss Anjali', maxParticipants: 80, registrationDeadline: '2026-08-08', status: 'Upcoming', banner: '', attachments: ['Debate Brief.pdf'], participants: 45 },
  { title: 'Cultural Night', club: 'Malayalam Club', category: 'Cultural', description: 'Campus cultural evening with traditional performances.', date: '2026-08-15', time: '06:00 PM', venue: 'Central Lawn', organizer: 'Nikhil Rao', facultyCoordinator: 'Miss Nisha', maxParticipants: 120, registrationDeadline: '2026-08-10', status: 'Upcoming', banner: '', attachments: ['Stage Layout.pdf'], participants: 78 },
  { title: 'Tech Hackathon', club: 'Technical Club', category: 'Competition', description: '24-hour hackathon focusing on sustainable solutions.', date: '2026-08-22', time: '09:00 AM', venue: 'Lab 4', organizer: 'Kavya Iyer', facultyCoordinator: 'Miss Meera', maxParticipants: 100, registrationDeadline: '2026-08-18', status: 'Ongoing', banner: '', attachments: ['Hackathon Rules.pdf'], participants: 64 },
  { title: 'Innovation Expo', club: 'Science Club', category: 'Exhibition', description: 'Showcase of student science and research projects.', date: '2026-08-28', time: '11:00 AM', venue: 'Hall B', organizer: 'Faisal Khan', facultyCoordinator: 'Miss Kavitha', maxParticipants: 90, registrationDeadline: '2026-08-25', status: 'Upcoming', banner: '', attachments: ['Expo Map.pdf'], participants: 52 },
  { title: 'Art Showcase', club: 'Arts Club', category: 'Exhibition', description: 'Visual arts display and interactive workshops.', date: '2026-07-10', time: '04:00 PM', venue: 'Gallery Room', organizer: 'Neha Varma', facultyCoordinator: 'Miss Sadhana', maxParticipants: 60, registrationDeadline: '2026-07-05', status: 'Completed', banner: '', attachments: ['Artist Lineup.pdf'], participants: 56 },
  { title: 'College Seminar', club: 'English Club', category: 'Seminar', description: 'Guest lecture on media literacy and communication.', date: '2026-07-20', time: '02:00 PM', venue: 'Conference Hall', organizer: 'Amina Patel', facultyCoordinator: 'Miss Anjali', maxParticipants: 70, registrationDeadline: '2026-07-18', status: 'Completed', banner: '', attachments: ['Seminar Notes.pdf'], participants: 62 },
  { title: 'Blood Donation Camp', club: 'Malayalam Club', category: 'Community', description: 'Health camp for voluntary blood donation.', date: '2026-07-29', time: '09:00 AM', venue: 'Campus Clinic', organizer: 'Nikhil Rao', facultyCoordinator: 'Miss Nisha', maxParticipants: 50, registrationDeadline: '2026-07-27', status: 'Completed', banner: '', attachments: ['Health Guidelines.pdf'], participants: 48 },
  { title: 'Campus Cleanup', club: 'Science Club', category: 'Community', description: 'Environmental cleanup drive around campus.', date: '2026-08-05', time: '08:00 AM', venue: 'Main Gate', organizer: 'Faisal Khan', facultyCoordinator: 'Miss Kavitha', maxParticipants: 75, registrationDeadline: '2026-08-02', status: 'Cancelled', banner: '', attachments: ['Cleanup Plan.pdf'], participants: 0 },
];

export const chartStats = {
  monthlyEvents: [8, 11, 14, 16, 13, 18],
  memberDistribution: [32, 28, 30, 27, 35, 29],
  budgetExpenses: [72, 58, 67, 84, 97, 86],
  attendance: [89, 84, 92, 87, 94, 86],
  participation: [76, 68, 81, 82, 92, 67],
};
