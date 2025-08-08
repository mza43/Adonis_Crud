import Category from '#models/category'

export default class CategoryService {
  static async getAll() {
    return await Category.all()
  }

  static async create(data) {
    return await Category.create(data)
  }

  static async getById(id) {
    const category = await Category.findOrFail(id)
    await category.load('posts')
    return category
  }

  static async update(id, data) {
    const category = await Category.findOrFail(id)
    category.merge(data)
    await category.save()
    return category
  }

  static async delete(id) {
    const category = await Category.findOrFail(id)
    await category.delete()
    return true
  }
}
