import express from 'express';
import { errors, appMessage } from '../../../utils';
import { db } from '../..';
import _ from 'lodash';
import { Op } from 'sequelize';

const getUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const userId = req.params.id;
    const user = await db.User.findByPk(req.params.id, {
      attributes: {
        exclude: ['password', 'confimEmailUuid', 'tokenResetPassword'],
      },
    });
    if (!user) {
      throw new Error(appMessage.server.ERROR_NOT_EXIST('user'));
    }
    res.status(200).json({ response: { user } });
  } catch (error) {
    next(new errors.httpRequest.BadRequestError(error));
  }
};

const updateUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    //req.body.context allow to retrieve the information about token
    const user = req.body.context;
    if (Number(user.id) !== Number(req.params.id)) {
      throw new Error(appMessage.server.ERROR_BAD_RIGHT('user'));
    }
    const forms = Object.assign({}, req.body);
    //delete the body context and if there are param id
    delete forms.context;
    delete forms.id;
    const isUpdated = await db.User.update(forms, {
      where: {
        id: req.params.id,
      },
    });
    if (!isUpdated[0]) {
      throw new Error(appMessage.server.ERROR_UPDATE_RECORD('user'));
    }
    res
      .status(200)
      .json({
        response: {
          user: forms,
          message: appMessage.server.SUCCESS_UPDATE_RECORD('user'),
        },
      });
  } catch (error) {
    next(new errors.httpRequest.NotFoundRequestError(error));
  }
};

const deleteUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    if (!req.params.id) {
      throw new Error(appMessage.server.MISSED_INFOS);
    }
    //req.body.context allow to retrieve the information about token
    const user = req.body.context;
    if (Number(user.id) !== Number(req.params.id)) {
      throw new Error(appMessage.server.ERROR_BAD_RIGHT('user'));
    }
    //USE TRANSACTION FOR DELETE ALL DATA
    const isDeleted = await db.User.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!isDeleted) {
      throw new Error(appMessage.server.ERROR_DELETE_RECORD('user'));
    }
    res
      .status(200)
      .json({ response: appMessage.server.SUCCESS_DELETE_RECORD('user') });
  } catch (error) {
    next(new errors.httpRequest.NotFoundRequestError(error));
  }
};

export { getUser, updateUser, deleteUser };
