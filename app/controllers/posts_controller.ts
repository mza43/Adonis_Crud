import type { HttpContext } from '@adonisjs/core/http'
import Post from '../models/post.js'

export default class PostsController {
  /**
   * GET /posts
   * Get all posts with user and categories
   */
  async index({ response }: HttpContext) {
    try {
      const posts = await Post.query().preload('user').preload('categories')

      return response.ok({
        status: true,
        message: 'Posts fetched successfully',
        data: posts,
      })
    } catch (error) {
      return response.internalServerError({
        status: false,
        message: 'Failed to fetch posts',
        error: error.message,
      })
    }
  }

  /**
   * GET /posts/:id
   * Get a single post by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const post = await Post.findOrFail(params.id)
      await post.load('user')
      await post.load('categories')

      return response.ok({
        status: true,
        message: 'Post found',
        data: post,
      })
    } catch (error) {
      return response.notFound({
        status: false,
        message: 'Post not found',
        error: error.message,
      })
    }
  }

  /**
   * POST /posts
   * Create a new post
   */
  async store({ request, response }: HttpContext) {
    try {
      const { title, description, userId, categoryIds } = request.only([
        'title',
        'description',
        'userId',
        'categoryIds',
      ])

      const post = await Post.create({ title, description, userId })

      if (categoryIds && Array.isArray(categoryIds)) {
        await post.related('categories').attach(categoryIds)
      }

      await post.load('user')
      await post.load('categories')

      return response.created({
        status: true,
        message: 'Post created successfully',
        data: post,
      })
    } catch (error) {
      return response.badRequest({
        status: false,
        message: 'Failed to create post',
        error: error.message,
      })
    }
  }

  /**
   * PUT /posts/:id
   * Update an existing post
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const post = await Post.findOrFail(params.id)
      const { title, description, categoryIds } = request.only([
        'title',
        'description',
        'categoryIds',
      ])

      post.merge({ title, description })
      await post.save()

      if (categoryIds && Array.isArray(categoryIds)) {
        await post.related('categories').sync(categoryIds)
      }

      await post.load('user')
      await post.load('categories')

      return response.ok({
        status: true,
        message: 'Post updated successfully',
        data: post,
      })
    } catch (error) {
      return response.badRequest({
        status: false,
        message: 'Failed to update post',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /posts/:id
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const post = await Post.findOrFail(params.id)
      await post.related('categories').detach()
      await post.delete()

      return response.ok({
        status: true,
        message: 'Post deleted successfully',
      })
    } catch (error) {
      return response.badRequest({
        status: false,
        message: 'Failed to delete post',
        error: error.message,
      })
    }
  }
}
