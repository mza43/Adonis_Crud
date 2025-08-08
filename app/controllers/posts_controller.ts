import type { HttpContext } from '@adonisjs/core/http'
import PostService from '#services/post_service'

export default class PostsController {
  async index({ response }: HttpContext) {
    const posts = await PostService.getAll()
    return response.ok({
      status: true,
      message: 'Posts fetched successfully',
      data: posts,
    })
  }

  async show({ params, response }: HttpContext) {
    try {
      const post = await PostService.getById(params.id)
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

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['title', 'description', 'userId', 'categoryIds'])
      const post = await PostService.create(data)

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

  async update({ params, request, response }: HttpContext) {
    try {
      const data = request.only(['title', 'description', 'categoryIds'])
      const post = await PostService.update(params.id, data)

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

  async destroy({ params, response }: HttpContext) {
    try {
      await PostService.delete(params.id)
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
