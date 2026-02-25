import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('auth')
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Authentication fields
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: 'local' })
  provider: string;

  @Column({ nullable: true, unique: true })
  googleId: string;

  // Security fields
  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true, type: 'timestamp' })
  passwordResetTokenExpiresAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  lastLoginAt: Date;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relation to User profile
  @OneToOne('User', 'auth', { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: any;
}
