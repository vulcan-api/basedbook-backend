export const postQueryTemplate = {
  id: true,
  createdAt: true,
  title: true,
  text: true,
  isAnonymous: true,
  _count: {
    select: {
      Like: true,
      Dislike: true,
    },
  },
  author: {
    select: {
      username: true,
      name: true,
      surname: true,
    },
  },
};
