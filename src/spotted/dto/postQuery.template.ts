export const postQueryTemplate = {
  id: true,
  createdAt: true,
  title: true,
  text: true,
  isAnonymous: true,
  author: {
    select: {
      username: true,
      name: true,
      surname: true,
    },
  },
};
