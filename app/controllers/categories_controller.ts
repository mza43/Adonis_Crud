import type { HttpContext } from '@adonisjs/core/http'
import Category from '../models/category.js'

// GET

export default class CategoriesController {
  async index({ response }: HttpContext) {
    const categories = await Category.all()
    return response.ok({
      status: true,
      message: 'Categories fetched successfully',
      data: categories,
    })
  }

  // POST

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['title', 'description'])
      const category = await Category.create(data)

      return response.created({
        status: true,
        message: 'Category created successfully',
        data: category,
      })
    } catch (error) {
      return response.badRequest({
        status: false,
        message: 'Failed to create category',
        error: error.message,
      })
    }
  }

  // GET by id

  async show({ params, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.load('posts')

      return response.ok({
        status: true,
        message: 'Category found',
        data: category,
      })
    } catch (error) {
      return response.notFound({
        status: false,
        message: 'Category not found',
        error: error.message,
      })
    }
  }

  // PUT
  
  async update({ params, request, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      const data = request.only(['title', 'description'])

      category.merge(data)
      await category.save()

      return response.ok({
        status: true,
        message: 'Category updated successfully',
        data: category,
      })
    } catch (error) {
      return response.badRequest({
        status: false,
        message: 'Failed to update category',
        error: error.message,
      })
    }
  }

  // DELETE

  async destroy({ params, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.delete()

      return response.ok({
        status: true,
        message: 'Category deleted successfully',
      })
    } catch (error) {
      return response.badRequest({
        status: false,
        message: 'Failed to delete category',
        error: error.message,
      })
    }
  }
}
