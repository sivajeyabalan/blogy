import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const PostMessage = sequelize.define('PostMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  creator: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  selectedFile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  likes: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  comments: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: [],
  },
}, {
  tableName: 'posts',
  timestamps: true,
});

export default PostMessage;