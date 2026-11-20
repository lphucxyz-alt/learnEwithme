export interface PersonalExamFile {
  id: string
  name: string
  size: number
  addedAt: string
}

interface StoredExamFile extends PersonalExamFile {
  blob: Blob
}

const databaseName = 'ielts-local-exam-library'
const storeName = 'papers'

function database() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(storeName, { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Không mở được thư viện đề cá nhân.'))
  })
}

export async function listPersonalExams() {
  const db = await database()
  return new Promise<PersonalExamFile[]>((resolve, reject) => {
    const request = db.transaction(storeName, 'readonly').objectStore(storeName).getAll()
    request.onsuccess = () => resolve((request.result as StoredExamFile[]).map(record => ({
      id: record.id, name: record.name, size: record.size, addedAt: record.addedAt
    })).sort((a, b) => b.addedAt.localeCompare(a.addedAt)))
    request.onerror = () => reject(request.error ?? new Error('Không đọc được thư viện đề cá nhân.'))
    request.transaction?.addEventListener('complete', () => db.close(), { once: true })
  })
}

export async function savePersonalExam(file: File) {
  const db = await database()
  const record: StoredExamFile = { id: crypto.randomUUID(), name: file.name, size: file.size, addedAt: new Date().toISOString(), blob: file }
  return new Promise<PersonalExamFile>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    transaction.objectStore(storeName).put(record)
    transaction.oncomplete = () => { db.close(); resolve({ id: record.id, name: record.name, size: record.size, addedAt: record.addedAt }) }
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Không lưu được tệp trên thiết bị.')) }
  })
}

export async function getPersonalExam(id: string) {
  const db = await database()
  return new Promise<Blob | undefined>((resolve, reject) => {
    const request = db.transaction(storeName, 'readonly').objectStore(storeName).get(id)
    request.onsuccess = () => resolve((request.result as StoredExamFile | undefined)?.blob)
    request.onerror = () => reject(request.error ?? new Error('Không đọc được tệp đề thi.'))
    request.transaction?.addEventListener('complete', () => db.close(), { once: true })
  })
}

export async function deletePersonalExam(id: string) {
  const db = await database()
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    transaction.objectStore(storeName).delete(id)
    transaction.oncomplete = () => { db.close(); resolve() }
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Không gỡ được tệp đề thi.')) }
  })
}
