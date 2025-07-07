// Mock Supabase client for demo purposes
// In a real app, this would be a proper Supabase client

const mockSupabaseClient = {
  storage: {
    from: (bucketName) => ({
      upload: async (path, file) => ({
        data: { path: `${bucketName}/${path}` },
        error: null
      }),
      getPublicUrl: (path) => ({
        data: { publicUrl: `/audio/placeholder.mp3` }
      })
    })
  },
  auth: {
    signUp: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null }),
    signIn: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null }),
    signOut: async () => ({ error: null })
  },
  from: (tableName) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        order: () => ({
          limit: () => ({
            data: []
          })
        })
      }),
      order: () => ({
        limit: () => ({
          data: []
        })
      })
    }),
    insert: async () => ({ data: { id: 'mock-id' }, error: null }),
    update: async () => ({ data: { id: 'mock-id' }, error: null }),
    delete: async () => ({ data: { id: 'mock-id' }, error: null })
  })
};

export default mockSupabaseClient;