# User Entity Documentation

## Overview

The `User` entity serves as the central user model for the Collabo application. It consolidates authentication, profile, and relational data in a single entity defined in `src/auths/entities/auth.entity.ts`.

## Entity Structure

### Authentication Fields
```typescript
email: string              // Unique email address
name: string              // Unique username
password: string          // Hashed password (nullable for OAuth users)
provider: string          // Auth provider (default: 'local')
googleId: string          // Google OAuth ID (nullable)
isActive: boolean         // Account status (default: true)
```

### Profile Fields
```typescript
fullName: string          // User's full name
bio: string               // User biography/about section
age: number               // User age (13-150)
githubUrl: string         // GitHub profile URL
linkedinUrl: string       // LinkedIn profile URL
portfolioUrl: string      // Portfolio website URL
avatarUrl: string         // Profile picture URL
location: string          // User's location
company: string           // Company/organization
jobTitle: string          // Job title/position
isProfileComplete: boolean // Profile completeness flag (default: false)
```

### Security Fields
```typescript
passwordResetToken: string        // Token for password reset
passwordResetTokenExpiresAt: Date // Token expiration timestamp
lastLoginAt: Date                 // Last login timestamp
```

### Timestamps
```typescript
createdAt: Date   // Account creation timestamp (auto-generated)
updatedAt: Date   // Last update timestamp (auto-generated)
```

### Relations
```typescript
teams: TeamMember[]       // Teams user is member of
projects: ProjectMember[] // Projects user is assigned to
tasks: Task[]             // Tasks assigned to user
```

## Database Table

The entity is mapped to the `users` table in the database:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  provider VARCHAR(50) DEFAULT 'local',
  googleId VARCHAR(255),
  isActive BOOLEAN DEFAULT true,
  
  -- Profile fields
  fullName VARCHAR(255),
  bio TEXT,
  age INT CHECK (age >= 13 AND age <= 150),
  githubUrl VARCHAR(255),
  linkedinUrl VARCHAR(255),
  portfolioUrl VARCHAR(255),
  avatarUrl VARCHAR(255),
  location VARCHAR(255),
  company VARCHAR(255),
  jobTitle VARCHAR(255),
  isProfileComplete BOOLEAN DEFAULT false,
  
  -- Security fields
  passwordResetToken VARCHAR(255),
  passwordResetTokenExpiresAt TIMESTAMP,
  lastLoginAt TIMESTAMP,
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_googleId ON users(googleId);
CREATE INDEX idx_users_isActive ON users(isActive);
```

## Entity Export

To avoid circular dependencies, the User entity is exported from `src/users/entities/user.entity.ts`:

```typescript
// Re-export User entity from auths module
export { User } from '../../auths/entities/auth.entity';
```

This allows services and modules to import from either location:
```typescript
// Both are valid
import { User } from '../auths/entities/auth.entity';
import { User } from '../users/entities/user.entity';
```

## Usage in Services

### Creating a User (Authentication Service)
```typescript
const user = this.userRepository.create({
  email: 'user@example.com',
  name: 'johndoe',
  password: hashedPassword,
  provider: 'local'
});

await this.userRepository.save(user);
```

### Updating Profile (Users Service)
```typescript
user.fullName = 'John Doe';
user.bio = 'Software developer';
user.age = 28;
user.githubUrl = 'https://github.com/johndoe';
user.isProfileComplete = this.isProfileComplete(user);

await this.userRepository.save(user);
```

### Finding Users
```typescript
// By email
const user = await this.userRepository.findOne({ where: { email } });

// By username
const user = await this.userRepository.findOne({ where: { name } });

// By Google ID
const user = await this.userRepository.findOne({ where: { googleId } });

// With relations
const user = await this.userRepository.findOne({
  where: { id },
  relations: ['teams', 'projects', 'tasks']
});
```

## Profile Completeness

A user profile is considered complete when all required profile fields are filled:
- `fullName` ✓
- `bio` ✓
- `age` ✓
- `githubUrl` ✓

The `isProfileComplete` flag is automatically calculated and updated by the Users service.

## Authentication Providers

The `provider` field indicates the authentication method:
- `'local'` - Username/password authentication
- `'google'` - Google OAuth authentication
- `'github'` - GitHub OAuth authentication (extensible)

For OAuth users, the `password` field is nullable since authentication is handled externally.

## Security Considerations

1. **Password Hashing** - Passwords are hashed using bcrypt before storage
2. **Password Reset** - Uses token-based reset with expiration time
3. **Active Status** - Accounts can be deactivated without deletion
4. **Last Login** - Tracked for security auditing and analytics
5. **Unique Constraints** - Email and username must be unique

## Validation Rules

### Email
- Must be valid email format
- Must be unique across all users

### Username (name)
- Minimum 3 characters
- Maximum 50 characters
- Unique across all users
- Alphanumeric with underscores/hyphens allowed

### Password
- Minimum 6 characters (enforced at DTO level)
- Hashed with bcrypt (10 rounds)

### Profile Fields
- **Full Name**: 2-100 characters (optional)
- **Bio**: Minimum 10 characters (optional)
- **Age**: 13-150 (optional)
- **URLs**: Valid URL format (optional)

## Entity Relationships

### One-to-Many with TeamMember
```typescript
@OneToMany(() => TeamMember, (teamMember) => teamMember.user, { cascade: true })
teams: TeamMember[];
```
A user can belong to multiple teams. Deleting a user cascades to their team memberships.

### One-to-Many with ProjectMember
```typescript
@OneToMany(() => ProjectMember, (projectMember) => projectMember.user, { cascade: true })
projects: ProjectMember[];
```
A user can be assigned to multiple projects. Deleting a user cascades to their project assignments.

### One-to-Many with Task
```typescript
@OneToMany(() => Task, (task) => task.assignedTo)
tasks: Task[];
```
A user can be assigned multiple tasks.

## Migration Guide

To migrate from the old dual-entity structure to the consolidated User entity:

1. ✅ User entity is now defined in `src/auths/entities/auth.entity.ts`
2. ✅ `src/users/entities/user.entity.ts` re-exports from auths module
3. ✅ All imports automatically resolve correctly
4. ✅ No database schema changes required

No code changes needed - the export alias ensures backward compatibility.

## Type Definitions

The User entity is fully typed with TypeScript:

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  provider: string;
  googleId?: string;
  isActive: boolean;
  
  // Profile
  fullName?: string;
  bio?: string;
  age?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  avatarUrl?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  isProfileComplete: boolean;
  
  // Security
  passwordResetToken?: string;
  passwordResetTokenExpiresAt?: Date;
  lastLoginAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  teams: TeamMember[];
  projects: ProjectMember[];
  tasks: Task[];
}
```
