import type { HttpContext } from '@adonisjs/core/http'
import UserService from '../services/user_service.js'

export default class UsersController {
 
  async index({ request, response }: HttpContext) {
  try {
    const { page = 1, limit = 20, search = '', sortField = 'id', sortOrder = 'asc' } = request.body()

    const users = await UserService.getPaginatedUsers({
      page: Number(page),
      limit: Number(limit),
      search,
      sortField,
      sortOrder,
    })

    return response.ok({
      status: true,
      message: 'Users fetched successfully',
      meta: {
        total: users.total,
        perPage: users.perPage,
        currentPage: users.currentPage,
        lastPage: users.lastPage,
      },
      data: users.all(),
    })
  } catch (error) {
    return response.internalServerError({
      status: false,
      message: 'Failed to fetch users',
      error: error.message,
    })
  }
}


  async show({ params, response }: HttpContext) {
    try {
      const user = await UserService.getUserById(params.id)
      return response.ok({
        status: true,
        message: 'User fetched successfully',
        data: user,
      })
    } catch (error) {
      return response.notFound({
        status: false,
        message: 'User not found',
        error: error.message,
      })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'email'])
      const settings = request.input('settings')

      const user = await UserService.createUser(data, settings)

      return response.created({
        status: true,
        message: 'User created successfully',
        data: user,
      })
    } catch (error) {
      return response.badRequest({
        status: false,
        message: 'Failed to create user',
        error: error.message,
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const { name, email, settings } = request.only(['name', 'email', 'settings'])

      const user = await UserService.updateUser(params.id, { name, email }, settings)

      return response.ok({
        status: true,
        message: 'User updated successfully',
        data: user,
      })
    } catch (error) {
      return response.badRequest({
        status: false,
        message: 'Failed to update user',
        error: error.message,
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      await UserService.deleteUser(params.id)

      return response.ok({
        status: true,
        message: 'User deleted successfully',
      })
    } catch (error) {
      return response.notFound({
        status: false,
        message: 'Failed to delete user',
        error: error.message,
      })
    }
  }
}
