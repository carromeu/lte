import Dexie from 'dexie';

export const db = new Dexie('lte')

db.version(1).stores({
  tests: '++id, label, user, date'
})
