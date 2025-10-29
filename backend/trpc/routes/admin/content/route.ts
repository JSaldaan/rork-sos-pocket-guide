import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "@/backend/trpc/create-context";

// In-memory storage (replace with database in production)
let contentStore = {
  categories: [
    {
      id: 'pediatric',
      title: 'Pediatric',
      icon: 'https://r2-pub.rork.com/generated-images/fd1f887e-0282-4d28-99b5-960fb6aa24e2.png',
      colors: ['#87CEEB', '#5DADE2'],
      route: '/pediatric',
      order: 0,
    },
    {
      id: 'scores',
      title: 'Scores',
      icon: 'calculator',
      colors: ['#27AE60', '#229954'],
      route: '/scores',
      order: 1,
    },
    {
      id: 'waafels',
      title: 'WAAFELS',
      icon: 'https://r2-pub.rork.com/generated-images/4c78237e-8dbe-4bd2-9cac-110d3a975818.png',
      colors: ['#87CEEB', '#5DADE2'],
      route: '/waafels',
      order: 2,
    },
    {
      id: 'files',
      title: 'Files',
      icon: 'file-text',
      colors: ['#3498DB', '#2980B9'],
      route: '/files',
      order: 3,
    },
    {
      id: 'care',
      title: 'Care',
      icon: 'https://r2-pub.rork.com/generated-images/822ece74-83d6-4af8-ada7-5a26d77cc924.png',
      colors: ['#E74C3C', '#C0392B'],
      route: '/care',
      order: 4,
    },
    {
      id: 'flowchart',
      title: 'Flowchart',
      icon: 'https://r2-pub.rork.com/generated-images/b8077cfa-3ddc-4cfe-b692-46a1f6e55f5a.png',
      colors: ['#3498DB', '#2980B9'],
      route: '/flowchart',
      order: 5,
    },
    {
      id: 'rsi',
      title: 'RSI',
      icon: 'https://r2-pub.rork.com/generated-images/b1d7470d-e14d-432b-8b98-f651236a54a5.png',
      colors: ['#5E4B8C', '#4A3A7A'],
      route: '/rsi',
      order: 6,
    },
    {
      id: 'cpr',
      title: 'CPR',
      icon: 'https://r2-pub.rork.com/generated-images/8732baee-2f89-4de1-b8ea-82d00a628d03.png',
      colors: ['#E74C3C', '#C0392B'],
      route: '/cpr',
      order: 7,
    },
    {
      id: 'ai',
      title: 'AI Assistant',
      icon: 'bot',
      colors: ['#9B59B6', '#8E44AD'],
      route: '/ai-assistant',
      order: 8,
    },
  ],
  documents: [],
};

export const contentRouter = createTRPCRouter({
  getCategories: publicProcedure.query(() => {
    return contentStore.categories.sort((a, b) => a.order - b.order);
  }),

  addCategory: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        icon: z.string(),
        colors: z.array(z.string()),
        route: z.string(),
      })
    )
    .mutation(({ input }) => {
      const newCategory = {
        ...input,
        order: contentStore.categories.length,
      };
      contentStore.categories.push(newCategory);
      return newCategory;
    }),

  updateCategory: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        icon: z.string().optional(),
        colors: z.array(z.string()).optional(),
        route: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(({ input }) => {
      const index = contentStore.categories.findIndex((c) => c.id === input.id);
      if (index === -1) {
        throw new Error("Category not found");
      }

      contentStore.categories[index] = {
        ...contentStore.categories[index],
        ...input,
      };

      return contentStore.categories[index];
    }),

  deleteCategory: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      contentStore.categories = contentStore.categories.filter(
        (c) => c.id !== input.id
      );
      return { success: true };
    }),

  reorderCategories: publicProcedure
    .input(z.array(z.object({ id: z.string(), order: z.number() })))
    .mutation(({ input }) => {
      input.forEach((item) => {
        const category = contentStore.categories.find((c) => c.id === item.id);
        if (category) {
          category.order = item.order;
        }
      });
      return contentStore.categories.sort((a, b) => a.order - b.order);
    }),

  getDocuments: publicProcedure.query(() => {
    return contentStore.documents;
  }),

  uploadDocument: publicProcedure
    .input(
      z.object({
        name: z.string(),
        url: z.string(),
        type: z.string(),
        size: z.number(),
        category: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const newDoc = {
        id: Date.now().toString(),
        ...input,
        uploadedAt: new Date().toISOString(),
      };
      contentStore.documents.push(newDoc);
      return newDoc;
    }),

  deleteDocument: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      contentStore.documents = contentStore.documents.filter(
        (d: any) => d.id !== input.id
      );
      return { success: true };
    }),
});
