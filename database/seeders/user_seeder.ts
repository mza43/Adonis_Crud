import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker'
import User from '#models/user'
import Setting from '#models/setting'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Generate 500 fake users
    const usersPayload = Array.from({ length: 500 }).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
    }))

    // Create users
    const createdUsers = await User.createMany(usersPayload)

    // Create settings for each user
    const settingsPayload = createdUsers.map((user) => ({
      phone: faker.phone.number('+92##########'),
      city: faker.location.city(),
      userId: user.id,
    }))

    await Setting.createMany(settingsPayload)
  }
}
