const strRule = {
  type: 'string',
  maxLength: 255,
}

// 创建作品 schema
const workInfoSchema = {
  type: 'object',
  required: ['title'],
  properties: {
    title: strRule,
    desc: strRule,
    coverImg: strRule,
    contentId: strRule,
    // 作品内容
    content: {
      type: 'object',
      properties: {
        _id: strRule,
        components: {
          type: 'array',
        },
        props: {
          type: 'object',
        },
        setting: {
          type: 'object',
        },
      },
    },
  },
}

module.exports = {
  workInfoSchema,
}
