import type { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'

export default class UsersController {
  async index({ response }: HttpContext) {
    try {
      const users = await User.query().preload('posts').preload('setting')
      return response.ok({
        status: true,
        message: 'Users fetched successfully',
        data: users,
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
      const user = await User.findOrFail(params.id)
      await user.load('posts')
      await user.load('setting')

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

  // POST
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'email'])
      const settings = request.input('settings')

      const user = await User.create(data)

      if (settings) {
        await user.related('setting').create(settings)
      }

      await user.load('setting')

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

  // PUT

  async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)

      const data = request.body()
      const { name, email, settings } = data

      console.log({ name, email, settings })

      user.merge({ name, email })
      await user.save()

      if (settings) {
        await user.load('setting')

        if (user.setting) {
          user.setting.merge({
            phone: settings.phone,
            city: settings.city,
          })
          await user.setting.save()
        } else {
          await user.related('setting').create({
            phone: settings.phone,
            city: settings.city,
          })
        }
      }

      await user.load('setting')

      return response.ok({
        status: true,
        message: 'User updated successfully',
        data: user,
      })
    } catch (error) {
      console.error(error)
      return response.badRequest({
        status: false,
        message: 'Failed to update user',
        error: error.message,
      })
    }
  }

  // DELETE
  async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()

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
