export interface Post {
    id: string,
    title: string,
    permalink: string,
    category: {
        categoryId: string,
        categoryDescription: string,
        categoryColor: string
    }
    postImgPath: string,
    excerpt: string,
    content: string,
    isFeatured: boolean,
    views: number,
    status: string,
    createdAt: Date
}
