import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { initialAppState } from '@/lib/data';

const DB_PATH = path.join(process.cwd(), 'data', 'sync_state.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Add timestamp
    const payload = {
      timestamp: Date.now(),
      data
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(payload));
    return NextResponse.json({ success: true, timestamp: payload.timestamp });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Failed to sync state' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // If no sync file exists, return the initial state (hardcoded latest version)
      // This forces clients to update to the latest version instead of using stale localStorage
      return NextResponse.json({ data: initialAppState });
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    const payload = JSON.parse(content);
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve state' }, { status: 500 });
  }
}
