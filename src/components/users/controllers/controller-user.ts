import express from 'express';
import { errors, appMessage, pagination } from '../../../utils';
import { db } from '../..';
import _ from 'lodash';
import { Op } from 'sequelize';

const getUsers = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const searchMainIndustry = req.query.categories
      ? {
          where: {
            id: { [Op.in]: req.query.categories.toString().split(',') },
          },
        }
      : {};
    const searchOtherIndustry = req.query.otherCategories
      ? {
          where: {
            id: { [Op.in]: req.query.otherCategories.toString().split(',') },
          },
        }
      : {};
    const searchTag = req.query.tags
      ? {
          where: {
            id: { [Op.in]: req.query.tags.toString().split(',') },
          },
        }
      : {};
    //If we use includes for research in association we delete it beforre the normal research
    delete req.query.categories;
    delete req.query.otherCategories;
    delete req.query.tags;

    const include = {
      attributes: {
        exclude: ['password', 'confimEmailUuid', 'tokenResetPassword'],
      },
      include: [
        {
          model: db.UserWaitingListCompany,
        },
        {
          model: db.Category,
          as: 'CategoryMainIndustryUser',
          attributes: ['id', 'nameFr', 'nameEn'],
          ...searchMainIndustry,
        },
        {
          model: db.Category,
          as: 'CategoryOtherIndustryUser',
          attributes: ['id', 'nameFr', 'nameEn'],
          ...searchOtherIndustry,
        },
        {
          model: db.Tag,
          as: 'TagCompetenceUser',
          attributes: ['id', 'nameFr', 'nameEn'],
          ...searchTag,
        },
        {
          model: db.UserFreelanceInformation,
          attributes: [
            'id',
            'levelExperience',
            'yearExperience',
            'businessSizeExperience',
          ],
        },
        {
          model: db.Company,
          as: 'Company',
          attributes: ['id', 'name'],
        },
      ],
    };
    const results = await pagination.getListByPagination(
      req.query,
      db.User,
      include,
    );
    res.status(200).json({ response: { results } });
  } catch (error) {
    next(new errors.httpRequest.BadRequestError(error));
  }
};

const getUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const userId = req.params.id;
    const include = [
      {
        model: db.Category,
        as: 'CategoryMainIndustryUser',
        attributes: ['id', 'nameFr', 'nameEn'],
      },
      {
        model: db.Category,
        as: 'CategoryOtherIndustryUser',
        attributes: ['id', 'nameFr', 'nameEn'],
      },
      {
        model: db.Tag,
        as: 'TagCompetenceUser',
        attributes: ['id', 'nameFr', 'nameEn'],
      },
      {
        model: db.Country,
        as: 'UserTargetCountry',
        attributes: ['id', 'nameFr', 'nameEn'],
      },
      {
        model: db.Requirement,
        attributes: [
          'id',
          'descriptionRequirement',
          'find_partners',
          'find_suppliers',
          'find_customers',
          'seeks_investor',
          'find_skills',
          'exchange_share',
          'trained_for_development',
          'other',
        ],
      },
      {
        model: db.Offer,
        as: 'Freelance',
        attributes: [
          'id',
          'title',
          'typeOffer',
          'anonymousName',
          'target',
          'dueDate',
          'public',
          'country',
        ],
      },
      {
        model: db.UserSkill,
      },
      {
        model: db.UserProfessionalExperience,
      },
      {
        model: db.UserWaitingListCompany,
      },
      {
        model: db.UserFreelanceInformation,
        attributes: [
          'id',
          'levelExperience',
          'yearExperience',
          'businessSizeExperience',
        ],
      },
    ];

    const user = await db.User.findByPk(req.params.id, {
      include,
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

const getMe = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const userId = req.body.context.id;
    const user = await db.User.findByPk(userId, {
      attributes: {
        exclude: ['password', 'confimEmailUuid', 'tokenResetPassword'],
      },
      include: [
        {
          model: db.UserSkill,
          attributes: [
            'id',
            'order',
            'name',
            'level',
            'colorTailwind',
            'colorHex',
          ],
        },
        {
          model: db.UserProfessionalExperience,
          attributes: [
            'id',
            'job',
            'company',
            'country',
            'city',
            'region',
            'currentPosition',
            'startDate',
            'endDate',
            'description',
          ],
        },
        {
          model: db.Requirement,
          attributes: [
            'id',
            'descriptionRequirement',
            'find_partners',
            'find_suppliers',
            'find_customers',
            'seeks_investor',
            'find_skills',
            'exchange_share',
            'trained_for_development',
            'other',
          ],
        },
        {
          model: db.Category,
          as: 'CategoryMainIndustryUser',
          attributes: ['id', 'nameEn', 'nameFr'],
        },
        {
          model: db.Category,
          as: 'CategoryOtherIndustryUser',
          attributes: ['id', 'nameEn', 'nameFr'],
        },
        {
          model: db.Tag,
          as: 'TagCompetenceUser',
          attributes: ['id', 'nameEn', 'nameFr'],
        },
        {
          model: db.Company,
          as: 'Company',
          attributes: ['id', 'name', 'status', 'logo'],
        },
        {
          model: db.Country,
          as: 'UserTargetCountry',
          attributes: ['id', 'nameEn', 'nameFr'],
        },
        {
          model: db.UserWaitingListCompany,
          attributes: ['invitation', 'status'],
          include: [
            {
              model: db.Company,
              attributes: ['id', 'name', 'status'],
            },
          ],
        },
        {
          model: db.UserFreelanceInformation,
          attributes: [
            'id',
            'levelExperience',
            'yearExperience',
            'businessSizeExperience',
          ],
        },
      ],
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

export { getUsers, getUser, getMe, updateUser, deleteUser };
