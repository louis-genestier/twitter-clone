import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, ManyToMany,
} from 'typeorm';
import User from './User';

@Entity()
export default class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (User) => User.posts)
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => User, (User) => User.likedPosts)
  likedBy: User[];
}
