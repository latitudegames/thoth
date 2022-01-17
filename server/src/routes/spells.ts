/* eslint-disable no-console */
import axios from 'axios';
import Koa from 'koa';

import { sessionOrApiKeyAuth } from '../middleware/auth';
import { Route } from '../types';
import { CustomError } from '../utils/CustomError';

const saveHandler = async (ctx: Koa.Context) => {
  const body =
    typeof ctx.request.body === 'string'
      ? JSON.parse(ctx.request.body)
      : ctx.request.body

  if (!body) throw new CustomError('input-failed', 'No parameters provided')

  const response = await axios({
    method: 'POST',
    url: process.env.API_URL + '/game/spells/save',
    headers: ctx.headers,
    data: ctx.request.body
  });

  ctx.body = response.data
}

const newHandler = async (ctx: Koa.Context) => {

  const response = await axios({
    method: 'POST',
    url: process.env.API_URL + '/game/spells/save',
    headers: ctx.headers,
    data: ctx.request.body
  });

  ctx.body = response.data

}

const patchHandler = async (ctx: Koa.Context) => {
  const response = await axios({
    method: 'POST',
    url: process.env.API_URL + '/game/spells/save',
    headers: ctx.headers,
    data: ctx.request.body
  });

  ctx.body = response.data
}

const getSpellsHandler = async (ctx: Koa.Context) => {
  const response = await axios({
    method: 'GET',
    url: process.env.API_URL + '/game/spells',
    headers: ctx.headers,
    data: ctx.request.body
  });

  ctx.body = response.data
}

const getSpellHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name

  const response = await axios({
    method: 'GET',
    url: process.env.API_URL + '/game/spells/' + name,
    headers: ctx.headers,
    data: ctx.request.body
  });

  ctx.body = response.data
}

const deleteHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name

  const response = await axios({
    method: 'DELETE',
    url: process.env.API_URL + '/game/spells/' + name,
    headers: ctx.headers,
    data: ctx.request.body
  });

  ctx.body = response.data
}

const deploySpellHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name

  const response = await axios({
    method: 'POST',
    url: process.env.API_URL + '/game/spells/' + name + "/deploy",
    headers: ctx.headers,
    data: ctx.request.body
  });

  console.log(response.data);

  ctx.body = response.data
}

const getDeployedSpellsHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name

  const response = await axios({
    method: 'GET',
    url: process.env.API_URL + '/game/spells/deployed/' + name,
    headers: ctx.headers,
    data: ctx.request.body
  });

  ctx.body = response.data
}

const getDeployedSpellHandler = async (ctx: Koa.Context) => {
  const name = ctx.params.name
  const version = ctx.params.version

  const response = await axios({
    method: 'GET',
    url: process.env.API_URL + `/game/spells/deployed/${name}/${version}`,
    headers: ctx.headers,
    data: ctx.request.body
  });

  ctx.body = response.data
}

export const spells: Route[] = [
  {
    path: '/game/spells/save',
    access: sessionOrApiKeyAuth,
    post: saveHandler,
  },
  {
    path: '/game/spells',
    access: sessionOrApiKeyAuth,
    post: newHandler,
  },
  {
    path: '/game/spells/:spellName',
    access: sessionOrApiKeyAuth,
    patch: patchHandler,
  },
  {
    path: '/game/spells/:spellName',
    access: sessionOrApiKeyAuth,
    delete: deleteHandler,
  },
  {
    path: '/game/spells',
    access: sessionOrApiKeyAuth,
    get: getSpellsHandler,
  },
  {
    path: '/game/spells/:name',
    access: sessionOrApiKeyAuth,
    get: getSpellHandler,
  },
  {
    path: '/game/spells/:name/deploy',
    access: sessionOrApiKeyAuth,
    post: deploySpellHandler,
  },
  {
    path: '/game/spells/deployed/:name',
    access: sessionOrApiKeyAuth,
    get: getDeployedSpellsHandler,
  },
  {
    path: '/game/spells/deployed/:name/:version',
    access: sessionOrApiKeyAuth,
    get: getDeployedSpellHandler,
  },
]
