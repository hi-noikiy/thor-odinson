import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'

import { env } from '../env'

export function parseTimestamp(ts?: Timestamp): Date {
  if (ts) {
    return new Date(parseInt(`${ts.getSeconds()}000`))
  }
  return new Date()
}

export function productIdFromName(name: string): string {
  return name.split('/')[3]
}

export function formatNumber(num: number): string {
  const str = num.toString()
  return str.length === 1 ? `0${str}` : str
}

export function formatDate(date: Date): string {
  const year = formatNumber(date.getFullYear())
  const month = formatNumber(date.getMonth() + 1)
  const day = formatNumber(date.getDate())
  const hours = formatNumber(date.getHours())
  const mins = formatNumber(date.getMinutes())
  return `${year}-${month}-${day} ${hours}:${mins}`
}
