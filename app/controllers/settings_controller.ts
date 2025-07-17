import type { HttpContext } from '@adonisjs/core/http'
import Setting from '../models/setting.js'

export default class SettingsController {
  async index({ response }: HttpContext) {
    const settings = await Setting.all()
    return response.ok({
      status: true,
      message: 'All settings retrieved successfully',
      data: settings,
    })
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['city', 'phone', 'userId'])

    try {
      const setting = await Setting.create(data)
      return response.created({
        status: true,
        message: 'Setting created successfully',
        data: setting,
      })
    } catch (error) {
      return response.badRequest({
        status: false,
        message: 'Failed to create setting',
        error: error.message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const setting = await Setting.findOrFail(params.id)
      await setting.load('user')

      return response.ok({
        status: true,
        message: 'Setting retrieved successfully',
        data: setting,
      })
    } catch (error) {
      return response.notFound({
        status: false,
        message: 'Setting not found',
        error: error.message,
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const setting = await Setting.findOrFail(params.id)
      const data = request.only(['city', 'phone', 'userId'])

      setting.merge(data)
      await setting.save()

      return response.ok({
        status: true,
        message: 'Setting updated successfully',
        data: setting,
      })
    } catch (error) {
      return response.badRequest({
        status: false,
        message: 'Failed to update setting',
        error: error.message,
      })
    }
  }

  // DELETE
  async destroy({ params, response }: HttpContext) {
    try {
      const setting = await Setting.findOrFail(params.id)
      await setting.delete()

      return response.ok({
        status: true,
        message: 'Setting deleted successfully',
      })
    } catch (error) {
      return response.notFound({
        status: false,
        message: 'Setting not found or already deleted',
        error: error.message,
      })
    }
  }

  // GET
  async edit({ params, response }: HttpContext) {
    try {
      const setting = await Setting.findOrFail(params.id)
      return response.ok({
        status: true,
        message: 'Edit data fetched',
        data: setting,
      })
    } catch (error) {
      return response.notFound({
        status: false,
        message: 'Setting not found',
        error: error.message,
      })
    }
  }

  async create({ response }: HttpContext) {
    return response.ok({
      status: true,
      message: 'Create form endpoint (optional for APIs)',
    })
  }
}
