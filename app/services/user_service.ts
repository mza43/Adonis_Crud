import User from '../models/user.js'

export default class UserService {
  static async getAllUsers() {
    return await User.query().preload('posts').preload('setting')
  }
// app/services/user_service.ts

// user_service.ts
// static async getPaginatedUsers({
//   page = 1,
//   limit = 20,
//   search = '',
//   sortField = 'id',
//   sortOrder = 'asc',
// }: {
//   page?: number
//   limit?: number
//   search?: string
//   sortField?: string
//   sortOrder?: 'asc' | 'desc'
// }) {
//   const query = User.query()
//     .preload('posts')
//     .preload('setting')

//   if (search) {
//     query.where((builder) => {
//       builder
//         .whereILike('name', `%${search}%`)
//         .orWhereILike('email', `%${search}%`)
//         .orWhereHas('setting', (settingQuery) => {
//           settingQuery
//             .whereILike('phone', `%${search}%`)
//             .orWhereILike('city', `%${search}%`)
//         })
//     })
//   }

//   if (sortField && ['id', 'name', 'email'].includes(sortField)) {
//     query.orderBy(sortField, sortOrder)
//   }

//   return await query.paginate(page, limit)
// }

// new
static async getPaginatedUsers({
    page = 1,
    limit = 20,
    q = "",
    filters = {},
    sortField = "id",
    sortOrder = "asc",
  } = {}) {
    // Start query; we will preload relations
    let query = User.query().preload("posts").preload("setting");

    // If caller provided per-field filters -> apply them specifically
    const hasFieldFilters = filters && Object.keys(filters).length > 0;

    if (hasFieldFilters) {
      if (filters.id) {
        // If id is numeric, match by id exact (you could improve parsing)
        query.where("id", filters.id);
      }
      if (filters.name) {
        query.whereILike("name", `%${filters.name}%`);
      }
      if (filters.email) {
        query.whereILike("email", `%${filters.email}%`);
      }
      if (filters.phone) {
        query.whereHas("setting", (settingQuery) => {
          settingQuery.whereILike("phone", `%${filters.phone}%`);
        });
      }
      if (filters.city) {
        query.whereHas("setting", (settingQuery) => {
          settingQuery.whereILike("city", `%${filters.city}%`);
        });
      }
    } else if (q) {
      // Global search across name, email, and setting fields
      query.where((builder) => {
        builder
          .whereILike("name", `%${q}%`)
          .orWhereILike("email", `%${q}%`)
          .orWhereHas("setting", (settingQuery) => {
            settingQuery.whereILike("phone", `%${q}%`).orWhereILike("city", `%${q}%`);
          });
      });
    }

   
    if (sortField) {
      if (["id", "name", "email"].includes(sortField)) {
        query.orderBy(sortField, sortOrder);
      } else if (sortField.startsWith("setting.")) {
       
        const [, settingField] = sortField.split(".");
        
        query = query
          .join("settings", "settings.user_id", "users.id")
          .select("users.*")
          .orderBy(`settings.${settingField}`, sortOrder);
      }
    }

    
    const paginated = await query.paginate(page, limit);
    return paginated;
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
