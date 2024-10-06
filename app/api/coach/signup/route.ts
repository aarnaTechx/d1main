import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '../../../../lib/db';
import { coaches } from '../../../../lib/schema';
import debug from 'debug';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '@/lib/constants';

export async function POST(req: NextRequest) {
  const logError = debug('app:error');
  const logInfo = debug('app:info');

  try {
    logInfo('Starting the registration process');
    
    // Parse the form data
    const formData = await req.formData();
    logInfo('Form data received successfully');

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

    if (!firstName || !lastName || !email || !password) {
      logError('Missing required fields');
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

   /* const image = formData.get('image') as File | null;
    let imageBlob: Buffer | null = null;

    if (image) {
      logInfo('Processing image file');
      imageBlob = Buffer.from(await image.arrayBuffer());
    }*/

    // Generate slug from first and last name
    const slug = `${firstName.trim().toLowerCase().replace(/\s+/g, '-')}-${lastName.trim().toLowerCase().replace(/\s+/g, '-')}`;
    logInfo('Generated slug:', slug);

    // Hash the password
    const hashedPassword = await hash(password, 10);
    logInfo('Password hashed successfully');

    // Insert the new coach into the database
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
      ///image: imageBlob,
      slug: slug,
      password: hashedPassword,
      createdAt: new Date(),
    }).returning();
    
    logInfo('User inserted successfully into the database');

    // Create JWT token for the new user
    const token = jwt.sign(
      { id: insertedUser[0].id, name: insertedUser[0].firstName },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    logInfo('JWT token created successfully');

    // Return the response with the generated token
    return NextResponse.json({ token: token }, { status: 200 });

  } catch (error) {
    const err = error as any;
    logError('Error during registration: %O', error);

    // Handle specific error for unique email constraint
    if (err.constraint === 'users_email_unique') {
      logError('Email already in use');
      return NextResponse.json({ message: "This Email ID is already in use." }, { status: 500 });
    }

    // Return a generic error response for any other errors
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || ''; // Keep the search as a string

  try {
    // Fetch the coach list from the database
    const coachlist = await db
      .select()
      .from(coaches)
      .execute();

    // Return the coach list as a JSON response
    return NextResponse.json(coachlist);

  } catch (error) {
    const err = error as any;
    console.error('Error fetching coaches:', error);

    // Return an error response if fetching fails
    return NextResponse.json(
      { message: 'Failed to fetch coaches' },
      { status: 500 }
    );
  }
}
