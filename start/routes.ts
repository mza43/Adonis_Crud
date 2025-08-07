/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import CategoriesController from '../app/controllers/categories_controller.js'
import PostsController from '../app/controllers/posts_controller.js'
import SettingsController from '../app/controllers/settings_controller.js'
import UsersController from '../app/controllers/users_controller.js'

// Users routes

router
  .group(() => {
    router.get('/', [UsersController, 'index'])
    router.get('/:id', [UsersController, 'show'])
    router.post('/', [UsersController, 'store'])
    router.put('/:id', [UsersController, 'update'])
    router.delete('/:id', [UsersController, 'destroy'])
  })
  .prefix('/api/users')

// Posts routes

router
  .group(() => {
    router.get('/', [PostsController, 'index'])
    router.get('/:id', [PostsController, 'show'])
    router.post('/', [PostsController, 'store'])
    router.put('/:id', [PostsController, 'update'])
    router.delete('/:id', [PostsController, 'destroy'])
  })
  .prefix('/api/posts')

//   category

router
  .group(() => {
    router.get('/', [CategoriesController, 'index'])
    router.post('/', [CategoriesController, 'store'])
    router.get('/:id', [CategoriesController, 'show'])
    router.put('/:id', [CategoriesController, 'update'])
    router.delete('/:id', [CategoriesController, 'destroy'])
  })
  .prefix('/api/categories')

// settings

router
  .group(() => {
    router.get('/', [SettingsController, 'index'])
    router.post('/', [SettingsController, 'store'])
    router.get('/:id', [SettingsController, 'show'])
    router.put('/:id', [SettingsController, 'update'])
    router.delete('/:id', [SettingsController, 'destroy'])
  })
  .prefix('/api/settings')

// Home page route

router.get('/', async () => {
  return 'server is runging'
})
