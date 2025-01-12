import { prisma } from "$lib/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const data = await prisma.post.findMany({
    where: {
      public: true
    }
  });

  console.log(data);

  if (data.length == 0) {
    return { data: []}
  }

  return { data: {...data}};
};