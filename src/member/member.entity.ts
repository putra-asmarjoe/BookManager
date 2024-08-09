import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  penalty: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  penaltyEndDate: Date;
}