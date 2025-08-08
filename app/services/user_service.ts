import User from '../models/user.js'

export default class UserService {
  static async getAllUsers() {
    return await User.query().preload('posts').preload('setting')
  }
// app/services/user_service.ts

static async getPaginatedUsers({
  page = 1,
  limit = 20,
  search = '',
  sortField = 'id',
  sortOrder = 'asc',
}: {
  page?: number
  limit?: number
  search?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}) {
  const query = User.query().preload('posts').preload('setting')

  if (search) {
    query.where((builder) => {
      builder
        .whereILike('name', `%${search}%`)
        .orWhereILike('email', `%${search}%`)
    })
  }

  if (sortField && ['id', 'name', 'email'].includes(sortField)) {
    query.orderBy(sortField, sortOrder)
  }

  return await query.paginate(page, limit)
}


  static async getUserById(id: number) {
    const user = await User.findOrFail(id)
    await user.load('posts')
    await user.load('setting')
    return user
  }

  static async createUser(data: { name: string; email: string }, settings?: { phone: string; city: string }) {
    const user = await User.create(data)

    if (settings) {
      await user.related('setting').create(settings)
    }

    await user.load('setting')
    return user
  }

  static async updateUser(
    id: number,
    data: { name?: string; email?: string },
    settings?: { phone: string; city: string }
  ) {
    const user = await User.findOrFail(id)

    user.merge(data)
    await user.save()

    if (settings) {
      await user.load('setting')

      if (user.setting) {
        user.setting.merge(settings)
        await user.setting.save()
      } else {
        await user.related('setting').create(settings)
      }
    }

    await user.load('setting')
    return user
  }

  static async deleteUser(id: number) {
    const user = await User.findOrFail(id)
    await user.delete()
  }
}
