import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Profile fields
  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  username: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'text', nullable: true })
  email: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ nullable: true })
  portfolioUrl: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ default: false })
  isProfileComplete: boolean;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relation to Auth
  @OneToOne('Auth', 'user')
  @JoinColumn({ name: 'authId' })
  auth: any;

  // Relations to other entities
  @OneToMany('TeamMember', 'user', { cascade: true })
  teams: any[];

  @OneToMany('ProjectMember', 'user', { cascade: true })
  projects: any[];

  @OneToMany('Task', 'assignedTo')
  tasks: any[];
}




