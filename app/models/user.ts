// app/models/user.ts

// import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
// app/models/user.ts

import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

import Post from './post.js'
import Setting from './setting.js'

// AuthFinder provides verifyCredentials and (importantly) auto-hashes password via a beforeSave hook
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true }) declare id: number
  @column() declare name: string
  @column() declare email: string
  @column({ serializeAs: null }) declare password: string

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    table: 'auth_access_tokens',
    // expiresIn: '30 days',
    // prefix: 'oat_',
  })

  @hasMany(() => Post) declare posts: HasMany<typeof Post>
  @hasOne(() => Setting) declare setting: HasOne<typeof Setting>
}
