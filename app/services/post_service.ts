import Post from '#models/post'

export default class PostService {
  static async getAll() {
    return await Post.query().preload('user').preload('categories')
  }

  static async getById(id: number) {
    const post = await Post.findOrFail(id)
    await post.load('user')
    await post.load('categories')
    return post
  }

  static async create(data: {
    title: string
    description: string
    userId: number
    categoryIds?: number[]
  }) {
    const { title, description, userId, categoryIds } = data
    const post = await Post.create({ title, description, userId })

    if (categoryIds && Array.isArray(categoryIds)) {
      await post.related('categories').attach(categoryIds)
    }

    await post.load('user')
    await post.load('categories')
    return post
  }

  static async update(id: number, data: {
    title?: string
    description?: string
    categoryIds?: number[]
  }) {
    const post = await Post.findOrFail(id)
    const { title, description, categoryIds } = data

    post.merge({ title, description })
    await post.save()

    if (categoryIds && Array.isArray(categoryIds)) {
      await post.related('categories').sync(categoryIds)
    }

    await post.load('user')
    await post.load('categories')
    return post
  }

  static async delete(id: number) {
    const post = await Post.findOrFail(id)
    await post.related('categories').detach()
    await post.delete()
    return true
  }
}
