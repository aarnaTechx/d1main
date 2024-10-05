import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '../../../../lib/db';
import { coaches } from '../../../../lib/schema'
import debug from 'debug';
import { eq } from 'drizzle-orm';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import next from 'next';
import { SECRET_KEY } from '@/lib/constants';


export async function POST(req: NextRequest) {

    const logError = debug('app:error');
     
    const formData = await req.formData();

  // Extract form fields
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const gender = formData.get('gender') as string;
  const location = formData.get('location') as string;
  const sport = formData.get('sport') as string;
  const clubName = formData.get('clubName') as string;
  const qualifications = formData.get('qualifications') as string;
  const expectedCharge = formData.get('expectedCharge') as string;
  const password = formData.get('password') as string;

  // Handle the image if provided (optional)
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

  const slug = `${firstName.trim().toLowerCase().replace(/\s+/g, '-')}-${lastName.trim().toLowerCase().replace(/\s+/g, '-')}`;
  
    const hashedPassword = await hash(password, 10);
  
    try {
      const insertedUser = await db.insert(coaches).values({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        gender: gender,
        location: location,
        sport: sport,
        clubName: clubName,
        qualifications: qualifications,
        expectedCharge: expectedCharge,
        image: imageUrl,
        slug:slug,
        password: hashedPassword, // Store the hashed password
        createdAt: new Date(), // Store the current timestamp as createdAt
      }).returning();
  
      const token = jwt.sign({ id: insertedUser[0].id, name: insertedUser[0].firstName,image:imageUrl }, SECRET_KEY, { expiresIn: '1h' });
  
      return NextResponse.json({ token: token }, { status: 200 });
    } catch (error) {
      const err = error as any;
      logError('Error registering user: %O', error);
      if (err.constraint == 'users_email_unique') {
        return NextResponse.json({ message: "This Email ID is already in use." }, { status: 500 });
      }
  
    }
  }

  export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || ''; // Keep the search as a string
    
    try {
      // Using 'like' with lower case for case-insensitive search
      const coachlist = await db
        .select()
        .from(coaches)
        // Use 'like' for pattern matching
        .execute();
  
      return NextResponse.json(coachlist);
    } catch (error) {
      const err = error as any;
      console.error('Error fetching coaches:', error);
      return NextResponse.json({ message: 'Failed to fetch coaches' }, { status: 500 });
    }
  }