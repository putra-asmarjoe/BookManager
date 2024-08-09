import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Member } from '../member/member.entity';
import { Book } from '../book/book.entity';

@Entity()
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Member)
  member: Member;

  @ManyToOne(() => Book)
  book: Book;

  @CreateDateColumn()
  borrowDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnDate: Date;

  @Column({ default: false })
  isLate: boolean;
}

