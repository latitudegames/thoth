import Koa from 'koa'
import { noAuth } from './../../middleware/auth'
import { Route } from 'src/types'
import { database } from '../../database'
import { AddClient, EditClient } from './types'
import { isValidObjectWithValues, makeResponse } from '../../utils/utils'

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

export const settings: Route[] = [
  {
    path: '/setting/client',
    access: noAuth,
    post: addClient,
    patch: editClient,
    delete: deleteClient,
  },
]
