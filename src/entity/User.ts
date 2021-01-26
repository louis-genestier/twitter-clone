import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, Unique, ManyToMany, JoinTable, OneToMany,
} from 'typeorm';
import Post from './Post';

@Entity()
@Unique(['username'])
@Unique(['email'])
export default class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({ default: 'user' })
    role: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => User, (User) => User.followers)
    @JoinTable()
    following: User[];

    @ManyToMany(() => User, (User) => User.following)
    followers: User[];

    @OneToMany(() => Post, (Post) => Post.author)
    posts: Post[];
}
