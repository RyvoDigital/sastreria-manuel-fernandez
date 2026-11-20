import { NextRequest, NextResponse } from 'next/server'
import { getHolidayDates } from '@/lib/booking/slots'

const NO_STORE = { 'Cache-Control': 'no-store, max-age=0' }
const ISO = /^\d{4}-\d{2}-\d{2}$/

// Holidays (whole days closed) between two dates, for the public booking calendar
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''
  if (!ISO.test(from) || !ISO.test(to) || to < from || Date.parse(to) - Date.parse(from) > 120 * 864e5) {
    return NextResponse.json({ success: false, error: 'Invalid range' }, { status: 400, headers: NO_STORE })
  }
  try {
    return NextResponse.json({ success: true, dates: await getHolidayDates(from, to) }, { headers: NO_STORE })
  } catch (err) {
    console.error('Closed days API error:', err)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500, headers: NO_STORE })
  }
}
