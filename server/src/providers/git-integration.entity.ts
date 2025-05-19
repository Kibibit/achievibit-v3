import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../models/user.entity';

@Entity()
export class GitIntegration {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ type: 'enum', enum: [ 'github', 'gitlab', 'bitbucket' ] })
    provider: 'github' | 'gitlab' | 'bitbucket';

  // GitHub user ID / GitLab ID / Bitbucket UUID
  @Column()
    externalId: string;

  @Column()
    username: string;

  @Column({ nullable: true })
    avatarUrl: string;

  // GitHub/GitLab/Bitbucket installation/project token ID
  @Column({ nullable: true })
    installationId: string;

  @ManyToOne(() => User, (user) => user.integrations)
    user: User;

  @Column({ nullable: true })
    token: string;
}
