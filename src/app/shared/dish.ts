// import { Comment } from './comment';

export class Dish {
    id: string;
    name: string;
    image: string;
    category: string;
    featured: boolean;
    label: string;
    price: string;
    description: string;
    comments: Comment[];

}

export class Comment {
    rating: number;
    comment: string;
    author: string;
    date: string;
}