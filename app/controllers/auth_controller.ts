// app/controllers/auth_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    const { name, email, password } = request.only(['name', 'email', 'password'])

    const exists = await User.findBy('email', email)
    if (exists) {
      return response.badRequest({ status: false, message: 'Email already taken' })
    }

    // AuthFinder will hash password automatically on save (no manual hashing)
    const user = await User.create({ name, email, password })

    return {
      status: true,
      message: 'User registered successfully',
      data: user,
    }
  }

  public async login({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Timing-attack safe credential check via AuthFinder
      const user = await User.verifyCredentials(email, password)
      const token = await auth.use('api').createToken(user)

      return response.ok({
        status: true,
        message: 'Login successful',
        data: {
          user,
          token: token.toJSON(),
        },
      })
    } catch (error) {
      return response.badRequest({ status: false, message: 'Invalid user credentials' })
    }
  }

  public async me({ auth, response }: HttpContext) {
    try {
      const user = await auth.use('api').authenticate()
      return { status: true, data: user }
    } catch {
      return response.unauthorized({ status: false, message: 'Not authenticated' })
    }
  }

  public async logout({ auth }: HttpContext) {
    // v6 tokens guard provides invalidateToken for the current token
    await auth.use('api').invalidateToken()
    return { status: true, message: 'Logged out successfully' }
  }
}
