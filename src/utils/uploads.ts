import multer, {
  FileFilterCallback,
  DiskStorageOptions,
  StorageEngine,
} from 'multer';
import express from 'express';
import multerS3 from 'multer-s3';
import path from 'path';
import fs from 'fs';
import { appMessage, logger } from '../utils';
import { awsConfig } from '../config';
import { callbackFile, IMimeTypes, LocationFiles, S3File } from 'utils/uploads';
import { ErrnoException } from 'node/server';

const {
  TYPE_UPLOAD,
  NODE_ENV,
  LIMIT_UPLOAD_FILES,
  LIMIT_UPLOAD_FILES_FORUM_POST,
  S3_BUCKET_NAME_FILE,
  S3_BUCKET_NAME_ENCRYPT_FILE,
  S3_BUCKET_NAME_LOGO,
  S3_BUCKET_NAME_AVATAR,
  S3_BUCKET_NAME_BETA,
} = process.env;

const limitFiles = {
  /** Maximum number of file fields. (Default: Infinity) */
  files: Number(LIMIT_UPLOAD_FILES) || 20,
};

const limitFileForumPosts = {
  /** Maximum number of file fields. (Default: Infinity) */
  files: Number(LIMIT_UPLOAD_FILES_FORUM_POST) || 2,
};

const MIME_TYPES: IMimeTypes = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
};

const getName = (file: Express.Multer.File): string => {
  let name =
    file.originalname.length > 50
      ? file.originalname.substring(0, 50)
      : file.originalname;
  name = name
    .toLowerCase()
    .replace(/[\.\&\#\[\]\{\}\=\\\'\!\?\"\+\*\/\@]/gi, '');
  name = name.split(' ').join('_');
  const mimetype: string = file.mimetype;
  const extension = MIME_TYPES[mimetype];
  return name + Date.now() + '.' + extension;
};

const fileName = (
  req: express.Request,
  file: Express.Multer.File,
  callback: callbackFile,
): void => {
  const fieldname = file.fieldname;
  let nameFile: string;
  switch (fieldname) {
    case 'encrypt-file':
    case 'encrypt-files':
      nameFile = 'encrypt_file_' + getName(file);
    case 'file':
    case 'files':
      nameFile = 'file_' + getName(file);
      break;
    case 'logo':
    case 'avatar':
      nameFile = 'image_' + getName(file);
      break;
    case 'beta':
      nameFile = 'beta_' + getName(file);
      break;
    case 'forum-image':
      nameFile = 'forum_image_' + getName(file);
      break;
    case 'forum-post-files':
      nameFile = 'forum_file_' + getName(file);
      break;
    case 'cover':
    case 'blog-cover':
      nameFile = 'blog_cover_' + getName(file);
      break;
    case 'blog-post':
      nameFile = 'blog_post_' + getName(file);
      break;
    default:
      nameFile = 'other_' + getName(file);
  }
  callback(null, nameFile);
};

const acceptAllFile = (
  req: express.Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif'
  ) {
    callback(null, true);
  } else {
    callback(new Error(appMessage.server.ERROR_UPLOAD_IMAGE));
  }
};

const filterFile = (
  req: express.Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    callback(null, true);
  } else {
    callback(new Error(appMessage.server.ERROR_UPLOAD_FILE));
  }
};

const filterImage = (
  req: express.Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif'
  ) {
    callback(null, true);
  } else {
    callback(new Error(appMessage.server.ERROR_UPLOAD_IMAGE));
  }
};

const storageS3 = (nameBucket: string, typeFile: string): StorageEngine => {
  return multerS3({
    s3: awsConfig.s3,
    bucket: nameBucket,
    acl: 'public-read',
    cacheControl: 'max-age=31536000',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: fileName,
  });
};

const storageLocal = (
  path: string,
  filename: DiskStorageOptions['filename'],
): StorageEngine => {
  return multer.diskStorage({
    destination: (
      req: express.Request,
      file: Express.Multer.File,
      callback: callbackFile,
    ) => {
      callback(null, path);
    },
    filename,
  });
};

const pathLocation = (typeFile: string) => {
  let location: string;
  switch (typeFile) {
    case 'logo':
      location = '/public/logos/';
      break;
    case 'avatar':
      location = '/public/avatars/';
      break;
    case 'beta':
      location = '/public/beta/';
      break;
    case 'encrypt-files':
    case 'encrypt-file':
      location = '/public/encrypt_files/';
      break;
    default:
      location = '/public/files/';
      break;
  }
  return location;
};

const pathLocationS3 = (typeFile: string) => {
  switch (typeFile) {
    case 'logo':
      return S3_BUCKET_NAME_LOGO;
    case 'avatar':
      return S3_BUCKET_NAME_AVATAR;
    case 'beta':
      return S3_BUCKET_NAME_BETA;
    case 'encrypt-files':
    case 'encrypt-file':
      return S3_BUCKET_NAME_ENCRYPT_FILE;
    default:
      return S3_BUCKET_NAME_FILE;
  }
};

const retrieveLocationFiles = (
  req: express.Request,
  typeFile: string,
): LocationFiles[] => {
  const location = pathLocation(typeFile);
  // any is replace by Express.Multer.File without aws SDK
  const files = (req.files as Express.Multer.File[]).map((value: any) => {
    return TYPE_UPLOAD === 'S3'
      ? { path: value.location, filename: value.key }
      : {
          path: `${req.protocol}://${req.get('host')}${location}${
            value.filename
          }`,
          filename: value.filename,
        };
  });
  return files;
};

// any is replace by express.Request without aws SDK
const retrieveLocationFile = (req: any, typeFile: string): string => {
  const location = pathLocation(typeFile);
  return TYPE_UPLOAD === 'S3'
    ? req.file.location
    : `${req.protocol}://${req.get('host')}${location}${req.file.filename}`;
};

const deleteFile = async (
  typeFile: string,
  reqFile: any,
): Promise<void | Error> => {
  if (TYPE_UPLOAD === 'S3') {
    const Bucket = pathLocationS3(typeFile);
    const key = reqFile.key ? reqFile.key : reqFile;
    const params = {
      Bucket: Bucket ? Bucket : '',
      Key: key,
    };
    awsConfig.s3.deleteObject(params, function (err, data) {
      if (err) {
        NODE_ENV !== 'production'
          ? console.log('Error uploading data: ', err)
          : logger.errorLog(JSON.stringify(err));
      } else {
        NODE_ENV !== 'production'
          ? console.log('s3 file deleted successfully')
          : null;
      }
    });
  } else {
    let pathDir: string;
    switch (typeFile) {
      case 'logo':
        pathDir = '../../public/logos';
        break;
      case 'avatar':
        pathDir = '../../public/avatars';
        break;
      case 'beta':
        pathDir = '../../public/beta';
        break;
      case 'forum-image':
      case 'forum-post-files':
        pathDir = '../../public/forums';
        break;
      case 'cover':
      case 'blog-cover':
      case 'blog-post':
        pathDir = '../../public/blogs/';
        break;
      case 'encrypt-files':
        pathDir = '../../public/encrypt_files/';
        break;
      default:
        pathDir = '../../public/files';
        break;
    }
    const pathFile = path.join(__dirname, pathDir, reqFile.filename);
    fs.stat(pathFile, (err: ErrnoException | null, stats: fs.Stats): void => {
      if (err) {
        throw new Error(err.toString());
      }
      fs.unlink(pathFile, (err: ErrnoException | null) => {
        if (err) throw new Error(err.toString());
        NODE_ENV !== 'production'
          ? console.log('file deleted successfully')
          : null;
      });
    });
  }
};

const deleteFiles = async (typeFile: string, files: any[]): Promise<void> => {
  if (TYPE_UPLOAD === 'S3') {
    files
      .reduce((acc: S3File[], file: any) => {
        const objFile = file.location
          ? { key: file.location }
          : { key: file.filename };
        acc.push(objFile);
        return acc;
      }, [])
      .map(async (value: S3File) => {
        try {
          await deleteFile(typeFile, value);
        } catch (error) {
          throw new Error(error);
        }
      });
  } else {
    files.map(async (value: Express.Multer.File) => {
      try {
        await deleteFile(typeFile, { filename: value.filename });
      } catch (error) {
        throw new Error(error);
      }
    });
  }
};

const deleteOldFile = async (typeFile: string, image: string) => {
  try {
    const list = image.split('/');
    const nameImage = list[list.length - 1];
    const reqFile =
      TYPE_UPLOAD === 'S3' ? { key: nameImage } : { filename: nameImage };
    return await deleteFile(typeFile, reqFile);
  } catch (error) {
    throw new Error(error);
  }
};

export {
  limitFiles,
  limitFileForumPosts,
  filterFile,
  filterImage,
  acceptAllFile,
  storageS3,
  storageLocal,
  fileName,
  retrieveLocationFiles,
  retrieveLocationFile,
  deleteFile,
  deleteFiles,
  deleteOldFile,
};
