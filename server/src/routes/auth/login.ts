import axios from 'axios';
import dotenv from 'dotenv';
import Koa from 'koa';

import { noAuth } from '../../middleware/auth';
import { Route } from '../../types';
import { CustomError } from './../../utils/CustomError';

dotenv.config()

export const auth: Route[] = [
  {
    path: '/auth/login.json',
    access: noAuth,
    post: async (ctx: Koa.Context) => {
        const response = await axios({
          method: 'post',
          url: process.env.API_URL + '/auth/login.json',
          headers: {
            'Content-Type': 'application/json'
          },
          data : ctx.request.body
        });
        // eslint-disable-next-line no-console
        console.log("response data is: ", response.data)

        if(response.data.accessToken === null)
        throw new CustomError('authentication-error', response.data)

      ctx.body = response.data
    },
  }
]