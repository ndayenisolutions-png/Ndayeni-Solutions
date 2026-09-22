-- ════════════════════════════════════════════════════════════════
-- Ndayeni Solutions Digital Academy — Database Setup
-- Run this in Supabase SQL Editor (SQL → New Query → paste → Run)
-- ════════════════════════════════════════════════════════════════

-- Academy Users (admin accounts)
CREATE TABLE IF NOT EXISTS "AcademyUser" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Students
CREATE TABLE IF NOT EXISTS "Student" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "studentNumber" TEXT,
  "applicationRef" TEXT,
  "fullName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  "idNumber" TEXT,
  "dateOfBirth" TEXT,
  gender TEXT,
  nationality TEXT,
  address TEXT,
  "selectedCourses" TEXT,
  "courseId" TEXT,
  "preferredStartDate" TEXT,
  "preferredMode" TEXT,
  "highestEducation" TEXT,
  "employmentStatus" TEXT,
  "previousTraining" TEXT,
  "relevantExperience" TEXT,
  "nextOfKinName" TEXT,
  "nextOfKinRelationship" TEXT,
  "nextOfKinPhone" TEXT,
  "nextOfKinEmail" TEXT,
  intake TEXT,
  "enrolledAt" TIMESTAMP(3),
  "trainingStartDate" TIMESTAMP(3),
  "expectedCompletion" TIMESTAMP(3),
  program TEXT NOT NULL DEFAULT '',
  message TEXT,
  "termsAgreed" BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'applied',
  progress INTEGER DEFAULT 0,
  notes TEXT,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Courses
CREATE TABLE IF NOT EXISTS "Course" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  "deliveryMethod" TEXT NOT NULL,
  "entryRequirements" TEXT,
  fee TEXT,
  active BOOLEAN DEFAULT true,
  "maxStudents" INTEGER,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Modules
CREATE TABLE IF NOT EXISTS "Module" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "courseId" TEXT NOT NULL REFERENCES "Course"(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  "order" INTEGER DEFAULT 0,
  "learningObjectives" TEXT,
  active BOOLEAN DEFAULT true
);

-- Attendance
CREATE TABLE IF NOT EXISTS "Attendance" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "studentId" TEXT NOT NULL REFERENCES "Student"(id) ON DELETE CASCADE,
  date TIMESTAMP(3) NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Assessments
CREATE TABLE IF NOT EXISTS "Assessment" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "studentId" TEXT NOT NULL REFERENCES "Student"(id) ON DELETE CASCADE,
  "moduleTitle" TEXT NOT NULL,
  date TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  result TEXT NOT NULL,
  mark TEXT,
  comments TEXT,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Certificates
CREATE TABLE IF NOT EXISTS "Certificate" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "studentId" TEXT NOT NULL REFERENCES "Student"(id) ON DELETE CASCADE,
  "programName" TEXT NOT NULL,
  "studentName" TEXT NOT NULL,
  "idNumber" TEXT,
  "issueDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "certificateNumber" TEXT UNIQUE NOT NULL,
  "signedBy" TEXT,
  status TEXT DEFAULT 'active'
);

-- Audit Log
CREATE TABLE IF NOT EXISTS "AuditLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT,
  "studentId" TEXT REFERENCES "Student"(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS "Student_email_idx" ON "Student"(email);
CREATE INDEX IF NOT EXISTS "Student_status_idx" ON "Student"(status);
CREATE INDEX IF NOT EXISTS "Student_applicationRef_idx" ON "Student"("applicationRef");
CREATE INDEX IF NOT EXISTS "Module_courseId_idx" ON "Module"("courseId");
CREATE INDEX IF NOT EXISTS "Attendance_studentId_idx" ON "Attendance"("studentId");
CREATE INDEX IF NOT EXISTS "Assessment_studentId_idx" ON "Assessment"("studentId");
CREATE INDEX IF NOT EXISTS "Certificate_studentId_idx" ON "Certificate"("studentId");

-- ════════════════════════════════════════════════════════════════
-- SEED DATA
-- ════════════════════════════════════════════════════════════════

-- Super User (password: Masiphula!2016)
-- Password hash generated with pbkdf2-sha512, 10000 iterations
INSERT INTO "AcademyUser" (email, "passwordHash", name, role, active)
VALUES ('nhlakanipho@ndayenisolutions.co.za', '24fa0879d8184828569a44ae92e95b57:39b7a2c1f20067d6404b7ebc4d6c3ba36c96de1276f20a40b41fad9d62288255176d92d3a19e478e51b46c195e9b716b2d5ab29f54805f39c31ccebc96d7c838', 'Nhlakanipho Ntshangase', 'super', true)
ON CONFLICT (email) DO NOTHING;

-- Courses
INSERT INTO "Course" (code, title, description, duration, "deliveryMethod", "entryRequirements", active)
VALUES
  ('NDY-DS01', 'End User Computing', 'Comprehensive computing foundation — computers, Word, Excel, internet, email, safety. Modules 1-8.', '6 weeks', 'In-person or hybrid (Midrand + online)', 'No prior computer experience required', true),
  ('NDY-DS02', 'Cloud & Online Productivity', 'Microsoft 365 and Google Workspace. Cloud collaboration. Modules 9-10.', '1 week', 'In-person or online', 'Basic computer literacy', true),
  ('NDY-DS03', 'Basic Graphic Design', 'Design fundamentals using Canva. Module 11.', '1 week', 'In-person (requires computer access)', 'Basic computer literacy', true),
  ('NDY-DS04', 'Digital Marketing Fundamentals', 'Social media for business. Module 12.', '1 week', 'In-person or online', 'Basic computer literacy and social media familiarity', true)
ON CONFLICT (code) DO NOTHING;

-- Modules for NDY-DS01
INSERT INTO "Module" ("courseId", title, "order", active)
SELECT id, 'Computer Fundamentals', 1, true FROM "Course" WHERE code = 'NDY-DS01'
UNION ALL SELECT id, 'File & Document Management', 2, true FROM "Course" WHERE code = 'NDY-DS01'
UNION ALL SELECT id, 'Microsoft Word', 3, true FROM "Course" WHERE code = 'NDY-DS01'
UNION ALL SELECT id, 'Microsoft Excel', 4, true FROM "Course" WHERE code = 'NDY-DS01'
UNION ALL SELECT id, 'Microsoft PowerPoint', 5, true FROM "Course" WHERE code = 'NDY-DS01'
UNION ALL SELECT id, 'Internet & Web Skills', 6, true FROM "Course" WHERE code = 'NDY-DS01'
UNION ALL SELECT id, 'Email & Digital Communication', 7, true FROM "Course" WHERE code = 'NDY-DS01'
UNION ALL SELECT id, 'Digital Safety & Cyber Awareness', 8, true FROM "Course" WHERE code = 'NDY-DS01'
ON CONFLICT DO NOTHING;

-- Modules for NDY-DS02
INSERT INTO "Module" ("courseId", title, "order", active)
SELECT id, 'Microsoft 365 & Cloud Productivity', 1, true FROM "Course" WHERE code = 'NDY-DS02'
UNION ALL SELECT id, 'Google Workspace & Online Productivity', 2, true FROM "Course" WHERE code = 'NDY-DS02'
ON CONFLICT DO NOTHING;

-- Module for NDY-DS03
INSERT INTO "Module" ("courseId", title, "order", active)
SELECT id, 'Basic Graphic Design', 1, true FROM "Course" WHERE code = 'NDY-DS03'
ON CONFLICT DO NOTHING;

-- Module for NDY-DS04
INSERT INTO "Module" ("courseId", title, "order", active)
SELECT id, 'Digital Marketing Fundamentals', 1, true FROM "Course" WHERE code = 'NDY-DS04'
ON CONFLICT DO NOTHING;

-- ════════════════════════════════════════════════════════════════
-- DONE — Tables created and seeded
-- ════════════════════════════════════════════════════════════════
