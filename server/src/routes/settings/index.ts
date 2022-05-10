import Koa from 'koa'
import { noAuth } from './../../middleware/auth'
import { Route } from 'src/types'
import { database } from '../../database'
import {
  AddClient,
  AddConfiguration,
  AddScope,
  AddScopeOptional,
  ClientFilterOptions,
  ConfigurationFilterOptions,
  EditClient,
  EditConfiguration,
  EditScope,
} from './types'
import {
  isValidObject,
  isValidObjectWithValues,
  makeResponse,
} from '../../utils/utils'
import { isString } from 'lodash'

const addClient = async (ctx: Koa.Context) => {
  const { body } = ctx.request
  try {
    if (isValidObjectWithValues(body, ['defaultValue'])) {
      const { isAlreadyExists, data, success } =
        await database.instance.addClientSetting(body as AddClient)
      if (isAlreadyExists)
        return (
          (ctx.body = makeResponse('Setting already exists!', data)),
          (ctx.status = 201)
        )
      if (success)
        return (ctx.body = makeResponse('Setting added successfully', data))
    }
    return (
      (ctx.body = makeResponse(
        'Some fields are missing, send valid body!',
        {}
      )),
      (ctx.status = 400)
    )
  } catch (error) {
    console.error('Error: addClient =>', error)
    return (
      (ctx.body = makeResponse('Something went wrong!', {})), (ctx.status = 400)
    )
  }
}

const editClient = async (ctx: Koa.Context) => {
  const {
    body,
    query: { id = null },
  } = ctx.request

  if (!id)
    return (ctx.body = makeResponse('Send valid id!', {})), (ctx.status = 400)

  try {
    if (isValidObjectWithValues(body, ['defaultValue'])) {
      const { success, data, isExists } =
        await database.instance.editClientSetting(
          body as EditClient,
          id as string | number
        )

      if (!isExists)
        return (
          (ctx.body = makeResponse('Setting not available in record!', {})),
          (ctx.status = 201)
        )
      if (success)
        return (ctx.body = makeResponse('Setting updated successfully', data))

      throw Error('Something went wrong!')
    }
    return (
      (ctx.body = makeResponse(
        'Some fields are missing, send valid body!',
        {}
      )),
      (ctx.status = 400)
    )
  } catch (error) {
    console.error('Error: editClient =>', error)
    return (
      (ctx.body = makeResponse('Something went wrong!', {})), (ctx.status = 400)
    )
  }
}

const deleteClient = async (ctx: Koa.Context) => {
  const {
    query: { id = null },
  } = ctx.request

  if (!id)
    return (ctx.body = makeResponse('Send valid id!', {})), (ctx.status = 400)

  try {
    const { success, data, isExists } =
      await database.instance.deleteClientSetting(id as string | number)

    if (!isExists)
      return (
        (ctx.body = makeResponse('Setting not available in record!', {})),
        (ctx.status = 201)
      )
    if (success)
      return (ctx.body = makeResponse('Setting deleted successfully', data))

    throw Error('Something went wrong!')
  } catch (error) {
    console.error('Error: editClient =>', error)
    return (
      (ctx.body = makeResponse('Something went wrong!', {})), (ctx.status = 400)
    )
  }
}

const getAllClient = async (ctx: Koa.Context) => {
  let { query } = ctx.request as Koa.Request

  let { page, per_page } = query as ClientFilterOptions

  page = page || (1 as any)
  per_page = per_page || (10 as any)

  try {
    const { success, data } = await database.instance.getAllClientSetting({
      page,
      per_page,
    })

    if (success) return (ctx.body = makeResponse('Records available', data))

    return (ctx.body = makeResponse('Records are not available', data))
  } catch (error) {
    console.error('Error: editClient =>', error)
    return (
      (ctx.body = makeResponse('Something went wrong!', {})), (ctx.status = 400)
    )
  }
}

const addConfiguration = async (ctx: Koa.Context) => {
  const { body } = ctx.request
  try {
    if (isValidObjectWithValues(body, [])) {
      const { isAlreadyExists, data, success } =
        await database.instance.addConfigurationSetting(
          body as AddConfiguration
        )

      if (isAlreadyExists)
        return (
          (ctx.body = makeResponse('Configuration already exists!', data)),
          (ctx.status = 201)
        )

      if (success)
        return (ctx.body = makeResponse(
          'Configuration added successfully',
          data
        ))
    }

    return (
      (ctx.body = makeResponse(
        'Some fields are missing, send valid body!',
        {}
      )),
      (ctx.status = 400)
    )
  } catch (error) {
    console.error('Error: addConfiguration =>', error)
    return (
      (ctx.body = makeResponse('Something went wrong!', {})), (ctx.status = 400)
    )
  }
}

const editConfiguration = async (ctx: Koa.Context) => {
  const {
    body,
    query: { id = null },
  } = ctx.request

  if (!id)
    return (ctx.body = makeResponse('Send valid id!', {})), (ctx.status = 400)

  try {
    if (isValidObjectWithValues(body, ['value'])) {
      const { success, data, isExists } =
        await database.instance.editConfigurationSetting(
          body as EditConfiguration,
          id as string | number
        )

      if (!isExists)
        return (
          (ctx.body = makeResponse(
            'Configuration not available in record!',
            {}
          )),
          (ctx.status = 201)
        )
      if (success)
        return (ctx.body = makeResponse(
          'Configuration updated successfully',
          data
        ))

      throw Error('Something went wrong!')
    }
    return (
      (ctx.body = makeResponse(
        'Some fields are missing, send valid body!',
        {}
      )),
      (ctx.status = 400)
    )
  } catch (error) {
    console.error('Error: editConfiguration =>', error)
    return (
      (ctx.body = makeResponse('Something went wrong!', {})), (ctx.status = 400)
    )
  }
}

const getAllConfiguration = async (ctx: Koa.Context) => {
  let { query } = ctx.request as Koa.Request

  let { page, per_page } = query as ConfigurationFilterOptions

  page = page || (1 as any)
  per_page = per_page || (10 as any)

  try {
    const { success, data } =
      await database.instance.getAllConfigurationSettings({
        page,
        per_page,
      })

    if (success) return (ctx.body = makeResponse('Records available', data))

    return (ctx.body = makeResponse('Records are not available', data))
  } catch (error) {
    console.error('Error: getAllConfiguration =>', error)
    return (
      (ctx.body = makeResponse('Something went wrong!', {})), (ctx.status = 400)
    )
  }
}

const deleteConfiguration = async (ctx: Koa.Context) => {
  const {
    query: { id = null },
  } = ctx.request

  if (!id)
    return (ctx.body = makeResponse('Send valid id!', {})), (ctx.status = 400)

  try {
    const { success, data, isExists } =
      await database.instance.deleteConfigurationSetting(id as string | number)

    if (!isExists)
      return (
        (ctx.body = makeResponse('Setting not available in record!', {})),
        (ctx.status = 201)
      )
    if (success)
      return (ctx.body = makeResponse('Setting deleted successfully', data))

    throw Error('Something went wrong!')
  } catch (error) {
    console.error('Error: deleteConfiguration =>', error)
    return (
      (ctx.body = makeResponse('Something went wrong!', {})), (ctx.status = 400)
    )
  }
}

const addScope = async (ctx: Koa.Context) => {
  const { body } = ctx.request
  try {
    if (
      isValidObjectWithValues(body, [
        AddScopeOptional.FULLTABLESIZE,
        AddScopeOptional.RECORDCOUNT,
        AddScopeOptional.TABLESIZE,
      ])
    ) {
      if (!isValidObject(body.fullTableSize)) {
        body.fullTableSize = '0 bytes'
      } else {
        body.fullTableSize = `${body.fullTableSize.value} ${body.fullTableSize.label}`
      }

      if (!isValidObject(body.tableSize)) {
        body.tableSize = '0 bytes'
      } else {
        body.tableSize = `${body.tableSize.value} ${body.tableSize.label}`
      }

      if (!body.recordCount) {
        body.recordCount = '0'
      }

      const { isAlreadyExists, data, success } =
        await database.instance.addScopeSetting(body as AddScope)

      if (isAlreadyExists)
        return (
          (ctx.body = makeResponse('Scope already exists!', data)),
          (ctx.status = 201)
        )

      if (success)
        return (ctx.body = makeResponse('Scope added successfully', data))
    }

    return (
      (ctx.body = makeResponse(
        'Some fields are missing, send valid body!',
        {}
      )),
      (ctx.status = 400)
    )
  } catch (error) {
    console.error('Error: addScope =>', error)
    return (
      (ctx.body = makeResponse('Something went wrong!', {})), (ctx.status = 400)
    )
  }
}

const editScope = async (ctx: Koa.Context) => {
  const {
    body,
    query: { id = null },
  } = ctx.request

  if (!id)
    return (ctx.body = makeResponse('Send valid id!', {})), (ctx.status = 400)

  try {
    if (
      isValidObjectWithValues(body, [
        AddScopeOptional.FULLTABLESIZE,
        AddScopeOptional.RECORDCOUNT,
        AddScopeOptional.TABLESIZE,
      ])
    ) {
      if (!isValidObject(body.fullTableSize)) {
        body.fullTableSize = '0 bytes'
      } else {
        body.fullTableSize = `${body.fullTableSize.value} ${body.fullTableSize.label}`
      }

      if (!isValidObject(body.tableSize)) {
        body.tableSize = '0 bytes'
      } else {
        body.tableSize = `${body.tableSize.value} ${body.tableSize.label}`
      }

      if (!body.recordCount) {
        body.recordCount = '0'
      }

      const { success, data, isExists } =
        await database.instance.editScopeSetting(
          body as EditScope,
          id as string | number
        )

      if (!isExists)
        return (
          (ctx.body = makeResponse('Scope not available in record!', {})),
          (ctx.status = 201)
        )
      if (success)
        return (ctx.body = makeResponse('Scope updated successfully', data))

      throw Error('Something went wrong!')
    }
    return (
      (ctx.body = makeResponse(
        'Some fields are missing, send valid body!',
        {}
      )),
      (ctx.status = 400)
    )
  } catch (error) {
    console.error('Error: editScope =>', error)
    return (
      (ctx.body = makeResponse('Something went wrong!', {})), (ctx.status = 400)
    )
  }
}

const getAllScope = async (ctx: Koa.Context) => {
  let { query } = ctx.request as Koa.Request

  let { page, per_page } = query as ConfigurationFilterOptions

  page = page || (1 as any)
  per_page = per_page || (10 as any)

  try {
    const { success, data } = await database.instance.getAllScopeSettings({
      page,
      per_page,
    })

    if (success) return (ctx.body = makeResponse('Records available', data))

    return (ctx.body = makeResponse('Records are not available', data))
  } catch (error) {
    console.error('Error: getAllScope =>', error)
    return (
      (ctx.body = makeResponse('Something went wrong!', {})), (ctx.status = 400)
    )
  }
}

const deleteScope = async (ctx: Koa.Context) => {
  const {
    query: { id = null },
  } = ctx.request

  if (!id)
    return (ctx.body = makeResponse('Send valid id!', {})), (ctx.status = 400)

  try {
    const { success, data, isExists } =
      await database.instance.deleteScopeSetting(id as string | number)

    if (!isExists)
      return (
        (ctx.body = makeResponse('Setting not available in record!', {})),
        (ctx.status = 201)
      )
    if (success)
      return (ctx.body = makeResponse('Setting deleted successfully', data))

    throw Error('Something went wrong!')
  } catch (error) {
    console.error('Error: deleteScope =>', error)
    return (
      (ctx.body = makeResponse('Something went wrong!', {})), (ctx.status = 400)
    )
  }
}

export const settings: Route[] = [
  {
    path: '/setting/client',
    access: noAuth,
    post: addClient,
    patch: editClient,
    delete: deleteClient,
    get: getAllClient,
  },
  {
    path: '/setting/configuration',
    access: noAuth,
    get: getAllConfiguration,
    post: addConfiguration,
    patch: editConfiguration,
    delete: deleteConfiguration,
  },
  {
    path: '/setting/scope',
    access: noAuth,
    get: getAllScope,
    post: addScope,
    patch: editScope,
    delete: deleteScope,
  },
]
