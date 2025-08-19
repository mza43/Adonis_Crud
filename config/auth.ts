// // config/auth.ts
// import { defineConfig } from '@adonisjs/auth'
// import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens'

// const authConfig = defineConfig({
//   default: 'api',
//   guards: {
//     api: tokensGuard({
//       provider: tokensUserProvider({
//         model: () => import('#models/user'),
//         tokens: 'accessTokens',   // ✅ use the static property name
//       }),
//     }),
//   },
// })

// export default authConfig

// config/auth.ts
import { defineConfig } from '@adonisjs/auth'
import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens'

const authConfig = defineConfig({
  default: 'api',
  guards: {
    api: tokensGuard({
      provider: tokensUserProvider({
        model: () => import('#models/user'),
        tokens: 'accessTokens', // static property name on the model
      }),
    }),
  },
})

export default authConfig
