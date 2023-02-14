export const postQueryTemplate = {
  id: true,
  createdAt: true,
  title: true,
  text: true,
  isAnonymous: true,
  include: {
    _count: {
      select: { SpottedLikes: true },
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
