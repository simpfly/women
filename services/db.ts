import { PlayerProfile, UserStory } from '../types';
import { INITIAL_STORIES } from '../data/stories';

// Environment variables
const API_KEY = process.env.MONGODB_API_KEY;
const ENDPOINT = process.env.MONGODB_ENDPOINT;
const DATA_SOURCE = process.env.MONGODB_DATA_SOURCE || 'Cluster0';
const DATABASE = process.env.MONGODB_DATABASE || 'feminist-allergen';

const PROFILE_COLLECTION = 'profiles';
const STORY_COLLECTION = 'stories';

// Helper for MongoDB Atlas Data API
async function mongoRequest(action: string, collection: string, body: any) {
  if (!API_KEY || !ENDPOINT) return null;
  try {
    const response = await fetch(`${ENDPOINT}/action/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      body: JSON.stringify({
        dataSource: DATA_SOURCE,
        database: DATABASE,
        collection: collection,
        ...body,
      }),
    });
    if (!response.ok) {
        throw new Error(`MongoDB API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (e) {
    console.warn("MongoDB connection failed, falling back to local.", e);
    return null;
  }
}

export const db = {
  // --- PROFILE MANAGEMENT ---

  async loadProfile(userId: string | null): Promise<PlayerProfile | null> {
    // 1. Try to load from LocalStorage first (Cache/Fallback)
    const localData = localStorage.getItem('feminist_allergen_profile');
    let profile: PlayerProfile | null = localData ? JSON.parse(localData) : null;

    // 2. If we have MongoDB keys, try to fetch/sync
    if (API_KEY && ENDPOINT) {
        // If we have a local user ID, fetch that specific user
        const lookupId = userId || profile?.id;
        
        if (lookupId) {
            const data = await mongoRequest('findOne', PROFILE_COLLECTION, {
                filter: { id: lookupId }
            });

            if (data?.document) {
                // Cloud data found, update local cache
                profile = data.document as PlayerProfile;
                localStorage.setItem('feminist_allergen_profile', JSON.stringify(profile));
            } else if (profile) {
                // Local data exists but cloud doesn't (Migration case), sync up
                await this.saveProfile(profile);
            }
        }
    }

    return profile;
  },

  async saveProfile(profile: PlayerProfile): Promise<void> {
    // 1. Always save to LocalStorage for immediate UI feedback and offline support
    localStorage.setItem('feminist_allergen_profile', JSON.stringify(profile));

    // 2. Sync to MongoDB if available
    if (API_KEY && ENDPOINT) {
        try {
            await mongoRequest('updateOne', PROFILE_COLLECTION, {
                filter: { id: profile.id },
                update: { $set: profile },
                upsert: true
            });
        } catch (e) {
            console.error("Failed to save to cloud", e);
        }
    }
  },

  // --- STORY MANAGEMENT ---

  async getStories(): Promise<UserStory[]> {
    let stories = [...INITIAL_STORIES];

    // Try to fetch community stories from Mongo
    if (API_KEY && ENDPOINT) {
        try {
            const data = await mongoRequest('find', STORY_COLLECTION, {
                filter: { isOfficial: { $ne: true } }, // Get user submissions
                sort: { timestamp: -1 },
                limit: 50
            });
            
            if (data?.documents) {
                stories = [...stories, ...data.documents];
            }
        } catch (e) {
            console.warn("Could not fetch stories from cloud");
        }
    } else {
        // Fallback to local user stories if any
        const localStories = localStorage.getItem('feminist_stories');
        if (localStories) {
            stories = [...JSON.parse(localStories), ...stories];
        }
    }
    
    // Sort by timestamp descending
    return stories.sort((a, b) => b.timestamp - a.timestamp);
  },

  async addStory(story: UserStory): Promise<void> {
      // Save locally
      const localStories = localStorage.getItem('feminist_stories');
      const parsed = localStories ? JSON.parse(localStories) : [];
      localStorage.setItem('feminist_stories', JSON.stringify([story, ...parsed]));

      // Save to Cloud
      if (API_KEY && ENDPOINT) {
          await mongoRequest('insertOne', STORY_COLLECTION, { document: story });
      }
  },

  async supportStory(storyId: string): Promise<void> {
      if (API_KEY && ENDPOINT) {
          await mongoRequest('updateOne', STORY_COLLECTION, {
              filter: { id: storyId },
              update: { $inc: { supportCount: 1 } }
          });
      }
      // Note: We handle local UI update optimistically in App.tsx
  },

  // --- STATISTICS ---
  
  async getGlobalStats(): Promise<{ totalUsers: number } | null> {
      if (!API_KEY || !ENDPOINT) return null;
      try {
          const data = await mongoRequest('aggregate', PROFILE_COLLECTION, {
              pipeline: [{ $count: "total" }]
          });
          if (data?.documents?.[0]) {
              return { totalUsers: data.documents[0].total };
          }
      } catch (e) {
          return null;
      }
      return null;
  }
}