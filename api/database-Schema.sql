generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  MEMBER
  VIEWER
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
  BLOCKED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

/* ======================
   USER
====================== */
model User {
  id             String    @id @default(uuid())
  email          String    @unique
  password       String?
  name           String
  avatarUrl      String?
  googleId       String?   @unique
  provider       String    @default("local")
  isActive       Boolean   @default(true)
  passwordResetToken String?
  passwordResetTokenExpiresAt DateTime?
  lastLoginAt    DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  teams         TeamMember[]
  projects      ProjectMember[]
  tasks         Task[]         @relation("AssignedTasks")
  comments      Comment[]
  notifications Notification[]
}

/* ======================
   TEAM
====================== */
model Team {
  id          String   @id @default(uuid())
  name        String
  description String?
  createdAt   DateTime @default(now())

  members  TeamMember[]
  projects Project[]
}

/* ======================
   TEAM MEMBERSHIP
====================== */
model TeamMember {
  id       String   @id @default(uuid())
  role     Role     @default(MEMBER)
  joinedAt DateTime @default(now())

  userId String
  teamId String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  team Team @relation(fields: [teamId], references: [id], onDelete: Cascade)

  @@unique([userId, teamId])
  @@index([userId])
  @@index([teamId])
}

/* ======================
   PROJECT
====================== */
model Project {
  id          String   @id @default(uuid())
  name        String
  description String?
  isArchived  Boolean  @default(false)
  createdAt   DateTime @default(now())

  teamId String?
  team   Team?   @relation(fields: [teamId], references: [id], onDelete: Cascade)

  members ProjectMember[]
  tasks   Task[]

  @@index([teamId])
}

/* ======================
   PROJECT MEMBERSHIP

   Business Rule: A user must be a member of the team to be a member of a project.
   This must be enforced by the application logic.
====================== */
model ProjectMember {
  id        String   @id @default(uuid())
  role      Role     @default(MEMBER)
  joinedAt  DateTime @default(now())

  userId    String
  projectId String

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([userId, projectId])
  @@index([userId])
  @@index([projectId])
}

/* ======================
   TASK
====================== */
model Task {
  id           String     @id @default(uuid())
  title        String
  description  String?
  status       TaskStatus @default(TODO)
  priority     Priority   @default(MEDIUM)
  dueDate      DateTime?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  assignedToId String?
  assignedTo   User?   @relation("AssignedTasks", fields: [assignedToId], references: [id], onDelete: SetNull)

  attachments Attachment[]
  comments    Comment[]

  @@index([projectId])
  @@index([assignedToId])
}

/* ======================
   ATTACHMENT
====================== */
model Attachment {
  id        String   @id @default(uuid())
  filename  String
  url       String
  createdAt DateTime @default(now())

  taskId String
  task   Task   @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@index([taskId])
}

/* ======================
   COMMENT
====================== */
model Comment {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now())

  taskId   String
  authorId String

  task   Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  author User @relation(fields: [authorId], references: [id], onDelete: Restrict)

  @@index([taskId])
  @@index([authorId])
}

/* ======================
   NOTIFICATION
====================== */
model Notification {
  id        String   @id @default(uuid())
  type      String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
