// database/migrations/xxxx_add_password_to_users.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('password').notNullable()
    })
  }

  async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('password')
    })
  }
}
