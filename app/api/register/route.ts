// app/api/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '../../../lib/db';
import { users } from '../../../lib/schema'
import debug from 'debug';
import { eq } from 'drizzle-orm';
import { promises as fs } from 'fs';
import path from 'path';
import { SECRET_KEY } from '@/lib/constants';

import jwt from 'jsonwebtoken';
import next from 'next';
 

export async function POST(req: NextRequest) {

  const logError = debug('app:error');
  const body = await req.json();
  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  try {
    const insertedUser = await db.insert(users).values({
      first_name: null,
      last_name: null,
      grade_level: null,
      location: null,
      birthday: null,
      gender: null,
      sport: null,
      team: null,
      position: null,
      number: null,
      email: email,
      image: null,
      password: hashedPassword, // Store the hashed password
      createdAt: new Date(), // Store the current timestamp as createdAt
    }).returning();

    const token = jwt.sign({ id: insertedUser[0].id }, SECRET_KEY, { expiresIn: '1h' });

    return NextResponse.json({ id: token }, { status: 200 });
  } catch (error) {
    logError('Error registering user: %O', error);
    const err = error as any;
    if (err.constraint == 'users_email_unique') {
      return NextResponse.json({ message: "This Email ID is already in use." }, { status: 500 });
    }

  }
}

export async function PUT(req: NextRequest) {
  const logError = debug('app:error');
  const formData = await req.formData();
  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const gradeLevel = formData.get('grade_level') as string;
  const location = formData.get('location') as string;
  const birthday = formData.get('birthday') as string;
  const gender = formData.get('gender') as string;
  const sport = formData.get('sport') as string;
  const team = formData.get('team') as string;
  const position = formData.get('position') as string;
  const number = formData.get('number') as string;
  const playerID = formData.get('playerID') as string;
  const image = formData.get('image') as File | null;
  let imageUrl = null;

  if (image) {
    // Create a path for the image (store it in public/uploads)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const fileName = `${Date.now()}-${image.name}`; // Give the file a unique name
    const filePath = path.join(uploadDir, fileName);

    // Read the image file as a buffer
    const buffer = Buffer.from(await image.arrayBuffer());

    // Write the file to the upload directory
    await fs.writeFile(filePath, buffer);

    // Set the image URL to be the relative path from the public directory
    imageUrl = `/uploads/${fileName}`;
  }

  const playerIDAsNumber = parseInt(playerID, 10);
  const updatedUser = await db
    .update(users)
    .set({
      first_name: firstName || null,
      last_name: lastName || null,
      grade_level: gradeLevel || null,
      location: location || null,
      birthday: birthday || null,
      gender: gender || null,
      sport: sport || null,
      team: team || null,
      position: position || null,
      number: number || null,
      image: imageUrl,

    })
    .where(eq(users.id, playerIDAsNumber))

    .execute();
  return NextResponse.json({ message:"Profile Completed" }, { status: 200 });
}


export async function GET(req: NextRequest) {
  const logError = debug('app:error');
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ message: 'No token provided.' }, { status: 401 });
  }
  const decoded = jwt.verify(token, SECRET_KEY); // No type assertion here initially

  // Type guard to check if decoded is JwtPayload
  if (typeof decoded === 'string') {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
  }

  // Safely get userId from decoded, defaulting to null if not found
  const userId = decoded.id || null; 


  return NextResponse.json({ userId }, { status: 200 });
}

