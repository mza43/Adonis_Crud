import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE')

      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')

      table.unique(['post_id', 'category_id']) // Prevent duplicate relations

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
